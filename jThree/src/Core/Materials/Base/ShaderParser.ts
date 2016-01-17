import IVariableInfo = require("./IVariableInfo");
import IParsedProgramResult = require("./IParsedProgramResult");
import ContextComponents = require("../../../ContextComponents");
import JThreeContext = require("../../../JThreeContext");
import MaterialManager = require("./MaterialManager");
/**
 * Static parsing methods for XMML (eXtended Material Markup Language).
 * This class provides all useful methods for parsing XMML.
 */
class ShaderParser {
    /**
     * Parse raw XMML
     * @param  {string}               whole string code of XMML
     * @return {IParsedProgramResult} information of parsed codes.
     */
    public static parseCombined(codeString: string): IParsedProgramResult {
        var materialManager = JThreeContext.getContextComponent<MaterialManager>(ContextComponents.MaterialManager);
        var result = ShaderParser.parseImport(codeString, materialManager);
        var uniforms = ShaderParser._parseVariables(codeString, "uniform");
        var attributes = ShaderParser._parseVariables(codeString, "attribute");
        var fragment = ShaderParser._removeOtherPart(result, "vertonly");
        var vertex = ShaderParser._removeOtherPart(result, "fragonly");
        fragment = ShaderParser._removeAttributeVariables(fragment);
        let fragPrecision = ShaderParser._obtainPrecisions(fragment);
        let vertPrecision = ShaderParser._obtainPrecisions(vertex);
        if (!fragPrecision["float"]) {//When precision of float in fragment shader was not declared,precision mediump float need to be inserted.
            fragment = this._addPrecision(fragment, "float", "mediump");
            fragPrecision["float"] = "mediump";
        }
        return {
            vertex: vertex,
            fragment: fragment,
            uniforms: uniforms,
            attributes: attributes,
            fragmentPrecisions: fragPrecision,
            vertexPrecisions: vertPrecision
        };
    }

    /**
     * Parse @import syntax and replace them with corresponded codes.
     * @param  {string}          source          source code XMML to be processed for @import.
     * @param  {MaterialManager} materialManager the material manager instance containing imported codes.
     * @return {string}                          replaced codes.
     */
    public static parseImport(source: string, materialManager: MaterialManager): string {
        while (true) {
            var regexResult = /\s*\/\/+\s*@import\s+([a-zA-Z0-9.-]+)/.exec(source);
            if (!regexResult) break;
            var importContent;
            importContent = materialManager.getShaderChunk(regexResult[1]);
            if (!importContent) {
                console.error(`Required shader chunk '${regexResult[1]}' was not found!!`);
                importContent = "";
            }
            var source = source.replace(regexResult[0], '\n' + importContent + '\n');
        }
        return source;
    }

    private static _parseVariableAttributes(attributes: string): { [key: string]: string } {
        var result = <{ [key: string]: string }>{};
        var commaSplitted = attributes.split(',');
        for (var i = 0; i < commaSplitted.length; i++) {
            var colonSplitted = commaSplitted[i].split(':');
            result[colonSplitted[0].trim()] = colonSplitted[1].trim();
        }
        return result;
    }

    private static _generateVariableFetchRegex(variableType: string): RegExp {
        return new RegExp("(?://@\\((.+)\\))?\\s*" + variableType + "\\s+((?:lowp|mediump|highp)\\s+)?([a-z0-9A-Z]+)\\s+([a-zA-Z0-9_]+);", "g");
    }

    private static _parseVariables(source: string, variableType: string): { [name: string]: IVariableInfo } {
        var result = <{ [name: string]: IVariableInfo }>{};
        var regex = ShaderParser._generateVariableFetchRegex(variableType);
        var regexResult;
        while ((regexResult = regex.exec(source))) {
            let name = regexResult[4];
            let type = regexResult[3];
            let precision = regexResult[2];
            let rawAnnotations = regexResult[1];
            result[name] = <IVariableInfo>{
                variableName: name,
                variableType: type,
                variablePrecision:precision,
                variableAnnotation: rawAnnotations ? this._parseVariableAttributes(rawAnnotations) : {}
            };
        }
        return result;
    }

    private static _removeOtherPart(source: string, partFlag: string): string {
        var regex = new RegExp(`\s*\/\/+\s*@${partFlag}`,'g');
        while (true) {
            var found = regex.exec(source);
            if (!found) break;//When there was no more found
            var beginPoint = found.index;
            var index = beginPoint;
            while (true)//ignore next {
            {
                index++;
                if (source[index] == '{') break;
            }

            var bracketCount = 1;
            while (true)//find matching bracket
            {
                index++;
                if (index == source.length) {
                    //error no bracket matching
                    console.error("Invalid bracket matching!");
                    return source;
                }
                if (source[index] == '{') bracketCount++;
                if (source[index] == '}') bracketCount--;
                if (bracketCount == 0) break;
            }
            var endPoint = index + 1;

            source = source.substr(0, beginPoint) + source.substring(endPoint, source.length);
        }
        return source;
    }

    private static _addPrecision(source: string, targetType: string, precision: string): string {
        return `precision ${precision} ${targetType};\n` + source;
    }

    private static _obtainPrecisions(source: string): { [type: string]: string } {
        const regex = /\s*precision\s+([a-z]+)\s+([a-z0-9]+)/g;
        let result: { [type: string]: string } = {};
        while (true) {
            var found = regex.exec(source);
            if (!found) break;
            result[found[2]] = found[1];
        }
        return result;
    }

    private static _removeAttributeVariables(source: string): string {
        var regex = /(\s*attribute\s+[a-zA-Z0-9_]+\s+[a-zA-Z0-9_]+;)/;
        while (true) {
            var found = regex.exec(source);
            if (!found) break;
            source = source.replace(found[0], "");
        }
        return source;
    }
}

export = ShaderParser;
