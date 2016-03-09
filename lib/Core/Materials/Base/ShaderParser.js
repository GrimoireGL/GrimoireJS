import ContextComponents from "../../../ContextComponents";
import JThreeContext from "../../../JThreeContext";
import JSON5 from "json5";
/**
 * Static parsing methods for XMML (eXtended Material Markup Language).
 * This class provides all useful methods for parsing XMML.
 */
class ShaderParser {
    /**
     * Parse raw XMML
     * @param  {string}               whole string code of XMML
     * @return {IProgramDescription} information of parsed codes.
     */
    static parseCombined(codeString) {
        codeString = ShaderParser._removeMultiLineComment(codeString);
        codeString = ShaderParser._removeLineComment(codeString);
        const materialManager = JThreeContext.getContextComponent(ContextComponents.MaterialManager);
        return ShaderParser.parseImport(codeString, materialManager).then(result => {
            const uniforms = ShaderParser._parseVariables(codeString, "uniform");
            const attributes = ShaderParser._parseVariables(codeString, "attribute");
            const functions = ShaderParser._parseFunctions(codeString);
            let fragment = ShaderParser._removeSelfOnlyTag(ShaderParser._removeOtherPart(result, "vert"), "frag");
            let vertex = ShaderParser._removeSelfOnlyTag(ShaderParser._removeOtherPart(result, "frag"), "vert");
            fragment = ShaderParser._removeAttributeVariables(fragment);
            fragment = ShaderParser._removeVariableAnnotations(fragment);
            vertex = ShaderParser._removeVariableAnnotations(vertex);
            let fragPrecision = ShaderParser._obtainPrecisions(fragment);
            let vertPrecision = ShaderParser._obtainPrecisions(vertex);
            if (!fragPrecision["float"]) {
                fragment = this._addPrecision(fragment, "float", "mediump");
                fragPrecision["float"] = "mediump";
            }
            return {
                attributes: attributes,
                fragment: fragment,
                vertex: vertex,
                uniforms: uniforms,
                fragmentPrecisions: fragPrecision,
                vertexPrecisions: vertPrecision,
                functions: functions
            };
        });
    }
    static getImports(source) {
        let importArgs = [];
        const importRegex = /\s*@import\s+"([^"]+)"/g;
        while (true) {
            const importEnum = importRegex.exec(source);
            if (!importEnum) {
                break;
            }
            importArgs.push(importEnum[1]);
        }
        return importArgs;
    }
    /**
     * Parse @import syntax and replace them with corresponded codes.
     * @param  {string}          source          source code XMML to be processed for @import.
     * @param  {MaterialManager} materialManager the material manager instance containing imported codes.
     * @return {string}                          replaced codes.
     */
    static parseImport(source, materialManager) {
        return materialManager.loadChunks(ShaderParser.getImports(source)).then(() => {
            while (true) {
                const regexResult = /\s*@import\s+"([^"]+)"/.exec(source);
                if (!regexResult) {
                    break;
                }
                let importContent;
                importContent = materialManager.getShaderChunk(regexResult[1]);
                if (!importContent) {
                    console.error(`Required shader chunk '${regexResult[1]}' was not found!!`);
                    importContent = "";
                }
                source = source.replace(regexResult[0], `\n${importContent}\n`);
            }
            return source;
        });
    }
    static parseInternalImport(source, materialManager) {
        while (true) {
            const regexResult = /\s*@import\s+"([^"]+)"/.exec(source);
            if (!regexResult) {
                break;
            }
            let importContent;
            importContent = materialManager.getShaderChunk(regexResult[1]);
            if (!importContent) {
                console.error(`Required shader chunk '${regexResult[1]}' was not found!!`);
                importContent = "";
            }
            source = source.replace(regexResult[0], `\n${importContent}\n`);
        }
        return source;
    }
    static _parseFunctions(source) {
        const regex = /([a-zA-Z]\w*)\s+([a-zA-Z]\w*)\s*\(([^\)]*?)\)\s*(?=\{)/g;
        const result = {};
        let regexResult;
        while ((regexResult = regex.exec(source))) {
            let returnType = regexResult[1];
            let functionName = regexResult[2];
            let args = regexResult[3];
            // console.log("returnType:" + returnType);
            // console.log("funcName:" + functionName);
            // console.log("args:" + args);
            let argumentDescriptions = [];
            // parse arguments
            if (args !== "void" && args !== "") {
                let argsArray = args.split(",");
                for (let i = 0; i < argsArray.length; i++) {
                    console.log("arg" + i + ":" + argsArray[i]);
                    let spl = argsArray[i].split(" ");
                    if (spl.length === 3) {
                        let argType = spl[0];
                        let argP = spl[1];
                        let argName = spl[2];
                        argumentDescriptions.push({
                            variableName: argName,
                            variableType: argType,
                            variablePrecision: argP
                        });
                    }
                    else {
                        let argType = spl[0];
                        let argName = spl[1];
                        argumentDescriptions.push({
                            variableName: argName,
                            variableType: argType,
                        });
                    }
                }
            }
            result[name] = {
                functionName: functionName,
                functionType: returnType,
                functionPrecision: undefined,
                functionArgments: argumentDescriptions
            };
        }
        return result;
    }
    static _parseVariableAttributes(attributes) {
        return JSON5.parse(attributes);
    }
    // http://regexper.com/#(%3F%3A%5C%2F%5C%2F%40%5C((.%2B)%5C))%3F%5Cs*uniform%5Cs%2B((%3F%3Alowp%7Cmediump%7Chighp)%5Cs%2B)%3F(%5Ba-z0-9A-Z%5D%2B)%5Cs%2B(%5Ba-zA-Z0-9_%5D%2B)(%3F%3A%5Cs*%5C%5B%5Cs*(%5Cd%2B)%5Cs*%5C%5D%5Cs*)%3F%5Cs*%3B
    static _generateVariableFetchRegex(variableType) {
        return new RegExp(`(?:@(\\{.+\\}))?\\s*${variableType}\\s+(?:(lowp|mediump|highp)\\s+)?([a-z0-9A-Z]+)\\s+([a-zA-Z0-9_]+)(?:\\s*\\[\\s*(\\d+)\\s*\\]\\s*)?\\s*;`, "g");
    }
    static _parseVariables(source, variableType) {
        const result = {};
        const regex = ShaderParser._generateVariableFetchRegex(variableType);
        let regexResult;
        while ((regexResult = regex.exec(source))) {
            let name = regexResult[4];
            let type = regexResult[3];
            let precision = regexResult[2];
            let rawAnnotations = regexResult[1];
            result[name] = {
                variableName: name,
                variableType: type,
                variablePrecision: precision,
                variableAnnotation: rawAnnotations ? this._parseVariableAttributes(rawAnnotations) : {},
                isArray: (typeof regexResult[5] !== "undefined"),
                arrayLength: (typeof regexResult[5] !== "undefined") ? parseInt(regexResult[5], 10) : undefined
            };
        }
        return result;
    }
    static _removeVariableAnnotations(source) {
        const regex = new RegExp("@\\{.+\\}", "g");
        let regexResult;
        while ((regexResult = regex.exec(source))) {
            source = source.substr(0, regexResult.index) + source.substring(regexResult.index + regexResult[0].length, source.length);
        }
        return source;
    }
    static _removeLineComment(source) {
        let text = source;
        const regex = /(\/\/.*)/g;
        while (true) {
            const found = regex.exec(text);
            if (!found) {
                break;
            }
            let beginPoint = found.index;
            text = text.substr(0, beginPoint) + text.substring(beginPoint + found[0].length, text.length);
        }
        return text;
    }
    static _removeMultiLineComment(source) {
        while (true) {
            const found = source.indexOf("/*", 0);
            if (found < 0) {
                break; // When there was no more found
            }
            let beginPoint = found;
            const endPoint = source.indexOf("*/", beginPoint);
            if (endPoint < 1) {
                // error no bracket matching
                console.error("Invalid bracket matching!");
                return source;
            }
            source = source.substr(0, beginPoint) + source.substring(endPoint + 2, source.length);
        }
        return source;
    }
    static _getEndBracketIndex(source, startIndex, beginBracket, endBracket) {
        // get index of matching endBracket
        let index = startIndex;
        let bracketCount = 1;
        while (true) {
            if (bracketCount === 0) {
                break;
            }
            index++;
            const nextEndBlacket = source.indexOf(endBracket, index);
            const nextBeginBlacket = source.indexOf(beginBracket, index);
            if (nextEndBlacket < 0) {
                // error no bracket matching
                console.error("Invalid bracket matching!");
                return -1;
            }
            if (nextBeginBlacket < 0) {
                index = nextEndBlacket;
                bracketCount--;
                continue;
            }
            if (nextEndBlacket < nextBeginBlacket) {
                index = nextEndBlacket;
                bracketCount--;
                continue;
            }
            else {
                index = nextBeginBlacket;
                bracketCount++;
                continue;
            }
        }
        return index;
    }
    static _removeOtherPart(source, partFlag) {
        const regex = new RegExp(`\s*(?:\/\/+)?\s*@${partFlag}`, "g");
        while (true) {
            const found = regex.exec(source);
            if (!found) {
                break; // When there was no more found
            }
            let beginPoint = found.index;
            let index = source.indexOf("{", beginPoint); // ignore next {
            const endPoint = this._getEndBracketIndex(source, index, "{", "}") + 1;
            if (endPoint < 1) {
                // error no bracket matching
                console.error("Invalid bracket matching!");
                return source;
            }
            source = source.substr(0, beginPoint) + source.substring(endPoint, source.length);
        }
        return source;
    }
    static _removeSelfOnlyTag(source, partFlag) {
        const regex = new RegExp(`(\s*(?:\/\/+)?\s*@${partFlag})`, "g");
        while (true) {
            const found = regex.exec(source);
            if (!found) {
                break; // When there was no more found
            }
            let index = source.indexOf("{", found.index); // ignore next {
            let beginPoint = index;
            const endPoint = this._getEndBracketIndex(source, index, "{", "}") + 1;
            if (endPoint < 1) {
                // error no bracket matching
                console.error("Invalid bracket matching!");
                return source;
            }
            source = source.substr(0, found.index) + source.substring(beginPoint + 1, endPoint - 1) + source.substring(endPoint + 1, source.length);
        }
        return source;
    }
    static _addPrecision(source, targetType, precision) {
        return `precision ${precision} ${targetType};\n` + source;
    }
    static _obtainPrecisions(source) {
        const regex = /\s*precision\s+([a-z]+)\s+([a-z0-9]+)/g;
        let result = {};
        while (true) {
            const found = regex.exec(source);
            if (!found) {
                break;
            }
            result[found[2]] = found[1];
        }
        return result;
    }
    static _removeAttributeVariables(source) {
        const regex = /(\s*attribute\s+[a-zA-Z0-9_]+\s+[a-zA-Z0-9_]+;)/;
        while (true) {
            let found = regex.exec(source);
            if (!found) {
                break;
            }
            source = source.replace(found[0], "");
        }
        return source;
    }
}
export default ShaderParser;
