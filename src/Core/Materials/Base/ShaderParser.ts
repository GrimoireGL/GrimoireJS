import IVariableDescription from "./IVariableDescription";
import IFunctionDescription from "./IFunctionDescription";
import IArgumentDescription from "./IArgumentDescription";
import IProgramDescription from "./IProgramDescription";
import IProgramTransformer from "./IProgramTransformer";
import IProgramTransform from "./IProgramTransform";
import ContextComponents from "../../../ContextComponents";
import JThreeContext from "../../../JThreeContext";
import MaterialManager from "./MaterialManager";
import JSON5 from "json5";
import Q from "q";
/**
 * Static parsing methods for XMML (eXtended Material Markup Language).
 * This class provides all useful methods for parsing XMML.
 */
class ShaderParser {

  public static transform(source: string, transformers: IProgramTransformer[]): Q.IPromise<IProgramTransform> {
    let promise: Q.IPromise<IProgramTransform> = Q.when(null);
    for (let i = 0; i < transformers.length; i++) {
      promise = promise.then<IProgramTransform>(function(arg): Q.IPromise<IProgramTransform> {
        console.log("");
        console.log("stage:" + (i + 1));
        let obj: {
          initialSource: string,
          transformSource: string,
          description: IProgramDescription
        };
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
  public static parseCombined(codeString: string): Q.IPromise<IProgramDescription> {
    class ProgramTransformer implements IProgramTransformer {
      private _func: (IProgramTransform) => Q.IPromise<IProgramTransform> = null;
      constructor(func: (IProgramTransform) => Q.IPromise<IProgramTransform>) {
        this._func = func;
      }
      public transform(input: IProgramTransform): Q.IPromise<IProgramTransform> {
        return this._func(input);
      }
    }
    class StringTransformer implements IProgramTransformer {
      private _stringTransformFunc: (string) => string = null;
      constructor(func: (string) => string) {
        this._stringTransformFunc = func;
      }
      public transform(input: IProgramTransform): Q.IPromise<IProgramTransform> {
        let pt: IProgramTransform = {
          initialSource: input.initialSource,
          transformSource: this._stringTransformFunc(input.transformSource),
          description: input.description
        };
        return Promise.resolve(pt);
      }
    }
    class DescriptionTransformer implements IProgramTransformer {
      private _descriptionTransformFunc: (IProgramTransform) => IProgramDescription = null;
      constructor(func: (IProgramTransform) => IProgramDescription) {
        this._descriptionTransformFunc = func;
      }
      public transform(input: IProgramTransform): Q.IPromise<IProgramTransform> {
        let nextDescription = this._descriptionTransformFunc(input);
        let pt: IProgramTransform = {
          initialSource: input.initialSource,
          transformSource: input.transformSource,
          description: nextDescription
        };
        return Promise.resolve(pt);
      }
    }

    const materialManager = JThreeContext.getContextComponent<MaterialManager>(ContextComponents.MaterialManager);
    let transformers: IProgramTransformer[] = [];
    transformers.push(new StringTransformer((x: string) => {
      return ShaderParser._removeMultiLineComment(x);
    }));
    transformers.push(new StringTransformer((arg: string) => {
      return ShaderParser._removeLineComment(arg);
    }));
    transformers.push(new ProgramTransformer((arg: IProgramTransform) => {
      return ShaderParser.parseImport(arg.transformSource, materialManager).then((s: string) => {
        return {
          initialSource: arg.initialSource,
          transformSource: s,
          description: arg.description
        };
      });
    }));
    transformers.push(new DescriptionTransformer((arg: IProgramTransform) => {
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
    transformers.push(new DescriptionTransformer((arg: IProgramTransform) => {
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
    transformers.push(new DescriptionTransformer((arg: IProgramTransform) => {
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
    transformers.push(new DescriptionTransformer((arg: IProgramTransform) => {
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
    transformers.push(new DescriptionTransformer((arg: IProgramTransform) => {
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
    transformers.push(new DescriptionTransformer((arg: IProgramTransform) => {
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
    transformers.push(new DescriptionTransformer((arg: IProgramTransform) => {
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
    transformers.push(new DescriptionTransformer((arg: IProgramTransform) => {
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
    transformers.push(new DescriptionTransformer((arg: IProgramTransform) => {
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
    transformers.push(new DescriptionTransformer((arg: IProgramTransform) => {
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
    transformers.push(new DescriptionTransformer((arg: IProgramTransform) => {
      let description: IProgramDescription = {
        fragment: arg.description.fragment,
        vertex: arg.description.vertex,
        uniforms: arg.description.uniforms,
        attributes: arg.description.attributes,
        fragmentPrecisions: arg.description.fragmentPrecisions,
        vertexPrecisions: arg.description.vertexPrecisions,
        functions: arg.description.functions
      };
      if (!arg.description.fragmentPrecisions["float"]) {// When precision of float in fragment shader was not declared,precision mediump float need to be inserted.
        description.fragment = this._addPrecision(description.fragment, "float", "mediump");
        description.fragmentPrecisions["float"] = "mediump";
      }
      return description;
    }));

    return ShaderParser.transform(codeString, transformers).then((arg: IProgramTransform) => arg.description);
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

  public static getImports(source: string): string[] {
    let importArgs = [];
    const importRegex = /\s*@import\s+"([^"]+)"/g;
    while (true) {
      const importEnum = importRegex.exec(source);
      if (!importEnum) { break; }
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
  public static parseImport(source: string, materialManager: MaterialManager): Q.IPromise<string> {
    return materialManager.loadChunks(ShaderParser.getImports(source)).then<string>(() => {
      while (true) {
        const regexResult = /\s*@import\s+"([^"]+)"/.exec(source);
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
    });
  }

  public static parseInternalImport(source: string, materialManager: MaterialManager): string {
    while (true) {
      const regexResult = /\s*@import\s+"([^"]+)"/.exec(source);
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

  private static _parseFunctions(source: string): { [name: string]: IFunctionDescription } {
    const regex = /([a-zA-Z]\w*)\s+([a-zA-Z]\w*)\s*\(([^\)]*?)\)\s*(?=\{)/g;
    const result = <{ [name: string]: IFunctionDescription }>{};
    let regexResult;
    while ((regexResult = regex.exec(source))) {
      let returnType = regexResult[1];
      let functionName = regexResult[2];
      let args = regexResult[3];
      let argumentDescriptions: IArgumentDescription[] = [];

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
            argumentDescriptions.push(<IArgumentDescription>{
              variableName: argName,
              variableType: argType,
              variablePrecision: argP
            });
          } else {
            let argType = spl[0];
            let argName = spl[1];
            argumentDescriptions.push(<IArgumentDescription>{
              variableName: argName,
              variableType: argType,
            });
          }
        }
      }

      result[name] = <IFunctionDescription>{
        functionName: functionName,
        functionType: returnType,
        functionPrecision: undefined,
        functionArgments: argumentDescriptions
      };
    }
    return result;
  }

  private static _parseVariableAttributes(attributes: string): { [key: string]: string } {
    return JSON5.parse(attributes);
  }
  // http://regexper.com/#(%3F%3A%5C%2F%5C%2F%40%5C((.%2B)%5C))%3F%5Cs*uniform%5Cs%2B((%3F%3Alowp%7Cmediump%7Chighp)%5Cs%2B)%3F(%5Ba-z0-9A-Z%5D%2B)%5Cs%2B(%5Ba-zA-Z0-9_%5D%2B)(%3F%3A%5Cs*%5C%5B%5Cs*(%5Cd%2B)%5Cs*%5C%5D%5Cs*)%3F%5Cs*%3B
  private static _generateVariableFetchRegex(variableType: string): RegExp {
    return new RegExp(`(?:@(\\{.+\\}))?\\s*${variableType}\\s+(?:(lowp|mediump|highp)\\s+)?([a-z0-9A-Z]+)\\s+([a-zA-Z0-9_]+)(?:\\s*\\[\\s*(\\d+)\\s*\\]\\s*)?\\s*;`, "g");
  }

  private static _parseVariables(source: string, variableType: string): { [name: string]: IVariableDescription } {
    const result = <{ [name: string]: IVariableDescription }>{};
    const regex = ShaderParser._generateVariableFetchRegex(variableType);
    let regexResult;
    while ((regexResult = regex.exec(source))) {
      let name = regexResult[4];
      let type = regexResult[3];
      let precision = regexResult[2];
      let rawAnnotations = regexResult[1];
      result[name] = <IVariableDescription>{
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
  private static _removeVariableAnnotations(source: string): string {
    let regexResult;
    while (regexResult = /@\{.+\}/g.exec(source)) {
      source = source.substr(0, regexResult.index) + source.substring(regexResult.index + regexResult[0].length, source.length);
    }
    return source;
  }

  private static _removeLineComment(source: string): string {
    let text: string = source;
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
  private static _removeMultiLineComment(source: string): string {
    while (true) {
      const found = source.indexOf("/*", 0);
      if (found < 0) {
        break; // When there was no more found
      }
      let beginPoint = found;
      const endPoint: number = source.indexOf("*/", beginPoint);
      if (endPoint < 1) {
        // error no bracket matching
        console.error("Invalid bracket matching!");
        return source;
      }

      source = source.substr(0, beginPoint) + source.substring(endPoint + 2, source.length);
    }
    return source;
  }

  private static _getEndBracketIndex(source: string, startIndex: number, beginBracket: string, endBracket: string): number {
    // get index of matching endBracket
    let index = startIndex;

    let bracketCount = 1;
    while (true) { // find matching bracket
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
      } else {
        index = nextBeginBlacket;
        bracketCount++;
        continue;
      }
    }
    return index;
  }

  private static _removeOtherPart(source: string, partFlag: string): string {
    const regex = new RegExp(`\s*(?:\/\/+)?\s*@${partFlag}`, "g");
    while (true) {
      const found = regex.exec(source);
      if (!found) {
        break; // When there was no more found
      }
      let beginPoint = found.index;
      let index = source.indexOf("{", beginPoint); // ignore next {
      const endPoint: number = this._getEndBracketIndex(source, index, "{", "}") + 1;
      if (endPoint < 1) {
        // error no bracket matching
        console.error("Invalid bracket matching!");
        return source;
      }

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
      let index = source.indexOf("{", found.index); // ignore next {
      let beginPoint = index;
      const endPoint: number = this._getEndBracketIndex(source, index, "{", "}") + 1;
      if (endPoint < 1) {
        // error no bracket matching
        console.error("Invalid bracket matching!");
        return source;
      }
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

export default ShaderParser;
