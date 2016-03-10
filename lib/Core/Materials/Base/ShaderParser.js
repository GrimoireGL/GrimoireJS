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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvcmUvTWF0ZXJpYWxzL0Jhc2UvU2hhZGVyUGFyc2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUlPLGlCQUFpQixNQUFNLDRCQUE0QjtPQUNuRCxhQUFhLE1BQU0sd0JBQXdCO09BRTNDLEtBQUssTUFBTSxPQUFPO0FBRXpCOzs7R0FHRztBQUNIO0lBQ0U7Ozs7T0FJRztJQUNILE9BQWMsYUFBYSxDQUFDLFVBQWtCO1FBQzVDLFVBQVUsR0FBRyxZQUFZLENBQUMsdUJBQXVCLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDOUQsVUFBVSxHQUFHLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN6RCxNQUFNLGVBQWUsR0FBRyxhQUFhLENBQUMsbUJBQW1CLENBQWtCLGlCQUFpQixDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQzlHLE1BQU0sQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxlQUFlLENBQUMsQ0FBQyxJQUFJLENBQXNCLE1BQU07WUFDM0YsTUFBTSxRQUFRLEdBQUcsWUFBWSxDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDckUsTUFBTSxVQUFVLEdBQUcsWUFBWSxDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFDekUsTUFBTSxTQUFTLEdBQUcsWUFBWSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMzRCxJQUFJLFFBQVEsR0FBRyxZQUFZLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUN0RyxJQUFJLE1BQU0sR0FBRyxZQUFZLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUNwRyxRQUFRLEdBQUcsWUFBWSxDQUFDLHlCQUF5QixDQUFD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LENBQUM7SUFFRCxPQUFlLGlCQUFpQixDQUFDLE1BQWM7UUFDN0MsTUFBTSxLQUFLLEdBQUcsd0NBQXdDLENBQUM7UUFDdkQsSUFBSSxNQUFNLEdBQStCLEVBQUUsQ0FBQztRQUM1QyxPQUFPLElBQUksRUFBRSxDQUFDO1lBQ1osTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNqQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsS0FBSyxDQUFDO1lBQ1IsQ0FBQztZQUNELE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUIsQ0FBQztRQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVELE9BQWUseUJBQXlCLENBQUMsTUFBYztRQUNyRCxNQUFNLEtBQUssR0FBRyxpREFBaUQsQ0FBQztRQUNoRSxPQUFPLElBQUksRUFBRSxDQUFDO1lBQ1osSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMvQixFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsS0FBSyxDQUFDO1lBQ1IsQ0FBQztZQUNELE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN4QyxDQUFDO1FBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNoQixDQUFDO0FBQ0gsQ0FBQztBQUVELGVBQWUsWUFBWSxDQUFDIiwiZmlsZSI6IkNvcmUvTWF0ZXJpYWxzL0Jhc2UvU2hhZGVyUGFyc2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IElWYXJpYWJsZURlc2NyaXB0aW9uIGZyb20gXCIuL0lWYXJpYWJsZURlc2NyaXB0aW9uXCI7XG5pbXBvcnQgSUZ1bmN0aW9uRGVzY3JpcHRpb24gZnJvbSBcIi4vSUZ1bmN0aW9uRGVzY3JpcHRpb25cIjtcbmltcG9ydCBJQXJndW1lbnREZXNjcmlwdGlvbiBmcm9tIFwiLi9JQXJndW1lbnREZXNjcmlwdGlvblwiO1xuaW1wb3J0IElQcm9ncmFtRGVzY3JpcHRpb24gZnJvbSBcIi4vSVByb2dyYW1EZXNjcmlwdGlvblwiO1xuaW1wb3J0IENvbnRleHRDb21wb25lbnRzIGZyb20gXCIuLi8uLi8uLi9Db250ZXh0Q29tcG9uZW50c1wiO1xuaW1wb3J0IEpUaHJlZUNvbnRleHQgZnJvbSBcIi4uLy4uLy4uL0pUaHJlZUNvbnRleHRcIjtcbmltcG9ydCBNYXRlcmlhbE1hbmFnZXIgZnJvbSBcIi4vTWF0ZXJpYWxNYW5hZ2VyXCI7XG5pbXBvcnQgSlNPTjUgZnJvbSBcImpzb241XCI7XG5pbXBvcnQgUSBmcm9tIFwicVwiO1xuLyoqXG4gKiBTdGF0aWMgcGFyc2luZyBtZXRob2RzIGZvciBYTU1MIChlWHRlbmRlZCBNYXRlcmlhbCBNYXJrdXAgTGFuZ3VhZ2UpLlxuICogVGhpcyBjbGFzcyBwcm92aWRlcyBhbGwgdXNlZnVsIG1ldGhvZHMgZm9yIHBhcnNpbmcgWE1NTC5cbiAqL1xuY2xhc3MgU2hhZGVyUGFyc2VyIHtcbiAgLyoqXG4gICAqIFBhcnNlIHJhdyBYTU1MXG4gICAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgICAgICAgICB3aG9sZSBzdHJpbmcgY29kZSBvZiBYTU1MXG4gICAqIEByZXR1cm4ge0lQcm9ncmFtRGVzY3JpcHRpb259IGluZm9ybWF0aW9uIG9mIHBhcnNlZCBjb2Rlcy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcGFyc2VDb21iaW5lZChjb2RlU3RyaW5nOiBzdHJpbmcpOiBRLklQcm9taXNlPElQcm9ncmFtRGVzY3JpcHRpb24+IHtcbiAgICBjb2RlU3RyaW5nID0gU2hhZGVyUGFyc2VyLl9yZW1vdmVNdWx0aUxpbmVDb21tZW50KGNvZGVTdHJpbmcpO1xuICAgIGNvZGVTdHJpbmcgPSBTaGFkZXJQYXJzZXIuX3JlbW92ZUxpbmVDb21tZW50KGNvZGVTdHJpbmcpO1xuICAgIGNvbnN0IG1hdGVyaWFsTWFuYWdlciA9IEpUaHJlZUNvbnRleHQuZ2V0Q29udGV4dENvbXBvbmVudDxNYXRlcmlhbE1hbmFnZXI+KENvbnRleHRDb21wb25lbnRzLk1hdGVyaWFsTWFuYWdlcik7XG4gICAgcmV0dXJuIFNoYWRlclBhcnNlci5wYXJzZUltcG9ydChjb2RlU3RyaW5nLCBtYXRlcmlhbE1hbmFnZXIpLnRoZW48SVByb2dyYW1EZXNjcmlwdGlvbj4ocmVzdWx0ID0+IHtcbiAgICAgIGNvbnN0IHVuaWZvcm1zID0gU2hhZGVyUGFyc2VyLl9wYXJzZVZhcmlhYmxlcyhjb2RlU3RyaW5nLCBcInVuaWZvcm1cIik7XG4gICAgICBjb25zdCBhdHRyaWJ1dGVzID0gU2hhZGVyUGFyc2VyLl9wYXJzZVZhcmlhYmxlcyhjb2RlU3RyaW5nLCBcImF0dHJpYnV0ZVwiKTtcbiAgICAgIGNvbnN0IGZ1bmN0aW9ucyA9IFNoYWRlclBhcnNlci5fcGFyc2VGdW5jdGlvbnMoY29kZVN0cmluZyk7XG4gICAgICBsZXQgZnJhZ21lbnQgPSBTaGFkZXJQYXJzZXIuX3JlbW92ZVNlbGZPbmx5VGFnKFNoYWRlclBhcnNlci5fcmVtb3ZlT3RoZXJQYXJ0KHJlc3VsdCwgXCJ2ZXJ0XCIpLCBcImZyYWdcIik7XG4gICAgICBsZXQgdmVydGV4ID0gU2hhZGVyUGFyc2VyLl9yZW1vdmVTZWxmT25seVRhZyhTaGFkZXJQYXJzZXIuX3JlbW92ZU90aGVyUGFydChyZXN1bHQsIFwiZnJhZ1wiKSwgXCJ2ZXJ0XCIpO1xuICAgICAgZnJhZ21lbnQgPSBTaGFkZXJQYXJzZXIuX3JlbW92ZUF0dHJpYnV0ZVZhcmlhYmxlcyhmcmFnbWVudCk7XG4gICAgICBmcmFnbWVudCA9IFNoYWRlclBhcnNlci5fcmVtb3ZlVmFyaWFibGVBbm5vdGF0aW9ucyhmcmFnbWVudCk7XG4gICAgICB2ZXJ0ZXggPSBTaGFkZXJQYXJzZXIuX3JlbW92ZVZhcmlhYmxlQW5ub3RhdGlvbnModmVydGV4KTtcbiAgICAgIGxldCBmcmFnUHJlY2lzaW9uID0gU2hhZGVyUGFyc2VyLl9vYnRhaW5QcmVjaXNpb25zKGZyYWdtZW50KTtcbiAgICAgIGxldCB2ZXJ0UHJlY2lzaW9uID0gU2hhZGVyUGFyc2VyLl9vYnRhaW5QcmVjaXNpb25zKHZlcnRleCk7XG4gICAgICBpZiAoIWZyYWdQcmVjaXNpb25bXCJmbG9hdFwiXSkgey8vIFdoZW4gcHJlY2lzaW9uIG9mIGZsb2F0IGluIGZyYWdtZW50IHNoYWRlciB3YXMgbm90IGRlY2xhcmVkLHByZWNpc2lvbiBtZWRpdW1wIGZsb2F0IG5lZWQgdG8gYmUgaW5zZXJ0ZWQuXG4gICAgICAgIGZyYWdtZW50ID0gdGhpcy5fYWRkUHJlY2lzaW9uKGZyYWdtZW50LCBcImZsb2F0XCIsIFwibWVkaXVtcFwiKTtcbiAgICAgICAgZnJhZ1ByZWNpc2lvbltcImZsb2F0XCJdID0gXCJtZWRpdW1wXCI7XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICBhdHRyaWJ1dGVzOiBhdHRyaWJ1dGVzLFxuICAgICAgICBmcmFnbWVudDogZnJhZ21lbnQsXG4gICAgICAgIHZlcnRleDogdmVydGV4LFxuICAgICAgICB1bmlmb3JtczogdW5pZm9ybXMsXG4gICAgICAgIGZyYWdtZW50UHJlY2lzaW9uczogZnJhZ1ByZWNpc2lvbixcbiAgICAgICAgdmVydGV4UHJlY2lzaW9uczogdmVydFByZWNpc2lvbixcbiAgICAgICAgZnVuY3Rpb25zOiBmdW5jdGlvbnNcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGdldEltcG9ydHMoc291cmNlOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gICAgbGV0IGltcG9ydEFyZ3MgPSBbXTtcbiAgICBjb25zdCBpbXBvcnRSZWdleCA9IC9cXHMqQGltcG9ydFxccytcIihbXlwiXSspXCIvZztcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgY29uc3QgaW1wb3J0RW51bSA9IGltcG9ydFJlZ2V4LmV4ZWMoc291cmNlKTtcbiAgICAgIGlmICghaW1wb3J0RW51bSkgeyBicmVhazsgfVxuICAgICAgaW1wb3J0QXJncy5wdXNoKGltcG9ydEVudW1bMV0pO1xuICAgIH1cbiAgICByZXR1cm4gaW1wb3J0QXJncztcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXJzZSBAaW1wb3J0IHN5bnRheCBhbmQgcmVwbGFjZSB0aGVtIHdpdGggY29ycmVzcG9uZGVkIGNvZGVzLlxuICAgKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICAgIHNvdXJjZSAgICAgICAgICBzb3VyY2UgY29kZSBYTU1MIHRvIGJlIHByb2Nlc3NlZCBmb3IgQGltcG9ydC5cbiAgICogQHBhcmFtICB7TWF0ZXJpYWxNYW5hZ2VyfSBtYXRlcmlhbE1hbmFnZXIgdGhlIG1hdGVyaWFsIG1hbmFnZXIgaW5zdGFuY2UgY29udGFpbmluZyBpbXBvcnRlZCBjb2Rlcy5cbiAgICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgICAgcmVwbGFjZWQgY29kZXMuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHBhcnNlSW1wb3J0KHNvdXJjZTogc3RyaW5nLCBtYXRlcmlhbE1hbmFnZXI6IE1hdGVyaWFsTWFuYWdlcik6IFEuSVByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIG1hdGVyaWFsTWFuYWdlci5sb2FkQ2h1bmtzKFNoYWRlclBhcnNlci5nZXRJbXBvcnRzKHNvdXJjZSkpLnRoZW48c3RyaW5nPigoKSA9PiB7XG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICBjb25zdCByZWdleFJlc3VsdCA9IC9cXHMqQGltcG9ydFxccytcIihbXlwiXSspXCIvLmV4ZWMoc291cmNlKTtcbiAgICAgICAgaWYgKCFyZWdleFJlc3VsdCkgeyBicmVhazsgfVxuICAgICAgICBsZXQgaW1wb3J0Q29udGVudDtcbiAgICAgICAgaW1wb3J0Q29udGVudCA9IG1hdGVyaWFsTWFuYWdlci5nZXRTaGFkZXJDaHVuayhyZWdleFJlc3VsdFsxXSk7XG4gICAgICAgIGlmICghaW1wb3J0Q29udGVudCkge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYFJlcXVpcmVkIHNoYWRlciBjaHVuayAnJHtyZWdleFJlc3VsdFsxXX0nIHdhcyBub3QgZm91bmQhIWApO1xuICAgICAgICAgIGltcG9ydENvbnRlbnQgPSBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIHNvdXJjZSA9IHNvdXJjZS5yZXBsYWNlKHJlZ2V4UmVzdWx0WzBdLCBgXFxuJHtpbXBvcnRDb250ZW50fVxcbmApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNvdXJjZTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgcGFyc2VJbnRlcm5hbEltcG9ydChzb3VyY2U6IHN0cmluZywgbWF0ZXJpYWxNYW5hZ2VyOiBNYXRlcmlhbE1hbmFnZXIpOiBzdHJpbmcge1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBjb25zdCByZWdleFJlc3VsdCA9IC9cXHMqQGltcG9ydFxccytcIihbXlwiXSspXCIvLmV4ZWMoc291cmNlKTtcbiAgICAgIGlmICghcmVnZXhSZXN1bHQpIHsgYnJlYWs7IH1cbiAgICAgIGxldCBpbXBvcnRDb250ZW50O1xuICAgICAgaW1wb3J0Q29udGVudCA9IG1hdGVyaWFsTWFuYWdlci5nZXRTaGFkZXJDaHVuayhyZWdleFJlc3VsdFsxXSk7XG4gICAgICBpZiAoIWltcG9ydENvbnRlbnQpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgUmVxdWlyZWQgc2hhZGVyIGNodW5rICcke3JlZ2V4UmVzdWx0WzFdfScgd2FzIG5vdCBmb3VuZCEhYCk7XG4gICAgICAgIGltcG9ydENvbnRlbnQgPSBcIlwiO1xuICAgICAgfVxuICAgICAgc291cmNlID0gc291cmNlLnJlcGxhY2UocmVnZXhSZXN1bHRbMF0sIGBcXG4ke2ltcG9ydENvbnRlbnR9XFxuYCk7XG4gICAgfVxuICAgIHJldHVybiBzb3VyY2U7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBfcGFyc2VGdW5jdGlvbnMoc291cmNlOiBzdHJpbmcpOiB7IFtuYW1lOiBzdHJpbmddOiBJRnVuY3Rpb25EZXNjcmlwdGlvbiB9IHtcbiAgICBjb25zdCByZWdleCA9IC8oW2EtekEtWl1cXHcqKVxccysoW2EtekEtWl1cXHcqKVxccypcXCgoW15cXCldKj8pXFwpXFxzKig/PVxceykvZztcbiAgICBjb25zdCByZXN1bHQgPSA8eyBbbmFtZTogc3RyaW5nXTogSUZ1bmN0aW9uRGVzY3JpcHRpb24gfT57fTtcbiAgICBsZXQgcmVnZXhSZXN1bHQ7XG4gICAgd2hpbGUgKChyZWdleFJlc3VsdCA9IHJlZ2V4LmV4ZWMoc291cmNlKSkpIHtcbiAgICAgIGxldCByZXR1cm5UeXBlID0gcmVnZXhSZXN1bHRbMV07XG4gICAgICBsZXQgZnVuY3Rpb25OYW1lID0gcmVnZXhSZXN1bHRbMl07XG4gICAgICBsZXQgYXJncyA9IHJlZ2V4UmVzdWx0WzNdO1xuICAgICAgbGV0IGFyZ3VtZW50RGVzY3JpcHRpb25zOiBJQXJndW1lbnREZXNjcmlwdGlvbltdID0gW107XG5cbiAgICAgIC8vIHBhcnNlIGFyZ3VtZW50c1xuICAgICAgaWYgKGFyZ3MgIT09IFwidm9pZFwiICYmIGFyZ3MgIT09IFwiXCIpIHtcbiAgICAgICAgbGV0IGFyZ3NBcnJheSA9IGFyZ3Muc3BsaXQoXCIsXCIpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyZ3NBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiYXJnXCIgKyBpICsgXCI6XCIgKyBhcmdzQXJyYXlbaV0pO1xuICAgICAgICAgIGxldCBzcGwgPSBhcmdzQXJyYXlbaV0uc3BsaXQoXCIgXCIpO1xuICAgICAgICAgIGlmIChzcGwubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgICBsZXQgYXJnVHlwZSA9IHNwbFswXTtcbiAgICAgICAgICAgIGxldCBhcmdQID0gc3BsWzFdO1xuICAgICAgICAgICAgbGV0IGFyZ05hbWUgPSBzcGxbMl07XG4gICAgICAgICAgICBhcmd1bWVudERlc2NyaXB0aW9ucy5wdXNoKDxJQXJndW1lbnREZXNjcmlwdGlvbj57XG4gICAgICAgICAgICAgIHZhcmlhYmxlTmFtZTogYXJnTmFtZSxcbiAgICAgICAgICAgICAgdmFyaWFibGVUeXBlOiBhcmdUeXBlLFxuICAgICAgICAgICAgICB2YXJpYWJsZVByZWNpc2lvbjogYXJnUFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBhcmdUeXBlID0gc3BsWzBdO1xuICAgICAgICAgICAgbGV0IGFyZ05hbWUgPSBzcGxbMV07XG4gICAgICAgICAgICBhcmd1bWVudERlc2NyaXB0aW9ucy5wdXNoKDxJQXJndW1lbnREZXNjcmlwdGlvbj57XG4gICAgICAgICAgICAgIHZhcmlhYmxlTmFtZTogYXJnTmFtZSxcbiAgICAgICAgICAgICAgdmFyaWFibGVUeXBlOiBhcmdUeXBlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJlc3VsdFtuYW1lXSA9IDxJRnVuY3Rpb25EZXNjcmlwdGlvbj57XG4gICAgICAgIGZ1bmN0aW9uTmFtZTogZnVuY3Rpb25OYW1lLFxuICAgICAgICBmdW5jdGlvblR5cGU6IHJldHVyblR5cGUsXG4gICAgICAgIGZ1bmN0aW9uUHJlY2lzaW9uOiB1bmRlZmluZWQsXG4gICAgICAgIGZ1bmN0aW9uQXJnbWVudHM6IGFyZ3VtZW50RGVzY3JpcHRpb25zXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgX3BhcnNlVmFyaWFibGVBdHRyaWJ1dGVzKGF0dHJpYnV0ZXM6IHN0cmluZyk6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0ge1xuICAgIHJldHVybiBKU09ONS5wYXJzZShhdHRyaWJ1dGVzKTtcbiAgfVxuICAvLyBodHRwOi8vcmVnZXhwZXIuY29tLyMoJTNGJTNBJTVDJTJGJTVDJTJGJTQwJTVDKCguJTJCKSU1QykpJTNGJTVDcyp1bmlmb3JtJTVDcyUyQigoJTNGJTNBbG93cCU3Q21lZGl1bXAlN0NoaWdocCklNUNzJTJCKSUzRiglNUJhLXowLTlBLVolNUQlMkIpJTVDcyUyQiglNUJhLXpBLVowLTlfJTVEJTJCKSglM0YlM0ElNUNzKiU1QyU1QiU1Q3MqKCU1Q2QlMkIpJTVDcyolNUMlNUQlNUNzKiklM0YlNUNzKiUzQlxuICBwcml2YXRlIHN0YXRpYyBfZ2VuZXJhdGVWYXJpYWJsZUZldGNoUmVnZXgodmFyaWFibGVUeXBlOiBzdHJpbmcpOiBSZWdFeHAge1xuICAgIHJldHVybiBuZXcgUmVnRXhwKGAoPzpAKFxcXFx7LitcXFxcfSkpP1xcXFxzKiR7dmFyaWFibGVUeXBlfVxcXFxzKyg/Oihsb3dwfG1lZGl1bXB8aGlnaHApXFxcXHMrKT8oW2EtejAtOUEtWl0rKVxcXFxzKyhbYS16QS1aMC05X10rKSg/OlxcXFxzKlxcXFxbXFxcXHMqKFxcXFxkKylcXFxccypcXFxcXVxcXFxzKik/XFxcXHMqO2AsIFwiZ1wiKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIF9wYXJzZVZhcmlhYmxlcyhzb3VyY2U6IHN0cmluZywgdmFyaWFibGVUeXBlOiBzdHJpbmcpOiB7IFtuYW1lOiBzdHJpbmddOiBJVmFyaWFibGVEZXNjcmlwdGlvbiB9IHtcbiAgICBjb25zdCByZXN1bHQgPSA8eyBbbmFtZTogc3RyaW5nXTogSVZhcmlhYmxlRGVzY3JpcHRpb24gfT57fTtcbiAgICBjb25zdCByZWdleCA9IFNoYWRlclBhcnNlci5fZ2VuZXJhdGVWYXJpYWJsZUZldGNoUmVnZXgodmFyaWFibGVUeXBlKTtcbiAgICBsZXQgcmVnZXhSZXN1bHQ7XG4gICAgd2hpbGUgKChyZWdleFJlc3VsdCA9IHJlZ2V4LmV4ZWMoc291cmNlKSkpIHtcbiAgICAgIGxldCBuYW1lID0gcmVnZXhSZXN1bHRbNF07XG4gICAgICBsZXQgdHlwZSA9IHJlZ2V4UmVzdWx0WzNdO1xuICAgICAgbGV0IHByZWNpc2lvbiA9IHJlZ2V4UmVzdWx0WzJdO1xuICAgICAgbGV0IHJhd0Fubm90YXRpb25zID0gcmVnZXhSZXN1bHRbMV07XG4gICAgICByZXN1bHRbbmFtZV0gPSA8SVZhcmlhYmxlRGVzY3JpcHRpb24+e1xuICAgICAgICB2YXJpYWJsZU5hbWU6IG5hbWUsXG4gICAgICAgIHZhcmlhYmxlVHlwZTogdHlwZSxcbiAgICAgICAgdmFyaWFibGVQcmVjaXNpb246IHByZWNpc2lvbixcbiAgICAgICAgdmFyaWFibGVBbm5vdGF0aW9uOiByYXdBbm5vdGF0aW9ucyA/IHRoaXMuX3BhcnNlVmFyaWFibGVBdHRyaWJ1dGVzKHJhd0Fubm90YXRpb25zKSA6IHt9LFxuICAgICAgICBpc0FycmF5OiAodHlwZW9mIHJlZ2V4UmVzdWx0WzVdICE9PSBcInVuZGVmaW5lZFwiKSxcbiAgICAgICAgYXJyYXlMZW5ndGg6ICh0eXBlb2YgcmVnZXhSZXN1bHRbNV0gIT09IFwidW5kZWZpbmVkXCIpID8gcGFyc2VJbnQocmVnZXhSZXN1bHRbNV0sIDEwKSA6IHVuZGVmaW5lZFxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIF9yZW1vdmVWYXJpYWJsZUFubm90YXRpb25zKHNvdXJjZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAoXCJAXFxcXHsuK1xcXFx9XCIsIFwiZ1wiKTtcbiAgICBsZXQgcmVnZXhSZXN1bHQ7XG4gICAgd2hpbGUgKChyZWdleFJlc3VsdCA9IHJlZ2V4LmV4ZWMoc291cmNlKSkpIHtcbiAgICAgIHNvdXJjZSA9IHNvdXJjZS5zdWJzdHIoMCwgcmVnZXhSZXN1bHQuaW5kZXgpICsgc291cmNlLnN1YnN0cmluZyhyZWdleFJlc3VsdC5pbmRleCArIHJlZ2V4UmVzdWx0WzBdLmxlbmd0aCwgc291cmNlLmxlbmd0aCk7XG4gICAgfVxuICAgIHJldHVybiBzb3VyY2U7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBfcmVtb3ZlTGluZUNvbW1lbnQoc291cmNlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGxldCB0ZXh0OiBzdHJpbmcgPSBzb3VyY2U7XG4gICAgY29uc3QgcmVnZXggPSAvKFxcL1xcLy4qKS9nO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBjb25zdCBmb3VuZCA9IHJlZ2V4LmV4ZWModGV4dCk7XG4gICAgICBpZiAoIWZvdW5kKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgbGV0IGJlZ2luUG9pbnQgPSBmb3VuZC5pbmRleDtcbiAgICAgIHRleHQgPSB0ZXh0LnN1YnN0cigwLCBiZWdpblBvaW50KSArIHRleHQuc3Vic3RyaW5nKGJlZ2luUG9pbnQgKyBmb3VuZFswXS5sZW5ndGgsIHRleHQubGVuZ3RoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRleHQ7XG4gIH1cbiAgcHJpdmF0ZSBzdGF0aWMgX3JlbW92ZU11bHRpTGluZUNvbW1lbnQoc291cmNlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBjb25zdCBmb3VuZCA9IHNvdXJjZS5pbmRleE9mKFwiLypcIiwgMCk7XG4gICAgICBpZiAoZm91bmQgPCAwKSB7XG4gICAgICAgIGJyZWFrOyAvLyBXaGVuIHRoZXJlIHdhcyBubyBtb3JlIGZvdW5kXG4gICAgICB9XG4gICAgICBsZXQgYmVnaW5Qb2ludCA9IGZvdW5kO1xuICAgICAgY29uc3QgZW5kUG9pbnQ6IG51bWJlciA9IHNvdXJjZS5pbmRleE9mKFwiKi9cIiwgYmVnaW5Qb2ludCk7XG4gICAgICBpZiAoZW5kUG9pbnQgPCAxKSB7XG4gICAgICAgIC8vIGVycm9yIG5vIGJyYWNrZXQgbWF0Y2hpbmdcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkludmFsaWQgYnJhY2tldCBtYXRjaGluZyFcIik7XG4gICAgICAgIHJldHVybiBzb3VyY2U7XG4gICAgICB9XG5cbiAgICAgIHNvdXJjZSA9IHNvdXJjZS5zdWJzdHIoMCwgYmVnaW5Qb2ludCkgKyBzb3VyY2Uuc3Vic3RyaW5nKGVuZFBvaW50ICsgMiwgc291cmNlLmxlbmd0aCk7XG4gICAgfVxuICAgIHJldHVybiBzb3VyY2U7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBfZ2V0RW5kQnJhY2tldEluZGV4KHNvdXJjZTogc3RyaW5nLCBzdGFydEluZGV4OiBudW1iZXIsIGJlZ2luQnJhY2tldDogc3RyaW5nLCBlbmRCcmFja2V0OiBzdHJpbmcpOiBudW1iZXIge1xuICAgIC8vIGdldCBpbmRleCBvZiBtYXRjaGluZyBlbmRCcmFja2V0XG4gICAgbGV0IGluZGV4ID0gc3RhcnRJbmRleDtcblxuICAgIGxldCBicmFja2V0Q291bnQgPSAxO1xuICAgIHdoaWxlICh0cnVlKSB7IC8vIGZpbmQgbWF0Y2hpbmcgYnJhY2tldFxuICAgICAgaWYgKGJyYWNrZXRDb3VudCA9PT0gMCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGluZGV4Kys7XG4gICAgICBjb25zdCBuZXh0RW5kQmxhY2tldCA9IHNvdXJjZS5pbmRleE9mKGVuZEJyYWNrZXQsIGluZGV4KTtcbiAgICAgIGNvbnN0IG5leHRCZWdpbkJsYWNrZXQgPSBzb3VyY2UuaW5kZXhPZihiZWdpbkJyYWNrZXQsIGluZGV4KTtcbiAgICAgIGlmIChuZXh0RW5kQmxhY2tldCA8IDApIHtcbiAgICAgICAgLy8gZXJyb3Igbm8gYnJhY2tldCBtYXRjaGluZ1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiSW52YWxpZCBicmFja2V0IG1hdGNoaW5nIVwiKTtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgICAgaWYgKG5leHRCZWdpbkJsYWNrZXQgPCAwKSB7XG4gICAgICAgIGluZGV4ID0gbmV4dEVuZEJsYWNrZXQ7XG4gICAgICAgIGJyYWNrZXRDb3VudC0tO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmIChuZXh0RW5kQmxhY2tldCA8IG5leHRCZWdpbkJsYWNrZXQpIHtcbiAgICAgICAgaW5kZXggPSBuZXh0RW5kQmxhY2tldDtcbiAgICAgICAgYnJhY2tldENvdW50LS07XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5kZXggPSBuZXh0QmVnaW5CbGFja2V0O1xuICAgICAgICBicmFja2V0Q291bnQrKztcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpbmRleDtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIF9yZW1vdmVPdGhlclBhcnQoc291cmNlOiBzdHJpbmcsIHBhcnRGbGFnOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChgXFxzKig/OlxcL1xcLyspP1xccypAJHtwYXJ0RmxhZ31gLCBcImdcIik7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGNvbnN0IGZvdW5kID0gcmVnZXguZXhlYyhzb3VyY2UpO1xuICAgICAgaWYgKCFmb3VuZCkge1xuICAgICAgICBicmVhazsgLy8gV2hlbiB0aGVyZSB3YXMgbm8gbW9yZSBmb3VuZFxuICAgICAgfVxuICAgICAgbGV0IGJlZ2luUG9pbnQgPSBmb3VuZC5pbmRleDtcbiAgICAgIGxldCBpbmRleCA9IHNvdXJjZS5pbmRleE9mKFwie1wiLCBiZWdpblBvaW50KTsgLy8gaWdub3JlIG5leHQge1xuICAgICAgY29uc3QgZW5kUG9pbnQ6IG51bWJlciA9IHRoaXMuX2dldEVuZEJyYWNrZXRJbmRleChzb3VyY2UsIGluZGV4LCBcIntcIiwgXCJ9XCIpICsgMTtcbiAgICAgIGlmIChlbmRQb2ludCA8IDEpIHtcbiAgICAgICAgLy8gZXJyb3Igbm8gYnJhY2tldCBtYXRjaGluZ1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiSW52YWxpZCBicmFja2V0IG1hdGNoaW5nIVwiKTtcbiAgICAgICAgcmV0dXJuIHNvdXJjZTtcbiAgICAgIH1cblxuICAgICAgc291cmNlID0gc291cmNlLnN1YnN0cigwLCBiZWdpblBvaW50KSArIHNvdXJjZS5zdWJzdHJpbmcoZW5kUG9pbnQsIHNvdXJjZS5sZW5ndGgpO1xuICAgIH1cbiAgICByZXR1cm4gc291cmNlO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgX3JlbW92ZVNlbGZPbmx5VGFnKHNvdXJjZTogc3RyaW5nLCBwYXJ0RmxhZzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAoYChcXHMqKD86XFwvXFwvKyk/XFxzKkAke3BhcnRGbGFnfSlgLCBcImdcIik7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGNvbnN0IGZvdW5kID0gcmVnZXguZXhlYyhzb3VyY2UpO1xuICAgICAgaWYgKCFmb3VuZCkge1xuICAgICAgICBicmVhazsgLy8gV2hlbiB0aGVyZSB3YXMgbm8gbW9yZSBmb3VuZFxuICAgICAgfVxuICAgICAgbGV0IGluZGV4ID0gc291cmNlLmluZGV4T2YoXCJ7XCIsIGZvdW5kLmluZGV4KTsgLy8gaWdub3JlIG5leHQge1xuICAgICAgbGV0IGJlZ2luUG9pbnQgPSBpbmRleDtcbiAgICAgIGNvbnN0IGVuZFBvaW50OiBudW1iZXIgPSB0aGlzLl9nZXRFbmRCcmFja2V0SW5kZXgoc291cmNlLCBpbmRleCwgXCJ7XCIsIFwifVwiKSArIDE7XG4gICAgICBpZiAoZW5kUG9pbnQgPCAxKSB7XG4gICAgICAgIC8vIGVycm9yIG5vIGJyYWNrZXQgbWF0Y2hpbmdcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkludmFsaWQgYnJhY2tldCBtYXRjaGluZyFcIik7XG4gICAgICAgIHJldHVybiBzb3VyY2U7XG4gICAgICB9XG4gICAgICBzb3VyY2UgPSBzb3VyY2Uuc3Vic3RyKDAsIGZvdW5kLmluZGV4KSArIHNvdXJjZS5zdWJzdHJpbmcoYmVnaW5Qb2ludCArIDEsIGVuZFBvaW50IC0gMSkgKyBzb3VyY2Uuc3Vic3RyaW5nKGVuZFBvaW50ICsgMSwgc291cmNlLmxlbmd0aCk7XG4gICAgfVxuICAgIHJldHVybiBzb3VyY2U7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBfYWRkUHJlY2lzaW9uKHNvdXJjZTogc3RyaW5nLCB0YXJnZXRUeXBlOiBzdHJpbmcsIHByZWNpc2lvbjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYHByZWNpc2lvbiAke3ByZWNpc2lvbn0gJHt0YXJnZXRUeXBlfTtcXG5gICsgc291cmNlO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgX29idGFpblByZWNpc2lvbnMoc291cmNlOiBzdHJpbmcpOiB7IFt0eXBlOiBzdHJpbmddOiBzdHJpbmcgfSB7XG4gICAgY29uc3QgcmVnZXggPSAvXFxzKnByZWNpc2lvblxccysoW2Etel0rKVxccysoW2EtejAtOV0rKS9nO1xuICAgIGxldCByZXN1bHQ6IHsgW3R5cGU6IHN0cmluZ106IHN0cmluZyB9ID0ge307XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGNvbnN0IGZvdW5kID0gcmVnZXguZXhlYyhzb3VyY2UpO1xuICAgICAgaWYgKCFmb3VuZCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHJlc3VsdFtmb3VuZFsyXV0gPSBmb3VuZFsxXTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIF9yZW1vdmVBdHRyaWJ1dGVWYXJpYWJsZXMoc291cmNlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHJlZ2V4ID0gLyhcXHMqYXR0cmlidXRlXFxzK1thLXpBLVowLTlfXStcXHMrW2EtekEtWjAtOV9dKzspLztcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgbGV0IGZvdW5kID0gcmVnZXguZXhlYyhzb3VyY2UpO1xuICAgICAgaWYgKCFmb3VuZCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHNvdXJjZSA9IHNvdXJjZS5yZXBsYWNlKGZvdW5kWzBdLCBcIlwiKTtcbiAgICB9XG4gICAgcmV0dXJuIHNvdXJjZTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTaGFkZXJQYXJzZXI7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
