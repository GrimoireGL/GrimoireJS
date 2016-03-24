import ProgramTransformer from "./ShaderTransformers/ProgramTransformer";
import StringTransformer from "./ShaderTransformers/StringTransformer";
import DescriptionTransformer from "./ShaderTransformers/DescriptionTransformer";
import ContextComponents from "../../../ContextComponents";
import JThreeContext from "../../../JThreeContext";
import JSON5 from "json5";
import Q from "q";
/**
 * Static parsing methods for XMML (eXtended Material Markup Language).
 * This class provides all useful methods for parsing XMML.
 */
class ShaderParser {
    static transform(source, transformers) {
        let promise = Q.when(null);
        for (let i = 0; i < transformers.length; i++) {
            promise = promise.then(function (arg) {
                console.log("");
                console.log("stage:" + (i + 1));
                let obj;
                obj = {
                    initialSource: source,
                    transformSource: arg == null ? source : arg.transformSource,
                    description: arg == null ? {
                        fragment: null,
                        vertex: null,
                        uniforms: null,
                        attributes: null,
                        fragmentPrecisions: null,
                        vertexPrecisions: null,
                        functions: null
                    } : arg.description
                };
                console.log("current arg:initialSource:" + obj.initialSource);
                console.log("transformSource:" + obj.transformSource);
                console.log("description:" + obj.description);
                let t = transformers[i];
                return t.transform(obj);
            });
        }
        return promise;
    }
    /**
     * Parse raw XMML
     * @param  {string}               whole string code of XMML
     * @return {IProgramDescription} information of parsed codes.
     */
    static parseCombined(codeString) {
        const materialManager = JThreeContext.getContextComponent(ContextComponents.MaterialManager);
        let transformers = [];
        transformers.push(new StringTransformer((x) => {
            return ShaderParser._removeMultiLineComment(x);
        }));
        transformers.push(new StringTransformer((arg) => {
            return ShaderParser._removeLineComment(arg);
        }));
        transformers.push(new ProgramTransformer((arg) => {
            return ShaderParser.parseImport(arg.transformSource, materialManager).then((s) => {
                return {
                    initialSource: arg.initialSource,
                    transformSource: s,
                    description: arg.description
                };
            });
        }));
        transformers.push(new DescriptionTransformer((arg) => {
            let uniforms = ShaderParser._parseVariables(arg.transformSource, "uniform");
            return {
                fragment: arg.description.fragment,
                vertex: arg.description.vertex,
                uniforms: uniforms,
                attributes: arg.description.attributes,
                fragmentPrecisions: arg.description.fragmentPrecisions,
                vertexPrecisions: arg.description.vertexPrecisions,
                functions: arg.description.functions
            };
        }));
        transformers.push(new DescriptionTransformer((arg) => {
            let attributes = ShaderParser._parseVariables(arg.transformSource, "attribute");
            return {
                fragment: arg.description.fragment,
                vertex: arg.description.vertex,
                uniforms: arg.description.uniforms,
                attributes: attributes,
                fragmentPrecisions: arg.description.fragmentPrecisions,
                vertexPrecisions: arg.description.vertexPrecisions,
                functions: arg.description.functions
            };
        }));
        transformers.push(new DescriptionTransformer((arg) => {
            let functions = ShaderParser._parseFunctions(arg.transformSource);
            return {
                fragment: arg.description.fragment,
                vertex: arg.description.vertex,
                uniforms: arg.description.uniforms,
                attributes: arg.description.attributes,
                fragmentPrecisions: arg.description.fragmentPrecisions,
                vertexPrecisions: arg.description.vertexPrecisions,
                functions: functions
            };
        }));
        transformers.push(new DescriptionTransformer((arg) => {
            let fragment = ShaderParser._removeSelfOnlyTag(ShaderParser._removeOtherPart(arg.transformSource, "vert"), "frag");
            return {
                fragment: fragment,
                vertex: arg.description.vertex,
                uniforms: arg.description.uniforms,
                attributes: arg.description.attributes,
                fragmentPrecisions: arg.description.fragmentPrecisions,
                vertexPrecisions: arg.description.vertexPrecisions,
                functions: arg.description.functions
            };
        }));
        transformers.push(new DescriptionTransformer((arg) => {
            let vertex = ShaderParser._removeSelfOnlyTag(ShaderParser._removeOtherPart(arg.transformSource, "frag"), "vert");
            return {
                fragment: arg.description.fragment,
                vertex: vertex,
                uniforms: arg.description.uniforms,
                attributes: arg.description.attributes,
                fragmentPrecisions: arg.description.fragmentPrecisions,
                vertexPrecisions: arg.description.vertexPrecisions,
                functions: arg.description.functions
            };
        }));
        transformers.push(new DescriptionTransformer((arg) => {
            return {
                fragment: ShaderParser._removeAttributeVariables(arg.description.fragment),
                vertex: arg.description.vertex,
                uniforms: arg.description.uniforms,
                attributes: arg.description.attributes,
                fragmentPrecisions: arg.description.fragmentPrecisions,
                vertexPrecisions: arg.description.vertexPrecisions,
                functions: arg.description.functions
            };
        }));
        transformers.push(new DescriptionTransformer((arg) => {
            return {
                fragment: ShaderParser._removeVariableAnnotations(arg.description.fragment),
                vertex: arg.description.vertex,
                uniforms: arg.description.uniforms,
                attributes: arg.description.attributes,
                fragmentPrecisions: arg.description.fragmentPrecisions,
                vertexPrecisions: arg.description.vertexPrecisions,
                functions: arg.description.functions
            };
        }));
        transformers.push(new DescriptionTransformer((arg) => {
            return {
                fragment: arg.description.fragment,
                vertex: ShaderParser._removeVariableAnnotations(arg.description.vertex),
                uniforms: arg.description.uniforms,
                attributes: arg.description.attributes,
                fragmentPrecisions: arg.description.fragmentPrecisions,
                vertexPrecisions: arg.description.vertexPrecisions,
                functions: arg.description.functions
            };
        }));
        transformers.push(new DescriptionTransformer((arg) => {
            return {
                fragment: arg.description.fragment,
                vertex: arg.description.vertex,
                uniforms: arg.description.uniforms,
                attributes: arg.description.attributes,
                fragmentPrecisions: ShaderParser._obtainPrecisions(arg.description.fragment),
                vertexPrecisions: arg.description.vertexPrecisions,
                functions: arg.description.functions
            };
        }));
        transformers.push(new DescriptionTransformer((arg) => {
            return {
                fragment: arg.description.fragment,
                vertex: arg.description.vertex,
                uniforms: arg.description.uniforms,
                attributes: arg.description.attributes,
                fragmentPrecisions: arg.description.fragmentPrecisions,
                vertexPrecisions: ShaderParser._obtainPrecisions(arg.description.vertex),
                functions: arg.description.functions
            };
        }));
        transformers.push(new DescriptionTransformer((arg) => {
            let description = {
                fragment: arg.description.fragment,
                vertex: arg.description.vertex,
                uniforms: arg.description.uniforms,
                attributes: arg.description.attributes,
                fragmentPrecisions: arg.description.fragmentPrecisions,
                vertexPrecisions: arg.description.vertexPrecisions,
                functions: arg.description.functions
            };
            if (!arg.description.fragmentPrecisions["float"]) {
                description.fragment = this._addPrecision(description.fragment, "float", "mediump");
                description.fragmentPrecisions["float"] = "mediump";
            }
            return description;
        }));
        return ShaderParser.transform(codeString, transformers).then((arg) => arg.description);
        // codeString = ShaderParser._removeMultiLineComment(codeString);
        // codeString = ShaderParser._removeLineComment(codeString);
        // return ShaderParser.parseImport(codeString, materialManager).then<IProgramDescription>(result => {
        //   // const uniforms = ShaderParser._parseVariables(codeString, "uniform");
        //   // const attributes = ShaderParser._parseVariables(codeString, "attribute");
        //   // const functions = ShaderParser._parseFunctions(codeString);
        //   // let fragment = ShaderParser._removeSelfOnlyTag(ShaderParser._removeOtherPart(result, "vert"), "frag");
        //   // let vertex = ShaderParser._removeSelfOnlyTag(ShaderParser._removeOtherPart(result, "frag"), "vert");
        //   // fragment = ShaderParser._removeAttributeVariables(fragment);
        //   // fragment = ShaderParser._removeVariableAnnotations(fragment);
        //   // vertex = ShaderParser._removeVariableAnnotations(vertex);
        //   // let fragPrecision = ShaderParser._obtainPrecisions(fragment);
        //   // let vertPrecision = ShaderParser._obtainPrecisions(vertex);
        //   // if (!fragPrecision["float"]) {// When precision of float in fragment shader was not declared,precision mediump float need to be inserted.
        //   //   fragment = this._addPrecision(fragment, "float", "mediump");
        //   //   fragPrecision["float"] = "mediump";
        //   // }
        //   // return {
        //   //   attributes: attributes,
        //   //   fragment: fragment,
        //   //   vertex: vertex,
        //   //   uniforms: uniforms,
        //   //   fragmentPrecisions: fragPrecision,
        //   //   vertexPrecisions: vertPrecision,
        //   //   functions: functions
        //   // };
        // });
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
    // `
    static _removeVariableAnnotations(source) {
        let regexResult;
        while (regexResult = /@\{.+\}/g.exec(source)) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvcmUvTWF0ZXJpYWxzL0Jhc2UvU2hhZGVyUGFyc2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQU1PLGtCQUFrQixNQUFNLHlDQUF5QztPQUNqRSxpQkFBaUIsTUFBTSx3Q0FBd0M7T0FDL0Qsc0JBQXNCLE1BQU0sNkNBQTZDO09BQ3pFLGlCQUFpQixNQUFNLDRCQUE0QjtPQUNuRCxhQUFhLE1BQU0sd0JBQXdCO09BRTNDLEtBQUssTUFBTSxPQUFPO09BQ2xCLENBQUMsTUFBTSxHQUFHO0FBQ2pCOzs7R0FHRztBQUNIO0lBQ0UsT0FBYyxTQUFTLENBQUMsTUFBYyxFQUFFLFlBQW1DO1FBQ3pFLElBQUksT0FBTyxHQUFrQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzFELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzdDLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFvQixVQUFTLEdBQUc7Z0JBQ3BELE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hDLElBQUksR0FJSCxDQUFDO2dCQUNGLEdBQUcsR0FBRztvQkFDSixhQUFhLEVBQUUsTUFBTTtvQkFDckIsZUFBZSxFQUFFLEdBQUcsSUFBSSxJQUFJLEdBQUcsTUFBTSxHQUFHLEdBQUcsQ0FBQyxlQUFlO29CQUMzRCxXQUFXLEVBQUUsR0FBRyxJQUFJLElBQUksR0FBRzt3QkFDekIsUUFBUSxFQUFFLElBQUk7d0JBQ2QsTUFBTSxFQUFFLElBQUk7d0JBQ1osUUFBUSxFQUFFLElBQUk7d0JBQ2QsVUFBVSxFQUFFLElBQUk7d0JBQ2hCLGtCQUFrQixFQUFFLElBQUk7d0JBQ3hCLGdCQUFnQixFQUFFLElBQUk7d0JBQ3RCLFNBQVMsRUFBRSxJQUFJO3FCQUNoQixHQUFHLEdBQUcsQ0FBQyxXQUFXO2lCQUNwQixDQUFDO2dCQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUM5RCxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFDdEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUM5QyxJQUFJLENBQUMsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzFCLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUNELE1BQU0sQ0FBQyxPQUFPLENBQUM7SUFDakIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxPQUFjLGFBQWEsQ0FBQyxVQUFrQjtRQUU1QyxNQUFNLGVBQWUsR0FBRyxhQUFhLENBQUMsbUJBQW1CLENBQWtCLGlCQUFpQixDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQzlHLElBQUksWUFBWSxHQUEwQixFQUFFLENBQUM7UUFDN0MsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLGlCQUFpQixDQUFDLENBQUMsQ0FBUztZQUNoRCxNQUFNLENBQUMsWUFBWSxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pELENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDSixZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksaUJBQWlCLENBQUMsQ0FBQyxHQUFXO1lBQ2xELE1BQU0sQ0FBQyxZQUFZLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDOUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNKLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxrQkFBa0IsQ0FBQyxDQUFDLEdBQXNCO1lBQzlELE1BQU0sQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsZUFBZSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBUztnQkFDbkYsTUFBTSxDQUFDO29CQUNMLGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYTtvQkFDaEMsZUFBZSxFQUFFLENBQUM7b0JBQ2xCLFdBQVcsRUFBRSxHQUFHLENBQUMsV0FBVztpQkFDN0IsQ0FBQztZQUNKLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNKLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxzQkFBc0IsQ0FBQyxDQUFDLEdBQXNCO1lBQ2xFLElBQUksUUFBUSxHQUFHLFlBQVksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUM1RSxNQUFNLENBQUM7Z0JBQ0wsUUFBUSxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsUUFBUTtnQkFDbEMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsTUFBTTtnQkFDOUIsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLFVBQVUsRUFBRSxHQUFHLENBQUMsV0FBVyxDQUFDLFVBQVU7Z0JBQ3RDLGtCQUFrQixFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsa0JBQWtCO2dCQUN0RCxnQkFBZ0IsRUFBRSxHQUFHLENBQUMsV0FBVyxDQUFDLGdCQUFnQjtnQkFDbEQsU0FBUyxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsU0FBUzthQUNyQyxDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNKLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxzQkFBc0IsQ0FBQyxDQUFDLEdBQXNCO1lBQ2xFLElBQUksVUFBVSxHQUFHLFlBQVksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxXQUFXLENBQUMsQ0FBQztZQUNoRixNQUFNLENBQUM7Z0JBQ0wsUUFBUSxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsUUFBUTtnQkFDbEMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsTUFBTTtnQkFDOUIsUUFBUSxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsUUFBUTtnQkFDbEMsVUFBVSxFQUFFLFVBQVU7Z0JBQ3RCLGtCQUFrQixFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsa0JBQWtCO2dCQUN0RCxnQkFBZ0IsRUFBRSxHQUFHLENBQUMsV0FBVyxDQUFDLGdCQUFnQjtnQkFDbEQsU0FBUyxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsU0FBUzthQUNyQyxDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNKLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxzQkFBc0IsQ0FBQyxDQUFDLEdBQXNCO1lBQ2xFLElBQUksU0FBUyxHQUFHLFlBQVksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ2xFLE1BQU0sQ0FBQztnQkFDTCxRQUFRLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxRQUFRO2dCQUNsQyxNQUFNLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxNQUFNO2dCQUM5QixRQUFRLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxRQUFRO2dCQUNsQyxVQUFVLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxVQUFVO2dCQUN0QyxrQkFBa0IsRUFBRSxHQUFHLENBQUMsV0FBVyxDQUFDLGtCQUFrQjtnQkFDdEQsZ0JBQWdCLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0I7Z0JBQ2xELFNBQVMsRUFBRSxTQUFTO2FBQ3JCLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ0osWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLHNCQUFzQixDQUFDLENBQUMsR0FBc0I7WUFDbEUsSUFBSSxRQUFRLEdBQUcsWUFBWSxDQUFDLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLE1BQU0sQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ25ILE1BQU0sQ0FBQztnQkFDTCxRQUFRLEVBQUUsUUFBUTtnQkFDbEIsTUFBTSxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsTUFBTTtnQkFDOUIsUUFBUSxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsUUFBUTtnQkFDbEMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsVUFBVTtnQkFDdEMsa0JBQWtCLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxrQkFBa0I7Z0JBQ3RELGdCQUFnQixFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCO2dCQUNsRCxTQUFTLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxTQUFTO2FBQ3JDLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ0osWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLHNCQUFzQixDQUFDLENBQUMsR0FBc0I7WUFDbEUsSUFBSSxNQUFNLEdBQUcsWUFBWSxDQUFDLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLE1BQU0sQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ2pILE1BQU0sQ0FBQztnQkFDTCxRQUFRLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxRQUFRO2dCQUNsQyxNQUFNLEVBQUUsTUFBTTtnQkFDZCxRQUFRLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxRQUFRO2dCQUNsQyxVQUFVLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxVQUFVO2dCQUN0QyxrQkFBa0IsRUFBRSxHQUFHLENBQUMsV0FBVyxDQUFDLGtCQUFrQjtnQkFDdEQsZ0JBQWdCLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0I7Z0JBQ2xELFNBQVMsRUFBRSxHQUFHLENBQUMsV0FBVyxDQUFDLFNBQVM7YUFDckMsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDSixZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksc0JBQXNCLENBQUMsQ0FBQyxHQUFzQjtZQUNsRSxNQUFNLENBQUM7Z0JBQ0wsUUFBUSxFQUFFLFlBQVksQ0FBQyx5QkFBeUIsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQztnQkFDMUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsTUFBTTtnQkFDOUIsUUFBUSxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsUUFBUTtnQkFDbEMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsVUFBVTtnQkFDdEMsa0JBQWtCLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxrQkFBa0I7Z0JBQ3RELGdCQUFnQixFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCO2dCQUNsRCxTQUFTLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxTQUFTO2FBQ3JDLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ0osWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLHNCQUFzQixDQUFDLENBQUMsR0FBc0I7WUFDbEUsTUFBTSxDQUFDO2dCQUNMLFFBQVEsRUFBRSxZQUFZLENBQUMsMEJBQTBCLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUM7Z0JBQzNFLE1BQU0sRUFBRSxHQUFHLENBQUMsV0FBVyxDQUFDLE1BQU07Z0JBQzlCLFFBQVEsRUFBRSxHQUFHLENBQUMsV0FBVyxDQUFDLFFBQVE7Z0JBQ2xDLFVBQVUsRUFBRSxHQUFHLENBQUMsV0FBVyxDQUFDLFVBQVU7Z0JBQ3RDLGtCQUFrQixFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsa0JBQWtCO2dCQUN0RCxnQkFBZ0IsRUFBRSxHQUFHLENBQUMsV0FBVyxDQUFDLGdCQUFnQjtnQkFDbEQsU0FBUyxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsU0FBUzthQUNyQyxDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNKLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxzQkFBc0IsQ0FBQyxDQUFDLEdBQXNCO1lBQ2xFLE1BQU0sQ0FBQztnQkFDTCxRQUFRLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxRQUFRO2dCQUNsQyxNQUFNLEVBQUUsWUFBWSxDQUFDLDBCQUEwQixDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDO2dCQUN2RSxRQUFRLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxRQUFRO2dCQUNsQyxVQUFVLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxVQUFVO2dCQUN0QyxrQkFBa0IsRUFBRSxHQUFHLENBQUMsV0FBVyxDQUFDLGtCQUFrQjtnQkFDdEQsZ0JBQWdCLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0I7Z0JBQ2xELFNBQVMsRUFBRSxHQUFHLENBQUMsV0FBVyxDQUFDLFNBQVM7YUFDckMsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDSixZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksc0JBQXNCLENBQUMsQ0FBQyxHQUFzQjtZQUNsRSxNQUFNLENBQUM7Z0JBQ0wsUUFBUSxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsUUFBUTtnQkFDbEMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsTUFBTTtnQkFDOUIsUUFBUSxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsUUFBUTtnQkFDbEMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsVUFBVTtnQkFDdEMsa0JBQWtCLEVBQUUsWUFBWSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDO2dCQUM1RSxnQkFBZ0IsRUFBRSxHQUFHLENBQUMsV0FBVyxDQUFDLGdCQUFnQjtnQkFDbEQsU0FBUyxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsU0FBUzthQUNyQyxDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNKLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxzQkFBc0IsQ0FBQyxDQUFDLEdBQXNCO1lBQ2xFLE1BQU0sQ0FBQztnQkFDTCxRQUFRLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxRQUFRO2dCQUNsQyxNQUFNLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxNQUFNO2dCQUM5QixRQUFRLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxRQUFRO2dCQUNsQyxVQUFVLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxVQUFVO2dCQUN0QyxrQkFBa0IsRUFBRSxHQUFHLENBQUMsV0FBVyxDQUFDLGtCQUFrQjtnQkFDdEQsZ0JBQWdCLEVBQUUsWUFBWSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDO2dCQUN4RSxTQUFTLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxTQUFTO2FBQ3JDLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ0osWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLHNCQUFzQixDQUFDLENBQUMsR0FBc0I7WUFDbEUsSUFBSSxXQUFXLEdBQXdCO2dCQUNyQyxRQUFRLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxRQUFRO2dCQUNsQyxNQUFNLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxNQUFNO2dCQUM5QixRQUFRLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxRQUFRO2dCQUNsQyxVQUFVLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxVQUFVO2dCQUN0QyxrQkFBa0IsRUFBRSxHQUFHLENBQUMsV0FBVyxDQUFDLGtCQUFrQjtnQkFDdEQsZ0JBQWdCLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0I7Z0JBQ2xELFNBQVMsRUFBRSxHQUFHLENBQUMsV0FBVyxDQUFDLFNBQVM7YUFDckMsQ0FBQztZQUNGLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pELFdBQVcsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDcEYsV0FBVyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQztZQUN0RCxDQUFDO1lBQ0QsTUFBTSxDQUFDLFdBQVcsQ0FBQztRQUNyQixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRUosTUFBTSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQXNCLEtBQUssR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzFHLGlFQUFpRTtRQUNqRSw0REFBNEQ7UUFDNUQscUdBQXFHO1FBQ3JHLDZFQUE2RTtRQUM3RSxpRkFBaUY7UUFDakYsbUVBQW1FO1FBQ25FLDhHQUE4RztRQUM5Ryw0R0FBNEc7UUFDNUcsb0VBQW9FO1FBQ3BFLHFFQUFxRTtRQUNyRSxpRUFBaUU7UUFDakUscUVBQXFFO1FBQ3JFLG1FQUFtRTtRQUNuRSxpSkFBaUo7UUFDakosc0VBQXNFO1FBQ3RFLDZDQUE2QztRQUM3QyxTQUFTO1FBQ1QsZ0JBQWdCO1FBQ2hCLGlDQUFpQztRQUNqQyw2QkFBNkI7UUFDN0IseUJBQXlCO1FBQ3pCLDZCQUE2QjtRQUM3Qiw0Q0FBNEM7UUFDNUMsMENBQTBDO1FBQzFDLDhCQUE4QjtRQUM5QixVQUFVO1FBQ1YsTUFBTTtJQUNSLENBQUM7SUFFRCxPQUFjLFVBQVUsQ0FBQyxNQUFjO1FBQ3JDLElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQztRQUNwQixNQUFNLFdBQVcsR0FBRyx5QkFBeUIsQ0FBQztRQUM5QyxPQUFPLElBQUksRUFBRSxDQUFDO1lBQ1osTUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM1QyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQUMsS0FBSyxDQUFDO1lBQUMsQ0FBQztZQUMzQixVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pDLENBQUM7UUFDRCxNQUFNLENBQUMsVUFBVSxDQUFDO0lBQ3BCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILE9BQWMsV0FBVyxDQUFDLE1BQWMsRUFBRSxlQUFnQztRQUN4RSxNQUFNLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFTO1lBQzlFLE9BQU8sSUFBSSxFQUFFLENBQUM7Z0JBQ1osTUFBTSxXQUFXLEdBQUcsd0JBQXdCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUMxRCxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7b0JBQUMsS0FBSyxDQUFDO2dCQUFDLENBQUM7Z0JBQzVCLElBQUksYUFBYSxDQUFDO2dCQUNsQixhQUFhLEdBQUcsZUFBZSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDL0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO29CQUNuQixPQUFPLENBQUMsS0FBSyxDQUFDLDBCQUEwQixXQUFXLENBQUMsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUM7b0JBQzNFLGFBQWEsR0FBRyxFQUFFLENBQUM7Z0JBQ3JCLENBQUM7Z0JBQ0QsTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssYUFBYSxJQUFJLENBQUMsQ0FBQztZQUNsRSxDQUFDO1lBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNoQixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxPQUFjLG1CQUFtQixDQUFDLE1BQWMsRUFBRSxlQUFnQztRQUNoRixPQUFPLElBQUksRUFBRSxDQUFDO1lBQ1osTUFBTSxXQUFXLEdBQUcsd0JBQXdCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzFELEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFBQyxLQUFLLENBQUM7WUFBQyxDQUFDO1lBQzVCLElBQUksYUFBYSxDQUFDO1lBQ2xCLGFBQWEsR0FBRyxlQUFlLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9ELEVBQUUsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDbkIsT0FBTyxDQUFDLEtBQUssQ0FBQywwQkFBMEIsV0FBVyxDQUFDLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO2dCQUMzRSxhQUFhLEdBQUcsRUFBRSxDQUFDO1lBQ3JCLENBQUM7WUFDRCxNQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxhQUFhLElBQUksQ0FBQyxDQUFDO1FBQ2xFLENBQUM7UUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxPQUFlLGVBQWUsQ0FBQyxNQUFjO1FBQzNDLE1BQU0sS0FBSyxHQUFHLHlEQUF5RCxDQUFDO1FBQ3hFLE1BQU0sTUFBTSxHQUE2QyxFQUFFLENBQUM7UUFDNUQsSUFBSSxXQUFXLENBQUM7UUFDaEIsT0FBTyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUMxQyxJQUFJLFVBQVUsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEMsSUFBSSxZQUFZLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLElBQUksSUFBSSxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxQixJQUFJLG9CQUFvQixHQUEyQixFQUFFLENBQUM7WUFFdEQsa0JBQWtCO1lBQ2xCLEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2hDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO29CQUMxQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM1QyxJQUFJLEdBQUcsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNsQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3JCLElBQUksT0FBTyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDckIsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNsQixJQUFJLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3JCLG9CQUFvQixDQUFDLElBQUksQ0FBdUI7NEJBQzlDLFlBQVksRUFBRSxPQUFPOzRCQUNyQixZQUFZLEVBQUUsT0FBTzs0QkFDckIsaUJBQWlCLEVBQUUsSUFBSTt5QkFDeEIsQ0FBQyxDQUFDO29CQUNMLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ04sSUFBSSxPQUFPLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNyQixJQUFJLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3JCLG9CQUFvQixDQUFDLElBQUksQ0FBdUI7NEJBQzlDLFlBQVksRUFBRSxPQUFPOzRCQUNyQixZQUFZLEVBQUUsT0FBTzt5QkFDdEIsQ0FBQyxDQUFDO29CQUNMLENBQUM7Z0JBQ0gsQ0FBQztZQUNILENBQUM7WUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQXlCO2dCQUNuQyxZQUFZLEVBQUUsWUFBWTtnQkFDMUIsWUFBWSxFQUFFLFVBQVU7Z0JBQ3hCLGlCQUFpQixFQUFFLFNBQVM7Z0JBQzVCLGdCQUFnQixFQUFFLG9CQUFvQjthQUN2QyxDQUFDO1FBQ0osQ0FBQztRQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVELE9BQWUsd0JBQXdCLENBQUMsVUFBa0I7UUFDeEQsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUNELHlPQUF5TztJQUN6TyxPQUFlLDJCQUEyQixDQUFDLFlBQW9CO1FBQzdELE1BQU0sQ0FBQyxJQUFJLE1BQU0sQ0FBQyx1QkFBdUIsWUFBWSwwR0FBMEcsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN4SyxDQUFDO0lBRUQsT0FBZSxlQUFlLENBQUMsTUFBYyxFQUFFLFlBQW9CO1FBQ2pFLE1BQU0sTUFBTSxHQUE2QyxFQUFFLENBQUM7UUFDNUQsTUFBTSxLQUFLLEdBQUcsWUFBWSxDQUFDLDJCQUEyQixDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3JFLElBQUksV0FBVyxDQUFDO1FBQ2hCLE9BQU8sQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDMUMsSUFBSSxJQUFJLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFCLElBQUksSUFBSSxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxQixJQUFJLFNBQVMsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0IsSUFBSSxjQUFjLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBeUI7Z0JBQ25DLFlBQVksRUFBRSxJQUFJO2dCQUNsQixZQUFZLEVBQUUsSUFBSTtnQkFDbEIsaUJBQWlCLEVBQUUsU0FBUztnQkFDNUIsa0JBQWtCLEVBQUUsY0FBYyxHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFO2dCQUN2RixPQUFPLEVBQUUsQ0FBQyxPQUFPLFdBQVcsQ0FBQyxDQUFDLENBQUMsS0FBSyxXQUFXLENBQUM7Z0JBQ2hELFdBQVcsRUFBRSxDQUFDLE9BQU8sV0FBVyxDQUFDLENBQUMsQ0FBQyxLQUFLLFdBQVcsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsU0FBUzthQUNoRyxDQUFDO1FBQ0osQ0FBQztRQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUNELElBQUk7SUFDSixPQUFlLDBCQUEwQixDQUFDLE1BQWM7UUFDdEQsSUFBSSxXQUFXLENBQUM7UUFDaEIsT0FBTyxXQUFXLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO1lBQzdDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzVILENBQUM7UUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxPQUFlLGtCQUFrQixDQUFDLE1BQWM7UUFDOUMsSUFBSSxJQUFJLEdBQVcsTUFBTSxDQUFDO1FBQzFCLE1BQU0sS0FBSyxHQUFHLFdBQVcsQ0FBQztRQUMxQixPQUFPLElBQUksRUFBRSxDQUFDO1lBQ1osTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMvQixFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsS0FBSyxDQUFDO1lBQ1IsQ0FBQztZQUNELElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7WUFDN0IsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2hHLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNELE9BQWUsdUJBQXVCLENBQUMsTUFBYztRQUNuRCxPQUFPLElBQUksRUFBRSxDQUFDO1lBQ1osTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdEMsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2QsS0FBSyxDQUFDLENBQUMsK0JBQStCO1lBQ3hDLENBQUM7WUFDRCxJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUM7WUFDdkIsTUFBTSxRQUFRLEdBQVcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDMUQsRUFBRSxDQUFDLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pCLDRCQUE0QjtnQkFDNUIsT0FBTyxDQUFDLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO2dCQUMzQyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ2hCLENBQUM7WUFFRCxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4RixDQUFDO1FBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBRUQsT0FBZSxtQkFBbUIsQ0FBQyxNQUFjLEVBQUUsVUFBa0IsRUFBRSxZQUFvQixFQUFFLFVBQWtCO1FBQzdHLG1DQUFtQztRQUNuQyxJQUFJLEtBQUssR0FBRyxVQUFVLENBQUM7UUFFdkIsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDO1FBQ3JCLE9BQU8sSUFBSSxFQUFFLENBQUM7WUFDWixFQUFFLENBQUMsQ0FBQyxZQUFZLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkIsS0FBSyxDQUFDO1lBQ1IsQ0FBQztZQUNELEtBQUssRUFBRSxDQUFDO1lBQ1IsTUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDekQsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQztZQUM3RCxFQUFFLENBQUMsQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkIsNEJBQTRCO2dCQUM1QixPQUFPLENBQUMsS0FBSyxDQUFDLDJCQUEyQixDQUFDLENBQUM7Z0JBQzNDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNaLENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixLQUFLLEdBQUcsY0FBYyxDQUFDO2dCQUN2QixZQUFZLEVBQUUsQ0FBQztnQkFDZixRQUFRLENBQUM7WUFDWCxDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsY0FBYyxHQUFHLGdCQUFnQixDQUFDLENBQUMsQ0FBQztnQkFDdEMsS0FBSyxHQUFHLGNBQWMsQ0FBQztnQkFDdkIsWUFBWSxFQUFFLENBQUM7Z0JBQ2YsUUFBUSxDQUFDO1lBQ1gsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQztnQkFDekIsWUFBWSxFQUFFLENBQUM7Z0JBQ2YsUUFBUSxDQUFDO1lBQ1gsQ0FBQztRQUNILENBQUM7UUFDRCxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVELE9BQWUsZ0JBQWdCLENBQUMsTUFBYyxFQUFFLFFBQWdCO1FBQzlELE1BQU0sS0FBSyxHQUFHLElBQUksTUFBTSxDQUFDLG9CQUFvQixRQUFRLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM5RCxPQUFPLElBQUksRUFBRSxDQUFDO1lBQ1osTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNqQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsS0FBSyxDQUFDLENBQUMsK0JBQStCO1lBQ3hDLENBQUM7WUFDRCxJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO1lBQzdCLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCO1lBQzdELE1BQU0sUUFBUSxHQUFXLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDL0UsRUFBRSxDQUFDLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pCLDRCQUE0QjtnQkFDNUIsT0FBTyxDQUFDLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO2dCQUMzQyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ2hCLENBQUM7WUFFRCxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3BGLENBQUM7UUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxPQUFlLGtCQUFrQixDQUFDLE1BQWMsRUFBRSxRQUFnQjtRQUNoRSxNQUFNLEtBQUssR0FBRyxJQUFJLE1BQU0sQ0FBQyxxQkFBcUIsUUFBUSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDaEUsT0FBTyxJQUFJLEVBQUUsQ0FBQztZQUNaLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDakMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNYLEtBQUssQ0FBQyxDQUFDLCtCQUErQjtZQUN4QyxDQUFDO1lBQ0QsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsZ0JBQWdCO1lBQzlELElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQztZQUN2QixNQUFNLFFBQVEsR0FBVyxJQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQy9FLEVBQUUsQ0FBQyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqQiw0QkFBNEI7Z0JBQzVCLE9BQU8sQ0FBQyxLQUFLLENBQUMsMkJBQTJCLENBQUMsQ0FBQztnQkFDM0MsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUNoQixDQUFDO1lBQ0QsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQUUsUUFBUSxHQUFHLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUksQ0FBQztRQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVELE9BQWUsYUFBYSxDQUFDLE1BQWMsRUFBRSxVQUFrQixFQUFFLFNBQWlCO1FBQ2hGLE1BQU0sQ0FBQyxhQUFhLFNBQVMsSUFBSSxVQUFVLEtBQUssR0FBRyxNQUFNLENBQUM7SUFDNUQsQ0FBQztJQUVELE9BQWUsaUJBQWlCLENBQUMsTUFBYztRQUM3QyxNQUFNLEtBQUssR0FBRyx3Q0FBd0MsQ0FBQztRQUN2RCxJQUFJLE1BQU0sR0FBK0IsRUFBRSxDQUFDO1FBQzVDLE9BQU8sSUFBSSxFQUFFLENBQUM7WUFDWixNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2pDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDWCxLQUFLLENBQUM7WUFDUixDQUFDO1lBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QixDQUFDO1FBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBRUQsT0FBZSx5QkFBeUIsQ0FBQyxNQUFjO1FBQ3JELE1BQU0sS0FBSyxHQUFHLGlEQUFpRCxDQUFDO1FBQ2hFLE9BQU8sSUFBSSxFQUFFLENBQUM7WUFDWixJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQy9CLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDWCxLQUFLLENBQUM7WUFDUixDQUFDO1lBQ0QsTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3hDLENBQUM7UUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2hCLENBQUM7QUFDSCxDQUFDO0FBRUQsZUFBZSxZQUFZLENBQUMiLCJmaWxlIjoiQ29yZS9NYXRlcmlhbHMvQmFzZS9TaGFkZXJQYXJzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSVZhcmlhYmxlRGVzY3JpcHRpb24gZnJvbSBcIi4vSVZhcmlhYmxlRGVzY3JpcHRpb25cIjtcbmltcG9ydCBJRnVuY3Rpb25EZXNjcmlwdGlvbiBmcm9tIFwiLi9JRnVuY3Rpb25EZXNjcmlwdGlvblwiO1xuaW1wb3J0IElBcmd1bWVudERlc2NyaXB0aW9uIGZyb20gXCIuL0lBcmd1bWVudERlc2NyaXB0aW9uXCI7XG5pbXBvcnQgSVByb2dyYW1EZXNjcmlwdGlvbiBmcm9tIFwiLi9JUHJvZ3JhbURlc2NyaXB0aW9uXCI7XG5pbXBvcnQgSVByb2dyYW1UcmFuc2Zvcm1lciBmcm9tIFwiLi9JUHJvZ3JhbVRyYW5zZm9ybWVyXCI7XG5pbXBvcnQgSVByb2dyYW1UcmFuc2Zvcm0gZnJvbSBcIi4vSVByb2dyYW1UcmFuc2Zvcm1cIjtcbmltcG9ydCBQcm9ncmFtVHJhbnNmb3JtZXIgZnJvbSBcIi4vU2hhZGVyVHJhbnNmb3JtZXJzL1Byb2dyYW1UcmFuc2Zvcm1lclwiO1xuaW1wb3J0IFN0cmluZ1RyYW5zZm9ybWVyIGZyb20gXCIuL1NoYWRlclRyYW5zZm9ybWVycy9TdHJpbmdUcmFuc2Zvcm1lclwiO1xuaW1wb3J0IERlc2NyaXB0aW9uVHJhbnNmb3JtZXIgZnJvbSBcIi4vU2hhZGVyVHJhbnNmb3JtZXJzL0Rlc2NyaXB0aW9uVHJhbnNmb3JtZXJcIjtcbmltcG9ydCBDb250ZXh0Q29tcG9uZW50cyBmcm9tIFwiLi4vLi4vLi4vQ29udGV4dENvbXBvbmVudHNcIjtcbmltcG9ydCBKVGhyZWVDb250ZXh0IGZyb20gXCIuLi8uLi8uLi9KVGhyZWVDb250ZXh0XCI7XG5pbXBvcnQgTWF0ZXJpYWxNYW5hZ2VyIGZyb20gXCIuL01hdGVyaWFsTWFuYWdlclwiO1xuaW1wb3J0IEpTT041IGZyb20gXCJqc29uNVwiO1xuaW1wb3J0IFEgZnJvbSBcInFcIjtcbi8qKlxuICogU3RhdGljIHBhcnNpbmcgbWV0aG9kcyBmb3IgWE1NTCAoZVh0ZW5kZWQgTWF0ZXJpYWwgTWFya3VwIExhbmd1YWdlKS5cbiAqIFRoaXMgY2xhc3MgcHJvdmlkZXMgYWxsIHVzZWZ1bCBtZXRob2RzIGZvciBwYXJzaW5nIFhNTUwuXG4gKi9cbmNsYXNzIFNoYWRlclBhcnNlciB7XG4gIHB1YmxpYyBzdGF0aWMgdHJhbnNmb3JtKHNvdXJjZTogc3RyaW5nLCB0cmFuc2Zvcm1lcnM6IElQcm9ncmFtVHJhbnNmb3JtZXJbXSk6IFEuSVByb21pc2U8SVByb2dyYW1UcmFuc2Zvcm0+IHtcbiAgICBsZXQgcHJvbWlzZTogUS5JUHJvbWlzZTxJUHJvZ3JhbVRyYW5zZm9ybT4gPSBRLndoZW4obnVsbCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0cmFuc2Zvcm1lcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW48SVByb2dyYW1UcmFuc2Zvcm0+KGZ1bmN0aW9uKGFyZyk6IFEuSVByb21pc2U8SVByb2dyYW1UcmFuc2Zvcm0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJcIik7XG4gICAgICAgIGNvbnNvbGUubG9nKFwic3RhZ2U6XCIgKyAoaSArIDEpKTtcbiAgICAgICAgbGV0IG9iajoge1xuICAgICAgICAgIGluaXRpYWxTb3VyY2U6IHN0cmluZyxcbiAgICAgICAgICB0cmFuc2Zvcm1Tb3VyY2U6IHN0cmluZyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogSVByb2dyYW1EZXNjcmlwdGlvblxuICAgICAgICB9O1xuICAgICAgICBvYmogPSB7XG4gICAgICAgICAgaW5pdGlhbFNvdXJjZTogc291cmNlLFxuICAgICAgICAgIHRyYW5zZm9ybVNvdXJjZTogYXJnID09IG51bGwgPyBzb3VyY2UgOiBhcmcudHJhbnNmb3JtU291cmNlLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiBhcmcgPT0gbnVsbCA/IHtcbiAgICAgICAgICAgIGZyYWdtZW50OiBudWxsLFxuICAgICAgICAgICAgdmVydGV4OiBudWxsLFxuICAgICAgICAgICAgdW5pZm9ybXM6IG51bGwsXG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiBudWxsLFxuICAgICAgICAgICAgZnJhZ21lbnRQcmVjaXNpb25zOiBudWxsLFxuICAgICAgICAgICAgdmVydGV4UHJlY2lzaW9uczogbnVsbCxcbiAgICAgICAgICAgIGZ1bmN0aW9uczogbnVsbFxuICAgICAgICAgIH0gOiBhcmcuZGVzY3JpcHRpb25cbiAgICAgICAgfTtcbiAgICAgICAgY29uc29sZS5sb2coXCJjdXJyZW50IGFyZzppbml0aWFsU291cmNlOlwiICsgb2JqLmluaXRpYWxTb3VyY2UpO1xuICAgICAgICBjb25zb2xlLmxvZyhcInRyYW5zZm9ybVNvdXJjZTpcIiArIG9iai50cmFuc2Zvcm1Tb3VyY2UpO1xuICAgICAgICBjb25zb2xlLmxvZyhcImRlc2NyaXB0aW9uOlwiICsgb2JqLmRlc2NyaXB0aW9uKTtcbiAgICAgICAgbGV0IHQgPSB0cmFuc2Zvcm1lcnNbaV07XG4gICAgICAgIHJldHVybiB0LnRyYW5zZm9ybShvYmopO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhcnNlIHJhdyBYTU1MXG4gICAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgICAgICAgICB3aG9sZSBzdHJpbmcgY29kZSBvZiBYTU1MXG4gICAqIEByZXR1cm4ge0lQcm9ncmFtRGVzY3JpcHRpb259IGluZm9ybWF0aW9uIG9mIHBhcnNlZCBjb2Rlcy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcGFyc2VDb21iaW5lZChjb2RlU3RyaW5nOiBzdHJpbmcpOiBRLklQcm9taXNlPElQcm9ncmFtRGVzY3JpcHRpb24+IHtcblxuICAgIGNvbnN0IG1hdGVyaWFsTWFuYWdlciA9IEpUaHJlZUNvbnRleHQuZ2V0Q29udGV4dENvbXBvbmVudDxNYXRlcmlhbE1hbmFnZXI+KENvbnRleHRDb21wb25lbnRzLk1hdGVyaWFsTWFuYWdlcik7XG4gICAgbGV0IHRyYW5zZm9ybWVyczogSVByb2dyYW1UcmFuc2Zvcm1lcltdID0gW107XG4gICAgdHJhbnNmb3JtZXJzLnB1c2gobmV3IFN0cmluZ1RyYW5zZm9ybWVyKCh4OiBzdHJpbmcpID0+IHtcbiAgICAgIHJldHVybiBTaGFkZXJQYXJzZXIuX3JlbW92ZU11bHRpTGluZUNvbW1lbnQoeCk7XG4gICAgfSkpO1xuICAgIHRyYW5zZm9ybWVycy5wdXNoKG5ldyBTdHJpbmdUcmFuc2Zvcm1lcigoYXJnOiBzdHJpbmcpID0+IHtcbiAgICAgIHJldHVybiBTaGFkZXJQYXJzZXIuX3JlbW92ZUxpbmVDb21tZW50KGFyZyk7XG4gICAgfSkpO1xuICAgIHRyYW5zZm9ybWVycy5wdXNoKG5ldyBQcm9ncmFtVHJhbnNmb3JtZXIoKGFyZzogSVByb2dyYW1UcmFuc2Zvcm0pID0+IHtcbiAgICAgIHJldHVybiBTaGFkZXJQYXJzZXIucGFyc2VJbXBvcnQoYXJnLnRyYW5zZm9ybVNvdXJjZSwgbWF0ZXJpYWxNYW5hZ2VyKS50aGVuKChzOiBzdHJpbmcpID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpbml0aWFsU291cmNlOiBhcmcuaW5pdGlhbFNvdXJjZSxcbiAgICAgICAgICB0cmFuc2Zvcm1Tb3VyY2U6IHMsXG4gICAgICAgICAgZGVzY3JpcHRpb246IGFyZy5kZXNjcmlwdGlvblxuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgfSkpO1xuICAgIHRyYW5zZm9ybWVycy5wdXNoKG5ldyBEZXNjcmlwdGlvblRyYW5zZm9ybWVyKChhcmc6IElQcm9ncmFtVHJhbnNmb3JtKSA9PiB7XG4gICAgICBsZXQgdW5pZm9ybXMgPSBTaGFkZXJQYXJzZXIuX3BhcnNlVmFyaWFibGVzKGFyZy50cmFuc2Zvcm1Tb3VyY2UsIFwidW5pZm9ybVwiKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGZyYWdtZW50OiBhcmcuZGVzY3JpcHRpb24uZnJhZ21lbnQsXG4gICAgICAgIHZlcnRleDogYXJnLmRlc2NyaXB0aW9uLnZlcnRleCxcbiAgICAgICAgdW5pZm9ybXM6IHVuaWZvcm1zLFxuICAgICAgICBhdHRyaWJ1dGVzOiBhcmcuZGVzY3JpcHRpb24uYXR0cmlidXRlcyxcbiAgICAgICAgZnJhZ21lbnRQcmVjaXNpb25zOiBhcmcuZGVzY3JpcHRpb24uZnJhZ21lbnRQcmVjaXNpb25zLFxuICAgICAgICB2ZXJ0ZXhQcmVjaXNpb25zOiBhcmcuZGVzY3JpcHRpb24udmVydGV4UHJlY2lzaW9ucyxcbiAgICAgICAgZnVuY3Rpb25zOiBhcmcuZGVzY3JpcHRpb24uZnVuY3Rpb25zXG4gICAgICB9O1xuICAgIH0pKTtcbiAgICB0cmFuc2Zvcm1lcnMucHVzaChuZXcgRGVzY3JpcHRpb25UcmFuc2Zvcm1lcigoYXJnOiBJUHJvZ3JhbVRyYW5zZm9ybSkgPT4ge1xuICAgICAgbGV0IGF0dHJpYnV0ZXMgPSBTaGFkZXJQYXJzZXIuX3BhcnNlVmFyaWFibGVzKGFyZy50cmFuc2Zvcm1Tb3VyY2UsIFwiYXR0cmlidXRlXCIpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZnJhZ21lbnQ6IGFyZy5kZXNjcmlwdGlvbi5mcmFnbWVudCxcbiAgICAgICAgdmVydGV4OiBhcmcuZGVzY3JpcHRpb24udmVydGV4LFxuICAgICAgICB1bmlmb3JtczogYXJnLmRlc2NyaXB0aW9uLnVuaWZvcm1zLFxuICAgICAgICBhdHRyaWJ1dGVzOiBhdHRyaWJ1dGVzLFxuICAgICAgICBmcmFnbWVudFByZWNpc2lvbnM6IGFyZy5kZXNjcmlwdGlvbi5mcmFnbWVudFByZWNpc2lvbnMsXG4gICAgICAgIHZlcnRleFByZWNpc2lvbnM6IGFyZy5kZXNjcmlwdGlvbi52ZXJ0ZXhQcmVjaXNpb25zLFxuICAgICAgICBmdW5jdGlvbnM6IGFyZy5kZXNjcmlwdGlvbi5mdW5jdGlvbnNcbiAgICAgIH07XG4gICAgfSkpO1xuICAgIHRyYW5zZm9ybWVycy5wdXNoKG5ldyBEZXNjcmlwdGlvblRyYW5zZm9ybWVyKChhcmc6IElQcm9ncmFtVHJhbnNmb3JtKSA9PiB7XG4gICAgICBsZXQgZnVuY3Rpb25zID0gU2hhZGVyUGFyc2VyLl9wYXJzZUZ1bmN0aW9ucyhhcmcudHJhbnNmb3JtU291cmNlKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGZyYWdtZW50OiBhcmcuZGVzY3JpcHRpb24uZnJhZ21lbnQsXG4gICAgICAgIHZlcnRleDogYXJnLmRlc2NyaXB0aW9uLnZlcnRleCxcbiAgICAgICAgdW5pZm9ybXM6IGFyZy5kZXNjcmlwdGlvbi51bmlmb3JtcyxcbiAgICAgICAgYXR0cmlidXRlczogYXJnLmRlc2NyaXB0aW9uLmF0dHJpYnV0ZXMsXG4gICAgICAgIGZyYWdtZW50UHJlY2lzaW9uczogYXJnLmRlc2NyaXB0aW9uLmZyYWdtZW50UHJlY2lzaW9ucyxcbiAgICAgICAgdmVydGV4UHJlY2lzaW9uczogYXJnLmRlc2NyaXB0aW9uLnZlcnRleFByZWNpc2lvbnMsXG4gICAgICAgIGZ1bmN0aW9uczogZnVuY3Rpb25zXG4gICAgICB9O1xuICAgIH0pKTtcbiAgICB0cmFuc2Zvcm1lcnMucHVzaChuZXcgRGVzY3JpcHRpb25UcmFuc2Zvcm1lcigoYXJnOiBJUHJvZ3JhbVRyYW5zZm9ybSkgPT4ge1xuICAgICAgbGV0IGZyYWdtZW50ID0gU2hhZGVyUGFyc2VyLl9yZW1vdmVTZWxmT25seVRhZyhTaGFkZXJQYXJzZXIuX3JlbW92ZU90aGVyUGFydChhcmcudHJhbnNmb3JtU291cmNlLCBcInZlcnRcIiksIFwiZnJhZ1wiKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGZyYWdtZW50OiBmcmFnbWVudCxcbiAgICAgICAgdmVydGV4OiBhcmcuZGVzY3JpcHRpb24udmVydGV4LFxuICAgICAgICB1bmlmb3JtczogYXJnLmRlc2NyaXB0aW9uLnVuaWZvcm1zLFxuICAgICAgICBhdHRyaWJ1dGVzOiBhcmcuZGVzY3JpcHRpb24uYXR0cmlidXRlcyxcbiAgICAgICAgZnJhZ21lbnRQcmVjaXNpb25zOiBhcmcuZGVzY3JpcHRpb24uZnJhZ21lbnRQcmVjaXNpb25zLFxuICAgICAgICB2ZXJ0ZXhQcmVjaXNpb25zOiBhcmcuZGVzY3JpcHRpb24udmVydGV4UHJlY2lzaW9ucyxcbiAgICAgICAgZnVuY3Rpb25zOiBhcmcuZGVzY3JpcHRpb24uZnVuY3Rpb25zXG4gICAgICB9O1xuICAgIH0pKTtcbiAgICB0cmFuc2Zvcm1lcnMucHVzaChuZXcgRGVzY3JpcHRpb25UcmFuc2Zvcm1lcigoYXJnOiBJUHJvZ3JhbVRyYW5zZm9ybSkgPT4ge1xuICAgICAgbGV0IHZlcnRleCA9IFNoYWRlclBhcnNlci5fcmVtb3ZlU2VsZk9ubHlUYWcoU2hhZGVyUGFyc2VyLl9yZW1vdmVPdGhlclBhcnQoYXJnLnRyYW5zZm9ybVNvdXJjZSwgXCJmcmFnXCIpLCBcInZlcnRcIik7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBmcmFnbWVudDogYXJnLmRlc2NyaXB0aW9uLmZyYWdtZW50LFxuICAgICAgICB2ZXJ0ZXg6IHZlcnRleCxcbiAgICAgICAgdW5pZm9ybXM6IGFyZy5kZXNjcmlwdGlvbi51bmlmb3JtcyxcbiAgICAgICAgYXR0cmlidXRlczogYXJnLmRlc2NyaXB0aW9uLmF0dHJpYnV0ZXMsXG4gICAgICAgIGZyYWdtZW50UHJlY2lzaW9uczogYXJnLmRlc2NyaXB0aW9uLmZyYWdtZW50UHJlY2lzaW9ucyxcbiAgICAgICAgdmVydGV4UHJlY2lzaW9uczogYXJnLmRlc2NyaXB0aW9uLnZlcnRleFByZWNpc2lvbnMsXG4gICAgICAgIGZ1bmN0aW9uczogYXJnLmRlc2NyaXB0aW9uLmZ1bmN0aW9uc1xuICAgICAgfTtcbiAgICB9KSk7XG4gICAgdHJhbnNmb3JtZXJzLnB1c2gobmV3IERlc2NyaXB0aW9uVHJhbnNmb3JtZXIoKGFyZzogSVByb2dyYW1UcmFuc2Zvcm0pID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGZyYWdtZW50OiBTaGFkZXJQYXJzZXIuX3JlbW92ZUF0dHJpYnV0ZVZhcmlhYmxlcyhhcmcuZGVzY3JpcHRpb24uZnJhZ21lbnQpLFxuICAgICAgICB2ZXJ0ZXg6IGFyZy5kZXNjcmlwdGlvbi52ZXJ0ZXgsXG4gICAgICAgIHVuaWZvcm1zOiBhcmcuZGVzY3JpcHRpb24udW5pZm9ybXMsXG4gICAgICAgIGF0dHJpYnV0ZXM6IGFyZy5kZXNjcmlwdGlvbi5hdHRyaWJ1dGVzLFxuICAgICAgICBmcmFnbWVudFByZWNpc2lvbnM6IGFyZy5kZXNjcmlwdGlvbi5mcmFnbWVudFByZWNpc2lvbnMsXG4gICAgICAgIHZlcnRleFByZWNpc2lvbnM6IGFyZy5kZXNjcmlwdGlvbi52ZXJ0ZXhQcmVjaXNpb25zLFxuICAgICAgICBmdW5jdGlvbnM6IGFyZy5kZXNjcmlwdGlvbi5mdW5jdGlvbnNcbiAgICAgIH07XG4gICAgfSkpO1xuICAgIHRyYW5zZm9ybWVycy5wdXNoKG5ldyBEZXNjcmlwdGlvblRyYW5zZm9ybWVyKChhcmc6IElQcm9ncmFtVHJhbnNmb3JtKSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBmcmFnbWVudDogU2hhZGVyUGFyc2VyLl9yZW1vdmVWYXJpYWJsZUFubm90YXRpb25zKGFyZy5kZXNjcmlwdGlvbi5mcmFnbWVudCksXG4gICAgICAgIHZlcnRleDogYXJnLmRlc2NyaXB0aW9uLnZlcnRleCxcbiAgICAgICAgdW5pZm9ybXM6IGFyZy5kZXNjcmlwdGlvbi51bmlmb3JtcyxcbiAgICAgICAgYXR0cmlidXRlczogYXJnLmRlc2NyaXB0aW9uLmF0dHJpYnV0ZXMsXG4gICAgICAgIGZyYWdtZW50UHJlY2lzaW9uczogYXJnLmRlc2NyaXB0aW9uLmZyYWdtZW50UHJlY2lzaW9ucyxcbiAgICAgICAgdmVydGV4UHJlY2lzaW9uczogYXJnLmRlc2NyaXB0aW9uLnZlcnRleFByZWNpc2lvbnMsXG4gICAgICAgIGZ1bmN0aW9uczogYXJnLmRlc2NyaXB0aW9uLmZ1bmN0aW9uc1xuICAgICAgfTtcbiAgICB9KSk7XG4gICAgdHJhbnNmb3JtZXJzLnB1c2gobmV3IERlc2NyaXB0aW9uVHJhbnNmb3JtZXIoKGFyZzogSVByb2dyYW1UcmFuc2Zvcm0pID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGZyYWdtZW50OiBhcmcuZGVzY3JpcHRpb24uZnJhZ21lbnQsXG4gICAgICAgIHZlcnRleDogU2hhZGVyUGFyc2VyLl9yZW1vdmVWYXJpYWJsZUFubm90YXRpb25zKGFyZy5kZXNjcmlwdGlvbi52ZXJ0ZXgpLFxuICAgICAgICB1bmlmb3JtczogYXJnLmRlc2NyaXB0aW9uLnVuaWZvcm1zLFxuICAgICAgICBhdHRyaWJ1dGVzOiBhcmcuZGVzY3JpcHRpb24uYXR0cmlidXRlcyxcbiAgICAgICAgZnJhZ21lbnRQcmVjaXNpb25zOiBhcmcuZGVzY3JpcHRpb24uZnJhZ21lbnRQcmVjaXNpb25zLFxuICAgICAgICB2ZXJ0ZXhQcmVjaXNpb25zOiBhcmcuZGVzY3JpcHRpb24udmVydGV4UHJlY2lzaW9ucyxcbiAgICAgICAgZnVuY3Rpb25zOiBhcmcuZGVzY3JpcHRpb24uZnVuY3Rpb25zXG4gICAgICB9O1xuICAgIH0pKTtcbiAgICB0cmFuc2Zvcm1lcnMucHVzaChuZXcgRGVzY3JpcHRpb25UcmFuc2Zvcm1lcigoYXJnOiBJUHJvZ3JhbVRyYW5zZm9ybSkgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZnJhZ21lbnQ6IGFyZy5kZXNjcmlwdGlvbi5mcmFnbWVudCxcbiAgICAgICAgdmVydGV4OiBhcmcuZGVzY3JpcHRpb24udmVydGV4LFxuICAgICAgICB1bmlmb3JtczogYXJnLmRlc2NyaXB0aW9uLnVuaWZvcm1zLFxuICAgICAgICBhdHRyaWJ1dGVzOiBhcmcuZGVzY3JpcHRpb24uYXR0cmlidXRlcyxcbiAgICAgICAgZnJhZ21lbnRQcmVjaXNpb25zOiBTaGFkZXJQYXJzZXIuX29idGFpblByZWNpc2lvbnMoYXJnLmRlc2NyaXB0aW9uLmZyYWdtZW50KSxcbiAgICAgICAgdmVydGV4UHJlY2lzaW9uczogYXJnLmRlc2NyaXB0aW9uLnZlcnRleFByZWNpc2lvbnMsXG4gICAgICAgIGZ1bmN0aW9uczogYXJnLmRlc2NyaXB0aW9uLmZ1bmN0aW9uc1xuICAgICAgfTtcbiAgICB9KSk7XG4gICAgdHJhbnNmb3JtZXJzLnB1c2gobmV3IERlc2NyaXB0aW9uVHJhbnNmb3JtZXIoKGFyZzogSVByb2dyYW1UcmFuc2Zvcm0pID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGZyYWdtZW50OiBhcmcuZGVzY3JpcHRpb24uZnJhZ21lbnQsXG4gICAgICAgIHZlcnRleDogYXJnLmRlc2NyaXB0aW9uLnZlcnRleCxcbiAgICAgICAgdW5pZm9ybXM6IGFyZy5kZXNjcmlwdGlvbi51bmlmb3JtcyxcbiAgICAgICAgYXR0cmlidXRlczogYXJnLmRlc2NyaXB0aW9uLmF0dHJpYnV0ZXMsXG4gICAgICAgIGZyYWdtZW50UHJlY2lzaW9uczogYXJnLmRlc2NyaXB0aW9uLmZyYWdtZW50UHJlY2lzaW9ucyxcbiAgICAgICAgdmVydGV4UHJlY2lzaW9uczogU2hhZGVyUGFyc2VyLl9vYnRhaW5QcmVjaXNpb25zKGFyZy5kZXNjcmlwdGlvbi52ZXJ0ZXgpLFxuICAgICAgICBmdW5jdGlvbnM6IGFyZy5kZXNjcmlwdGlvbi5mdW5jdGlvbnNcbiAgICAgIH07XG4gICAgfSkpO1xuICAgIHRyYW5zZm9ybWVycy5wdXNoKG5ldyBEZXNjcmlwdGlvblRyYW5zZm9ybWVyKChhcmc6IElQcm9ncmFtVHJhbnNmb3JtKSA9PiB7XG4gICAgICBsZXQgZGVzY3JpcHRpb246IElQcm9ncmFtRGVzY3JpcHRpb24gPSB7XG4gICAgICAgIGZyYWdtZW50OiBhcmcuZGVzY3JpcHRpb24uZnJhZ21lbnQsXG4gICAgICAgIHZlcnRleDogYXJnLmRlc2NyaXB0aW9uLnZlcnRleCxcbiAgICAgICAgdW5pZm9ybXM6IGFyZy5kZXNjcmlwdGlvbi51bmlmb3JtcyxcbiAgICAgICAgYXR0cmlidXRlczogYXJnLmRlc2NyaXB0aW9uLmF0dHJpYnV0ZXMsXG4gICAgICAgIGZyYWdtZW50UHJlY2lzaW9uczogYXJnLmRlc2NyaXB0aW9uLmZyYWdtZW50UHJlY2lzaW9ucyxcbiAgICAgICAgdmVydGV4UHJlY2lzaW9uczogYXJnLmRlc2NyaXB0aW9uLnZlcnRleFByZWNpc2lvbnMsXG4gICAgICAgIGZ1bmN0aW9uczogYXJnLmRlc2NyaXB0aW9uLmZ1bmN0aW9uc1xuICAgICAgfTtcbiAgICAgIGlmICghYXJnLmRlc2NyaXB0aW9uLmZyYWdtZW50UHJlY2lzaW9uc1tcImZsb2F0XCJdKSB7Ly8gV2hlbiBwcmVjaXNpb24gb2YgZmxvYXQgaW4gZnJhZ21lbnQgc2hhZGVyIHdhcyBub3QgZGVjbGFyZWQscHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQgbmVlZCB0byBiZSBpbnNlcnRlZC5cbiAgICAgICAgZGVzY3JpcHRpb24uZnJhZ21lbnQgPSB0aGlzLl9hZGRQcmVjaXNpb24oZGVzY3JpcHRpb24uZnJhZ21lbnQsIFwiZmxvYXRcIiwgXCJtZWRpdW1wXCIpO1xuICAgICAgICBkZXNjcmlwdGlvbi5mcmFnbWVudFByZWNpc2lvbnNbXCJmbG9hdFwiXSA9IFwibWVkaXVtcFwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRlc2NyaXB0aW9uO1xuICAgIH0pKTtcblxuICAgIHJldHVybiBTaGFkZXJQYXJzZXIudHJhbnNmb3JtKGNvZGVTdHJpbmcsIHRyYW5zZm9ybWVycykudGhlbigoYXJnOiBJUHJvZ3JhbVRyYW5zZm9ybSkgPT4gYXJnLmRlc2NyaXB0aW9uKTtcbiAgICAvLyBjb2RlU3RyaW5nID0gU2hhZGVyUGFyc2VyLl9yZW1vdmVNdWx0aUxpbmVDb21tZW50KGNvZGVTdHJpbmcpO1xuICAgIC8vIGNvZGVTdHJpbmcgPSBTaGFkZXJQYXJzZXIuX3JlbW92ZUxpbmVDb21tZW50KGNvZGVTdHJpbmcpO1xuICAgIC8vIHJldHVybiBTaGFkZXJQYXJzZXIucGFyc2VJbXBvcnQoY29kZVN0cmluZywgbWF0ZXJpYWxNYW5hZ2VyKS50aGVuPElQcm9ncmFtRGVzY3JpcHRpb24+KHJlc3VsdCA9PiB7XG4gICAgLy8gICAvLyBjb25zdCB1bmlmb3JtcyA9IFNoYWRlclBhcnNlci5fcGFyc2VWYXJpYWJsZXMoY29kZVN0cmluZywgXCJ1bmlmb3JtXCIpO1xuICAgIC8vICAgLy8gY29uc3QgYXR0cmlidXRlcyA9IFNoYWRlclBhcnNlci5fcGFyc2VWYXJpYWJsZXMoY29kZVN0cmluZywgXCJhdHRyaWJ1dGVcIik7XG4gICAgLy8gICAvLyBjb25zdCBmdW5jdGlvbnMgPSBTaGFkZXJQYXJzZXIuX3BhcnNlRnVuY3Rpb25zKGNvZGVTdHJpbmcpO1xuICAgIC8vICAgLy8gbGV0IGZyYWdtZW50ID0gU2hhZGVyUGFyc2VyLl9yZW1vdmVTZWxmT25seVRhZyhTaGFkZXJQYXJzZXIuX3JlbW92ZU90aGVyUGFydChyZXN1bHQsIFwidmVydFwiKSwgXCJmcmFnXCIpO1xuICAgIC8vICAgLy8gbGV0IHZlcnRleCA9IFNoYWRlclBhcnNlci5fcmVtb3ZlU2VsZk9ubHlUYWcoU2hhZGVyUGFyc2VyLl9yZW1vdmVPdGhlclBhcnQocmVzdWx0LCBcImZyYWdcIiksIFwidmVydFwiKTtcbiAgICAvLyAgIC8vIGZyYWdtZW50ID0gU2hhZGVyUGFyc2VyLl9yZW1vdmVBdHRyaWJ1dGVWYXJpYWJsZXMoZnJhZ21lbnQpO1xuICAgIC8vICAgLy8gZnJhZ21lbnQgPSBTaGFkZXJQYXJzZXIuX3JlbW92ZVZhcmlhYmxlQW5ub3RhdGlvbnMoZnJhZ21lbnQpO1xuICAgIC8vICAgLy8gdmVydGV4ID0gU2hhZGVyUGFyc2VyLl9yZW1vdmVWYXJpYWJsZUFubm90YXRpb25zKHZlcnRleCk7XG4gICAgLy8gICAvLyBsZXQgZnJhZ1ByZWNpc2lvbiA9IFNoYWRlclBhcnNlci5fb2J0YWluUHJlY2lzaW9ucyhmcmFnbWVudCk7XG4gICAgLy8gICAvLyBsZXQgdmVydFByZWNpc2lvbiA9IFNoYWRlclBhcnNlci5fb2J0YWluUHJlY2lzaW9ucyh2ZXJ0ZXgpO1xuICAgIC8vICAgLy8gaWYgKCFmcmFnUHJlY2lzaW9uW1wiZmxvYXRcIl0pIHsvLyBXaGVuIHByZWNpc2lvbiBvZiBmbG9hdCBpbiBmcmFnbWVudCBzaGFkZXIgd2FzIG5vdCBkZWNsYXJlZCxwcmVjaXNpb24gbWVkaXVtcCBmbG9hdCBuZWVkIHRvIGJlIGluc2VydGVkLlxuICAgIC8vICAgLy8gICBmcmFnbWVudCA9IHRoaXMuX2FkZFByZWNpc2lvbihmcmFnbWVudCwgXCJmbG9hdFwiLCBcIm1lZGl1bXBcIik7XG4gICAgLy8gICAvLyAgIGZyYWdQcmVjaXNpb25bXCJmbG9hdFwiXSA9IFwibWVkaXVtcFwiO1xuICAgIC8vICAgLy8gfVxuICAgIC8vICAgLy8gcmV0dXJuIHtcbiAgICAvLyAgIC8vICAgYXR0cmlidXRlczogYXR0cmlidXRlcyxcbiAgICAvLyAgIC8vICAgZnJhZ21lbnQ6IGZyYWdtZW50LFxuICAgIC8vICAgLy8gICB2ZXJ0ZXg6IHZlcnRleCxcbiAgICAvLyAgIC8vICAgdW5pZm9ybXM6IHVuaWZvcm1zLFxuICAgIC8vICAgLy8gICBmcmFnbWVudFByZWNpc2lvbnM6IGZyYWdQcmVjaXNpb24sXG4gICAgLy8gICAvLyAgIHZlcnRleFByZWNpc2lvbnM6IHZlcnRQcmVjaXNpb24sXG4gICAgLy8gICAvLyAgIGZ1bmN0aW9uczogZnVuY3Rpb25zXG4gICAgLy8gICAvLyB9O1xuICAgIC8vIH0pO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBnZXRJbXBvcnRzKHNvdXJjZTogc3RyaW5nKTogc3RyaW5nW10ge1xuICAgIGxldCBpbXBvcnRBcmdzID0gW107XG4gICAgY29uc3QgaW1wb3J0UmVnZXggPSAvXFxzKkBpbXBvcnRcXHMrXCIoW15cIl0rKVwiL2c7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGNvbnN0IGltcG9ydEVudW0gPSBpbXBvcnRSZWdleC5leGVjKHNvdXJjZSk7XG4gICAgICBpZiAoIWltcG9ydEVudW0pIHsgYnJlYWs7IH1cbiAgICAgIGltcG9ydEFyZ3MucHVzaChpbXBvcnRFbnVtWzFdKTtcbiAgICB9XG4gICAgcmV0dXJuIGltcG9ydEFyZ3M7XG4gIH1cblxuICAvKipcbiAgICogUGFyc2UgQGltcG9ydCBzeW50YXggYW5kIHJlcGxhY2UgdGhlbSB3aXRoIGNvcnJlc3BvbmRlZCBjb2Rlcy5cbiAgICogQHBhcmFtICB7c3RyaW5nfSAgICAgICAgICBzb3VyY2UgICAgICAgICAgc291cmNlIGNvZGUgWE1NTCB0byBiZSBwcm9jZXNzZWQgZm9yIEBpbXBvcnQuXG4gICAqIEBwYXJhbSAge01hdGVyaWFsTWFuYWdlcn0gbWF0ZXJpYWxNYW5hZ2VyIHRoZSBtYXRlcmlhbCBtYW5hZ2VyIGluc3RhbmNlIGNvbnRhaW5pbmcgaW1wb3J0ZWQgY29kZXMuXG4gICAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgICAgIHJlcGxhY2VkIGNvZGVzLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBwYXJzZUltcG9ydChzb3VyY2U6IHN0cmluZywgbWF0ZXJpYWxNYW5hZ2VyOiBNYXRlcmlhbE1hbmFnZXIpOiBRLklQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiBtYXRlcmlhbE1hbmFnZXIubG9hZENodW5rcyhTaGFkZXJQYXJzZXIuZ2V0SW1wb3J0cyhzb3VyY2UpKS50aGVuPHN0cmluZz4oKCkgPT4ge1xuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgY29uc3QgcmVnZXhSZXN1bHQgPSAvXFxzKkBpbXBvcnRcXHMrXCIoW15cIl0rKVwiLy5leGVjKHNvdXJjZSk7XG4gICAgICAgIGlmICghcmVnZXhSZXN1bHQpIHsgYnJlYWs7IH1cbiAgICAgICAgbGV0IGltcG9ydENvbnRlbnQ7XG4gICAgICAgIGltcG9ydENvbnRlbnQgPSBtYXRlcmlhbE1hbmFnZXIuZ2V0U2hhZGVyQ2h1bmsocmVnZXhSZXN1bHRbMV0pO1xuICAgICAgICBpZiAoIWltcG9ydENvbnRlbnQpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGBSZXF1aXJlZCBzaGFkZXIgY2h1bmsgJyR7cmVnZXhSZXN1bHRbMV19JyB3YXMgbm90IGZvdW5kISFgKTtcbiAgICAgICAgICBpbXBvcnRDb250ZW50ID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgICBzb3VyY2UgPSBzb3VyY2UucmVwbGFjZShyZWdleFJlc3VsdFswXSwgYFxcbiR7aW1wb3J0Q29udGVudH1cXG5gKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzb3VyY2U7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIHBhcnNlSW50ZXJuYWxJbXBvcnQoc291cmNlOiBzdHJpbmcsIG1hdGVyaWFsTWFuYWdlcjogTWF0ZXJpYWxNYW5hZ2VyKTogc3RyaW5nIHtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgY29uc3QgcmVnZXhSZXN1bHQgPSAvXFxzKkBpbXBvcnRcXHMrXCIoW15cIl0rKVwiLy5leGVjKHNvdXJjZSk7XG4gICAgICBpZiAoIXJlZ2V4UmVzdWx0KSB7IGJyZWFrOyB9XG4gICAgICBsZXQgaW1wb3J0Q29udGVudDtcbiAgICAgIGltcG9ydENvbnRlbnQgPSBtYXRlcmlhbE1hbmFnZXIuZ2V0U2hhZGVyQ2h1bmsocmVnZXhSZXN1bHRbMV0pO1xuICAgICAgaWYgKCFpbXBvcnRDb250ZW50KSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYFJlcXVpcmVkIHNoYWRlciBjaHVuayAnJHtyZWdleFJlc3VsdFsxXX0nIHdhcyBub3QgZm91bmQhIWApO1xuICAgICAgICBpbXBvcnRDb250ZW50ID0gXCJcIjtcbiAgICAgIH1cbiAgICAgIHNvdXJjZSA9IHNvdXJjZS5yZXBsYWNlKHJlZ2V4UmVzdWx0WzBdLCBgXFxuJHtpbXBvcnRDb250ZW50fVxcbmApO1xuICAgIH1cbiAgICByZXR1cm4gc291cmNlO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgX3BhcnNlRnVuY3Rpb25zKHNvdXJjZTogc3RyaW5nKTogeyBbbmFtZTogc3RyaW5nXTogSUZ1bmN0aW9uRGVzY3JpcHRpb24gfSB7XG4gICAgY29uc3QgcmVnZXggPSAvKFthLXpBLVpdXFx3KilcXHMrKFthLXpBLVpdXFx3KilcXHMqXFwoKFteXFwpXSo/KVxcKVxccyooPz1cXHspL2c7XG4gICAgY29uc3QgcmVzdWx0ID0gPHsgW25hbWU6IHN0cmluZ106IElGdW5jdGlvbkRlc2NyaXB0aW9uIH0+e307XG4gICAgbGV0IHJlZ2V4UmVzdWx0O1xuICAgIHdoaWxlICgocmVnZXhSZXN1bHQgPSByZWdleC5leGVjKHNvdXJjZSkpKSB7XG4gICAgICBsZXQgcmV0dXJuVHlwZSA9IHJlZ2V4UmVzdWx0WzFdO1xuICAgICAgbGV0IGZ1bmN0aW9uTmFtZSA9IHJlZ2V4UmVzdWx0WzJdO1xuICAgICAgbGV0IGFyZ3MgPSByZWdleFJlc3VsdFszXTtcbiAgICAgIGxldCBhcmd1bWVudERlc2NyaXB0aW9uczogSUFyZ3VtZW50RGVzY3JpcHRpb25bXSA9IFtdO1xuXG4gICAgICAvLyBwYXJzZSBhcmd1bWVudHNcbiAgICAgIGlmIChhcmdzICE9PSBcInZvaWRcIiAmJiBhcmdzICE9PSBcIlwiKSB7XG4gICAgICAgIGxldCBhcmdzQXJyYXkgPSBhcmdzLnNwbGl0KFwiLFwiKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcmdzQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcImFyZ1wiICsgaSArIFwiOlwiICsgYXJnc0FycmF5W2ldKTtcbiAgICAgICAgICBsZXQgc3BsID0gYXJnc0FycmF5W2ldLnNwbGl0KFwiIFwiKTtcbiAgICAgICAgICBpZiAoc3BsLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgICAgbGV0IGFyZ1R5cGUgPSBzcGxbMF07XG4gICAgICAgICAgICBsZXQgYXJnUCA9IHNwbFsxXTtcbiAgICAgICAgICAgIGxldCBhcmdOYW1lID0gc3BsWzJdO1xuICAgICAgICAgICAgYXJndW1lbnREZXNjcmlwdGlvbnMucHVzaCg8SUFyZ3VtZW50RGVzY3JpcHRpb24+e1xuICAgICAgICAgICAgICB2YXJpYWJsZU5hbWU6IGFyZ05hbWUsXG4gICAgICAgICAgICAgIHZhcmlhYmxlVHlwZTogYXJnVHlwZSxcbiAgICAgICAgICAgICAgdmFyaWFibGVQcmVjaXNpb246IGFyZ1BcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgYXJnVHlwZSA9IHNwbFswXTtcbiAgICAgICAgICAgIGxldCBhcmdOYW1lID0gc3BsWzFdO1xuICAgICAgICAgICAgYXJndW1lbnREZXNjcmlwdGlvbnMucHVzaCg8SUFyZ3VtZW50RGVzY3JpcHRpb24+e1xuICAgICAgICAgICAgICB2YXJpYWJsZU5hbWU6IGFyZ05hbWUsXG4gICAgICAgICAgICAgIHZhcmlhYmxlVHlwZTogYXJnVHlwZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXN1bHRbbmFtZV0gPSA8SUZ1bmN0aW9uRGVzY3JpcHRpb24+e1xuICAgICAgICBmdW5jdGlvbk5hbWU6IGZ1bmN0aW9uTmFtZSxcbiAgICAgICAgZnVuY3Rpb25UeXBlOiByZXR1cm5UeXBlLFxuICAgICAgICBmdW5jdGlvblByZWNpc2lvbjogdW5kZWZpbmVkLFxuICAgICAgICBmdW5jdGlvbkFyZ21lbnRzOiBhcmd1bWVudERlc2NyaXB0aW9uc1xuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIF9wYXJzZVZhcmlhYmxlQXR0cmlidXRlcyhhdHRyaWJ1dGVzOiBzdHJpbmcpOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9IHtcbiAgICByZXR1cm4gSlNPTjUucGFyc2UoYXR0cmlidXRlcyk7XG4gIH1cbiAgLy8gaHR0cDovL3JlZ2V4cGVyLmNvbS8jKCUzRiUzQSU1QyUyRiU1QyUyRiU0MCU1QygoLiUyQiklNUMpKSUzRiU1Q3MqdW5pZm9ybSU1Q3MlMkIoKCUzRiUzQWxvd3AlN0NtZWRpdW1wJTdDaGlnaHApJTVDcyUyQiklM0YoJTVCYS16MC05QS1aJTVEJTJCKSU1Q3MlMkIoJTVCYS16QS1aMC05XyU1RCUyQikoJTNGJTNBJTVDcyolNUMlNUIlNUNzKiglNUNkJTJCKSU1Q3MqJTVDJTVEJTVDcyopJTNGJTVDcyolM0JcbiAgcHJpdmF0ZSBzdGF0aWMgX2dlbmVyYXRlVmFyaWFibGVGZXRjaFJlZ2V4KHZhcmlhYmxlVHlwZTogc3RyaW5nKTogUmVnRXhwIHtcbiAgICByZXR1cm4gbmV3IFJlZ0V4cChgKD86QChcXFxcey4rXFxcXH0pKT9cXFxccyoke3ZhcmlhYmxlVHlwZX1cXFxccysoPzoobG93cHxtZWRpdW1wfGhpZ2hwKVxcXFxzKyk/KFthLXowLTlBLVpdKylcXFxccysoW2EtekEtWjAtOV9dKykoPzpcXFxccypcXFxcW1xcXFxzKihcXFxcZCspXFxcXHMqXFxcXF1cXFxccyopP1xcXFxzKjtgLCBcImdcIik7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBfcGFyc2VWYXJpYWJsZXMoc291cmNlOiBzdHJpbmcsIHZhcmlhYmxlVHlwZTogc3RyaW5nKTogeyBbbmFtZTogc3RyaW5nXTogSVZhcmlhYmxlRGVzY3JpcHRpb24gfSB7XG4gICAgY29uc3QgcmVzdWx0ID0gPHsgW25hbWU6IHN0cmluZ106IElWYXJpYWJsZURlc2NyaXB0aW9uIH0+e307XG4gICAgY29uc3QgcmVnZXggPSBTaGFkZXJQYXJzZXIuX2dlbmVyYXRlVmFyaWFibGVGZXRjaFJlZ2V4KHZhcmlhYmxlVHlwZSk7XG4gICAgbGV0IHJlZ2V4UmVzdWx0O1xuICAgIHdoaWxlICgocmVnZXhSZXN1bHQgPSByZWdleC5leGVjKHNvdXJjZSkpKSB7XG4gICAgICBsZXQgbmFtZSA9IHJlZ2V4UmVzdWx0WzRdO1xuICAgICAgbGV0IHR5cGUgPSByZWdleFJlc3VsdFszXTtcbiAgICAgIGxldCBwcmVjaXNpb24gPSByZWdleFJlc3VsdFsyXTtcbiAgICAgIGxldCByYXdBbm5vdGF0aW9ucyA9IHJlZ2V4UmVzdWx0WzFdO1xuICAgICAgcmVzdWx0W25hbWVdID0gPElWYXJpYWJsZURlc2NyaXB0aW9uPntcbiAgICAgICAgdmFyaWFibGVOYW1lOiBuYW1lLFxuICAgICAgICB2YXJpYWJsZVR5cGU6IHR5cGUsXG4gICAgICAgIHZhcmlhYmxlUHJlY2lzaW9uOiBwcmVjaXNpb24sXG4gICAgICAgIHZhcmlhYmxlQW5ub3RhdGlvbjogcmF3QW5ub3RhdGlvbnMgPyB0aGlzLl9wYXJzZVZhcmlhYmxlQXR0cmlidXRlcyhyYXdBbm5vdGF0aW9ucykgOiB7fSxcbiAgICAgICAgaXNBcnJheTogKHR5cGVvZiByZWdleFJlc3VsdFs1XSAhPT0gXCJ1bmRlZmluZWRcIiksXG4gICAgICAgIGFycmF5TGVuZ3RoOiAodHlwZW9mIHJlZ2V4UmVzdWx0WzVdICE9PSBcInVuZGVmaW5lZFwiKSA/IHBhcnNlSW50KHJlZ2V4UmVzdWx0WzVdLCAxMCkgOiB1bmRlZmluZWRcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgLy8gYFxuICBwcml2YXRlIHN0YXRpYyBfcmVtb3ZlVmFyaWFibGVBbm5vdGF0aW9ucyhzb3VyY2U6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgbGV0IHJlZ2V4UmVzdWx0O1xuICAgIHdoaWxlIChyZWdleFJlc3VsdCA9IC9AXFx7LitcXH0vZy5leGVjKHNvdXJjZSkpIHtcbiAgICAgIHNvdXJjZSA9IHNvdXJjZS5zdWJzdHIoMCwgcmVnZXhSZXN1bHQuaW5kZXgpICsgc291cmNlLnN1YnN0cmluZyhyZWdleFJlc3VsdC5pbmRleCArIHJlZ2V4UmVzdWx0WzBdLmxlbmd0aCwgc291cmNlLmxlbmd0aCk7XG4gICAgfVxuICAgIHJldHVybiBzb3VyY2U7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBfcmVtb3ZlTGluZUNvbW1lbnQoc291cmNlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGxldCB0ZXh0OiBzdHJpbmcgPSBzb3VyY2U7XG4gICAgY29uc3QgcmVnZXggPSAvKFxcL1xcLy4qKS9nO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBjb25zdCBmb3VuZCA9IHJlZ2V4LmV4ZWModGV4dCk7XG4gICAgICBpZiAoIWZvdW5kKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgbGV0IGJlZ2luUG9pbnQgPSBmb3VuZC5pbmRleDtcbiAgICAgIHRleHQgPSB0ZXh0LnN1YnN0cigwLCBiZWdpblBvaW50KSArIHRleHQuc3Vic3RyaW5nKGJlZ2luUG9pbnQgKyBmb3VuZFswXS5sZW5ndGgsIHRleHQubGVuZ3RoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRleHQ7XG4gIH1cbiAgcHJpdmF0ZSBzdGF0aWMgX3JlbW92ZU11bHRpTGluZUNvbW1lbnQoc291cmNlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBjb25zdCBmb3VuZCA9IHNvdXJjZS5pbmRleE9mKFwiLypcIiwgMCk7XG4gICAgICBpZiAoZm91bmQgPCAwKSB7XG4gICAgICAgIGJyZWFrOyAvLyBXaGVuIHRoZXJlIHdhcyBubyBtb3JlIGZvdW5kXG4gICAgICB9XG4gICAgICBsZXQgYmVnaW5Qb2ludCA9IGZvdW5kO1xuICAgICAgY29uc3QgZW5kUG9pbnQ6IG51bWJlciA9IHNvdXJjZS5pbmRleE9mKFwiKi9cIiwgYmVnaW5Qb2ludCk7XG4gICAgICBpZiAoZW5kUG9pbnQgPCAxKSB7XG4gICAgICAgIC8vIGVycm9yIG5vIGJyYWNrZXQgbWF0Y2hpbmdcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkludmFsaWQgYnJhY2tldCBtYXRjaGluZyFcIik7XG4gICAgICAgIHJldHVybiBzb3VyY2U7XG4gICAgICB9XG5cbiAgICAgIHNvdXJjZSA9IHNvdXJjZS5zdWJzdHIoMCwgYmVnaW5Qb2ludCkgKyBzb3VyY2Uuc3Vic3RyaW5nKGVuZFBvaW50ICsgMiwgc291cmNlLmxlbmd0aCk7XG4gICAgfVxuICAgIHJldHVybiBzb3VyY2U7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBfZ2V0RW5kQnJhY2tldEluZGV4KHNvdXJjZTogc3RyaW5nLCBzdGFydEluZGV4OiBudW1iZXIsIGJlZ2luQnJhY2tldDogc3RyaW5nLCBlbmRCcmFja2V0OiBzdHJpbmcpOiBudW1iZXIge1xuICAgIC8vIGdldCBpbmRleCBvZiBtYXRjaGluZyBlbmRCcmFja2V0XG4gICAgbGV0IGluZGV4ID0gc3RhcnRJbmRleDtcblxuICAgIGxldCBicmFja2V0Q291bnQgPSAxO1xuICAgIHdoaWxlICh0cnVlKSB7IC8vIGZpbmQgbWF0Y2hpbmcgYnJhY2tldFxuICAgICAgaWYgKGJyYWNrZXRDb3VudCA9PT0gMCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGluZGV4Kys7XG4gICAgICBjb25zdCBuZXh0RW5kQmxhY2tldCA9IHNvdXJjZS5pbmRleE9mKGVuZEJyYWNrZXQsIGluZGV4KTtcbiAgICAgIGNvbnN0IG5leHRCZWdpbkJsYWNrZXQgPSBzb3VyY2UuaW5kZXhPZihiZWdpbkJyYWNrZXQsIGluZGV4KTtcbiAgICAgIGlmIChuZXh0RW5kQmxhY2tldCA8IDApIHtcbiAgICAgICAgLy8gZXJyb3Igbm8gYnJhY2tldCBtYXRjaGluZ1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiSW52YWxpZCBicmFja2V0IG1hdGNoaW5nIVwiKTtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgICAgaWYgKG5leHRCZWdpbkJsYWNrZXQgPCAwKSB7XG4gICAgICAgIGluZGV4ID0gbmV4dEVuZEJsYWNrZXQ7XG4gICAgICAgIGJyYWNrZXRDb3VudC0tO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmIChuZXh0RW5kQmxhY2tldCA8IG5leHRCZWdpbkJsYWNrZXQpIHtcbiAgICAgICAgaW5kZXggPSBuZXh0RW5kQmxhY2tldDtcbiAgICAgICAgYnJhY2tldENvdW50LS07XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5kZXggPSBuZXh0QmVnaW5CbGFja2V0O1xuICAgICAgICBicmFja2V0Q291bnQrKztcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpbmRleDtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIF9yZW1vdmVPdGhlclBhcnQoc291cmNlOiBzdHJpbmcsIHBhcnRGbGFnOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChgXFxzKig/OlxcL1xcLyspP1xccypAJHtwYXJ0RmxhZ31gLCBcImdcIik7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGNvbnN0IGZvdW5kID0gcmVnZXguZXhlYyhzb3VyY2UpO1xuICAgICAgaWYgKCFmb3VuZCkge1xuICAgICAgICBicmVhazsgLy8gV2hlbiB0aGVyZSB3YXMgbm8gbW9yZSBmb3VuZFxuICAgICAgfVxuICAgICAgbGV0IGJlZ2luUG9pbnQgPSBmb3VuZC5pbmRleDtcbiAgICAgIGxldCBpbmRleCA9IHNvdXJjZS5pbmRleE9mKFwie1wiLCBiZWdpblBvaW50KTsgLy8gaWdub3JlIG5leHQge1xuICAgICAgY29uc3QgZW5kUG9pbnQ6IG51bWJlciA9IHRoaXMuX2dldEVuZEJyYWNrZXRJbmRleChzb3VyY2UsIGluZGV4LCBcIntcIiwgXCJ9XCIpICsgMTtcbiAgICAgIGlmIChlbmRQb2ludCA8IDEpIHtcbiAgICAgICAgLy8gZXJyb3Igbm8gYnJhY2tldCBtYXRjaGluZ1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiSW52YWxpZCBicmFja2V0IG1hdGNoaW5nIVwiKTtcbiAgICAgICAgcmV0dXJuIHNvdXJjZTtcbiAgICAgIH1cblxuICAgICAgc291cmNlID0gc291cmNlLnN1YnN0cigwLCBiZWdpblBvaW50KSArIHNvdXJjZS5zdWJzdHJpbmcoZW5kUG9pbnQsIHNvdXJjZS5sZW5ndGgpO1xuICAgIH1cbiAgICByZXR1cm4gc291cmNlO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgX3JlbW92ZVNlbGZPbmx5VGFnKHNvdXJjZTogc3RyaW5nLCBwYXJ0RmxhZzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAoYChcXHMqKD86XFwvXFwvKyk/XFxzKkAke3BhcnRGbGFnfSlgLCBcImdcIik7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGNvbnN0IGZvdW5kID0gcmVnZXguZXhlYyhzb3VyY2UpO1xuICAgICAgaWYgKCFmb3VuZCkge1xuICAgICAgICBicmVhazsgLy8gV2hlbiB0aGVyZSB3YXMgbm8gbW9yZSBmb3VuZFxuICAgICAgfVxuICAgICAgbGV0IGluZGV4ID0gc291cmNlLmluZGV4T2YoXCJ7XCIsIGZvdW5kLmluZGV4KTsgLy8gaWdub3JlIG5leHQge1xuICAgICAgbGV0IGJlZ2luUG9pbnQgPSBpbmRleDtcbiAgICAgIGNvbnN0IGVuZFBvaW50OiBudW1iZXIgPSB0aGlzLl9nZXRFbmRCcmFja2V0SW5kZXgoc291cmNlLCBpbmRleCwgXCJ7XCIsIFwifVwiKSArIDE7XG4gICAgICBpZiAoZW5kUG9pbnQgPCAxKSB7XG4gICAgICAgIC8vIGVycm9yIG5vIGJyYWNrZXQgbWF0Y2hpbmdcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkludmFsaWQgYnJhY2tldCBtYXRjaGluZyFcIik7XG4gICAgICAgIHJldHVybiBzb3VyY2U7XG4gICAgICB9XG4gICAgICBzb3VyY2UgPSBzb3VyY2Uuc3Vic3RyKDAsIGZvdW5kLmluZGV4KSArIHNvdXJjZS5zdWJzdHJpbmcoYmVnaW5Qb2ludCArIDEsIGVuZFBvaW50IC0gMSkgKyBzb3VyY2Uuc3Vic3RyaW5nKGVuZFBvaW50ICsgMSwgc291cmNlLmxlbmd0aCk7XG4gICAgfVxuICAgIHJldHVybiBzb3VyY2U7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBfYWRkUHJlY2lzaW9uKHNvdXJjZTogc3RyaW5nLCB0YXJnZXRUeXBlOiBzdHJpbmcsIHByZWNpc2lvbjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYHByZWNpc2lvbiAke3ByZWNpc2lvbn0gJHt0YXJnZXRUeXBlfTtcXG5gICsgc291cmNlO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgX29idGFpblByZWNpc2lvbnMoc291cmNlOiBzdHJpbmcpOiB7IFt0eXBlOiBzdHJpbmddOiBzdHJpbmcgfSB7XG4gICAgY29uc3QgcmVnZXggPSAvXFxzKnByZWNpc2lvblxccysoW2Etel0rKVxccysoW2EtejAtOV0rKS9nO1xuICAgIGxldCByZXN1bHQ6IHsgW3R5cGU6IHN0cmluZ106IHN0cmluZyB9ID0ge307XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGNvbnN0IGZvdW5kID0gcmVnZXguZXhlYyhzb3VyY2UpO1xuICAgICAgaWYgKCFmb3VuZCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHJlc3VsdFtmb3VuZFsyXV0gPSBmb3VuZFsxXTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIF9yZW1vdmVBdHRyaWJ1dGVWYXJpYWJsZXMoc291cmNlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHJlZ2V4ID0gLyhcXHMqYXR0cmlidXRlXFxzK1thLXpBLVowLTlfXStcXHMrW2EtekEtWjAtOV9dKzspLztcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgbGV0IGZvdW5kID0gcmVnZXguZXhlYyhzb3VyY2UpO1xuICAgICAgaWYgKCFmb3VuZCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHNvdXJjZSA9IHNvdXJjZS5yZXBsYWNlKGZvdW5kWzBdLCBcIlwiKTtcbiAgICB9XG4gICAgcmV0dXJuIHNvdXJjZTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTaGFkZXJQYXJzZXI7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
