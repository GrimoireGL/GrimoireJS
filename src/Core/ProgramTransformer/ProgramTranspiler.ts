import RemoveVariableAnnotationTransformer from "./Transformer/RemoveVariableAnnotationsTransformer";
import SourceSeparateTransformer from "./Transformer/SourceSeparateTransformer";
import PrecisionComplementTransformer from "./Transformer/PrecisionComplementTransformer";
import PrecisionParser from "./Transformer/PrecisionParser";
import VariableParser from "./Transformer/VariableParser";
import ImportTransformer from "./Transformer/ImportTransformer";
import RemoveCommentTransformer from "./Transformer/RemoveCommentTransformer";
import IFunctionDescription from "./Base/IFunctionDescription";
import IArgumentDescription from "./Base/IArgumentDescription";
import IProgramDescription from "./Base/IProgramDescription";
import IProgramTransformer from "./Base/IProgramTransformer";
import IProgramTransform from "./Base/IProgramTransform";
import DescriptionTransformer from "./Transformer/Base/DescriptionTransformer";
import MaterialManager from "../Materials/MaterialManager";
/**
 * Static parsing methods for XMML (eXtended Material Markup Language).
 * This class provides all useful methods for parsing XMML.
 */
class ProgramTranspiler {
  public static transform(source: string, transformers: IProgramTransformer[]): Promise<IProgramTransform> {
    let promise: Promise<IProgramTransform> = new Promise((resolve, reject) => {
      process.nextTick(() => {
        resolve();
      });
    });
    for (let i = 0; i < transformers.length; i++) {
      promise = promise.then<IProgramTransform>((arg) => {
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
  public static parseCombined(codeString: string): Promise<IProgramDescription> {
    let transformers: IProgramTransformer[] = [];
    transformers.push(new RemoveCommentTransformer());
    transformers.push(new ImportTransformer());
    transformers.push(new VariableParser("uniform"));
    transformers.push(new VariableParser("attribute"));
    transformers.push(new DescriptionTransformer((arg: IProgramTransform) => {
      let functions = ProgramTranspiler._parseFunctions(arg.transformSource);
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
    transformers.push(new SourceSeparateTransformer());
    transformers.push(new DescriptionTransformer((arg: IProgramTransform) => {
      return {
        fragment: ProgramTranspiler._removeAttributeVariables(arg.description.fragment),
        vertex: arg.description.vertex,
        uniforms: arg.description.uniforms,
        attributes: arg.description.attributes,
        fragmentPrecisions: arg.description.fragmentPrecisions,
        vertexPrecisions: arg.description.vertexPrecisions,
        functions: arg.description.functions
      };
    }));
    transformers.push(new RemoveVariableAnnotationTransformer());
    transformers.push(new PrecisionParser());
    transformers.push(new PrecisionComplementTransformer("mediump"));

    return ProgramTranspiler.transform(codeString, transformers).then((arg: IProgramTransform) => arg.description);
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

  private static _removeVariableAnnotations(source: string): string {
    let regexResult;
    while (regexResult = /@\{.+\}/g.exec(source)) {
      source = source.substr(0, regexResult.index) + source.substring(regexResult.index + regexResult[0].length, source.length);
    }
    return source;
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

export default ProgramTranspiler;
