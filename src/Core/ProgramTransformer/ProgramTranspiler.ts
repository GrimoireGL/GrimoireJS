import RemoveAttributeVariableTransformer from "./Transformer/RemoveAttributeVariableTransformer";
import RemoveVariableAnnotationTransformer from "./Transformer/RemoveVariableAnnotationsTransformer";
import SourceSeparateTransformer from "./Transformer/SourceSeparateTransformer";
import PrecisionComplementTransformer from "./Transformer/PrecisionComplementTransformer";
import PrecisionParser from "./Transformer/PrecisionParser";
import VariableParser from "./Transformer/VariableParser";
import ImportTransformer from "./Transformer/ImportTransformer";
import RemoveCommentTransformer from "./Transformer/RemoveCommentTransformer";
import IProgramDescription from "./Base/IProgramDescription";
import IProgramTransformer from "./Base/IProgramTransformer";
import IProgramTransform from "./Base/IProgramTransform";
import MaterialManager from "../Materials/MaterialManager";
/**
 * Static parsing methods for XMML (eXtended Material Markup Language).
 * This class provides all useful methods for parsing XMML.
 */
class ProgramTranspiler {

  public static transformerGenerator: () => IProgramTransformer[] = () => {
    const transformers: IProgramTransformer[] = [];
    transformers.push(new RemoveCommentTransformer());
    transformers.push(new ImportTransformer());
    transformers.push(new VariableParser("uniform"));
    transformers.push(new VariableParser("attribute"));
    transformers.push(new SourceSeparateTransformer());
    transformers.push(new RemoveAttributeVariableTransformer());
    transformers.push(new RemoveVariableAnnotationTransformer());
    transformers.push(new PrecisionParser());
    transformers.push(new PrecisionComplementTransformer("mediump"));
    return transformers;
  };

  public static transform(source: string, transformers: IProgramTransformer[]): Promise<IProgramTransform> {
    let obj = {
      initialSource: source,
      transformSource: source,
      description: {
        fragment: null,
        vertex: null,
        uniforms: null,
        attributes: null,
        fragmentPrecisions: null,
        vertexPrecisions: null,
        functions: null
      }
    };
    let promise: Promise<IProgramTransform> = new Promise((resolve, reject) => {
      process.nextTick(() => {
        resolve(obj);
      });
    });
    for (let i = 0; i < transformers.length; i++) {
      promise = promise.then<IProgramTransform>((arg) => {
        obj.initialSource = source;
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
    return ProgramTranspiler.transform(codeString, ProgramTranspiler.transformerGenerator()).then((arg: IProgramTransform) => arg.description);
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
}

export default ProgramTranspiler;
