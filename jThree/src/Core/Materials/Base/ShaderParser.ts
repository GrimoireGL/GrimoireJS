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
    const materialManager = JThreeContext.getContextComponent<MaterialManager>(ContextComponents.MaterialManager);
    const result = ShaderParser.parseImport(codeString, materialManager);
    const uniforms = ShaderParser._parseVariables(codeString, "uniform");
    const attributes = ShaderParser._parseVariables(codeString, "attribute");
    let fragment = ShaderParser._removeSelfOnlyTag(ShaderParser._removeOtherPart(result, "vertonly"), "fragonly");
    let vertex = ShaderParser._removeSelfOnlyTag(ShaderParser._removeOtherPart(result, "fragonly"), "vertonly");
    fragment = ShaderParser._removeAttributeVariables(fragment);
    fragment = ShaderParser._removeVariableAnnotations(fragment);
    vertex = ShaderParser._removeVariableAnnotations(vertex);
    let fragPrecision = ShaderParser._obtainPrecisions(fragment);
    let vertPrecision = ShaderParser._obtainPrecisions(vertex);
    if (!fragPrecision["float"]) {// When precision of float in fragment shader was not declared,precision mediump float need to be inserted.
      fragment = this._addPrecision(fragment, "float", "mediump");
      fragPrecision["float"] = "mediump";
    }
    return {
      attributes: attributes,
      fragment: fragment,
      vertex: vertex,
      uniforms: uniforms,
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
      const regexResult = /\s*\/\/+\s*@import\s+([a-zA-Z0-9.-]+)/.exec(source);
      if (!regexResult) { break; }
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

  private static _parseVariableAttributes(attributes: string): { [key: string]: string } {
    const result = <{ [key: string]: string }>{};
    const commaSplitted = attributes.split(",");
    for (let i = 0; i < commaSplitted.length; i++) {
      const colonSplitted = commaSplitted[i].split(":");
      result[colonSplitted[0].trim()] = colonSplitted[1].trim();
    }
    return result;
  }
  // http://regexper.com/#(%3F%3A%5C%2F%5C%2F%40%5C((.%2B)%5C))%3F%5Cs*uniform%5Cs%2B((%3F%3Alowp%7Cmediump%7Chighp)%5Cs%2B)%3F(%5Ba-z0-9A-Z%5D%2B)%5Cs%2B(%5Ba-zA-Z0-9_%5D%2B)(%3F%3A%5Cs*%5C%5B%5Cs*(%5Cd%2B)%5Cs*%5C%5D%5Cs*)%3F%5Cs*%3B
  private static _generateVariableFetchRegex(variableType: string): RegExp {
    return new RegExp(`(?:(?://)?@\\((.+)\\))?\\s*${variableType}\\s+(?:(lowp|mediump|highp)\\s+)?([a-z0-9A-Z]+)\\s+([a-zA-Z0-9_]+)(?:\\s*\\[\\s*(\\d+)\\s*\\]\\s*)?\\s*;`, "g");
  }

  private static _parseVariables(source: string, variableType: string): { [name: string]: IVariableInfo } {
    const result = <{ [name: string]: IVariableInfo }>{};
    const regex = ShaderParser._generateVariableFetchRegex(variableType);
    let regexResult;
    while ((regexResult = regex.exec(source))) {
      let name = regexResult[4];
      let type = regexResult[3];
      let precision = regexResult[2];
      let rawAnnotations = regexResult[1];
      result[name] = <IVariableInfo>{
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

  private static _removeVariableAnnotations(source: string): string {
    const regex = new RegExp("@\\(.+\\)", "g");
    let regexResult;
    while ((regexResult = regex.exec(source))) {
      source = source.substr(0, regexResult.index) + source.substring(regexResult.index + regexResult[0].length, source.length);
    }
    return source;
  }

  private static _removeOtherPart(source: string, partFlag: string): string {
    const regex = new RegExp(`\s*(?:\/\/+)?\s*@${partFlag}`, "g");
    while (true) {
      const found = regex.exec(source);
      if (!found) {
        break; // When there was no more found
      }
      let beginPoint = found.index;
      let index = beginPoint;
      while (true) { // ignore next {
        index++;
        if (source[index] === "{") {
          break;
        }
      }

      let bracketCount = 1;
      while (true) { // find matching bracket
        index++;
        if (index === source.length) {
          // error no bracket matching
          console.error("Invalid bracket matching!");
          return source;
        }
        if (source[index] === "{") {
          bracketCount++;
        }
        if (source[index] === "}") {
          bracketCount--;
        }
        if (bracketCount === 0) {
          break;
        }
      }
      const endPoint = index + 1;

      source = source.substr(0, beginPoint) + source.substring(endPoint, source.length);
    }
    return source;
  }

  private static _removeSelfOnlyTag(source: string, partFlag: string): string {
    const regex = new RegExp(`(\s*(?:\/\/+)?\s*@${partFlag})`, "g");
    while (true) {
      const found = regex.exec(source);
      if (!found) {
        break; // When there was no more found
      }
      let beginPoint = found.index;
      let index = beginPoint;
      while (true) { // ignore next {
        index++;
        if (source[index] === "{") {
          break;
        }
      }
      beginPoint = index;
      let bracketCount = 1;
      while (true) {  // find matching bracket
        index++;
        if (index === source.length) {
          // error no bracket matching
          console.error("Invalid bracket matching!");
          return source;
        }
        if (source[index] === "{") {
          bracketCount++;
        }
        if (source[index] === "}") {
          bracketCount--;
        }
        if (bracketCount === 0) {
          break;
        }
      }
      const endPoint = index + 1;
      source = source.substr(0, found.index) + source.substring(beginPoint + 1, endPoint - 1) + source.substring(endPoint + 1, source.length);
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
      const found = regex.exec(source);
      if (!found) {
        break;
      }
      result[found[2]] = found[1];
    }
    return result;
  }

  private static _removeAttributeVariables(source: string): string {
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

export = ShaderParser;
