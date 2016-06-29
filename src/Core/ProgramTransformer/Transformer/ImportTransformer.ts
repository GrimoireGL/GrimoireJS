import Context from "../../../Context";
import ContextComponents from "../../../ContextComponents";
import MaterialManager from "../../Materials/MaterialManager";
import ProgramTransformer from "./Base/ProgramTransformer";
class ImportTransformer extends ProgramTransformer {

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
  public static parseImport(source: string): Promise<string> {
    return ImportTransformer._materialManager.loadChunks(ImportTransformer.getImports(source)).then<string>(() => {
      while (true) {
        const regexResult = /\s*@import\s+"([^"]+)"/.exec(source);
        if (!regexResult) { break; }
        let importContent;
        importContent = ImportTransformer._materialManager.getShaderChunk(regexResult[1]);
        if (!importContent) {
          throw new Error(`Required shader chunk '${regexResult[1]}' was not found!!`);
        }
        source = source.replace(regexResult[0], `\n${importContent}\n`);
      }
      return source;
    });
  }

  private static get _materialManager(): MaterialManager {
   return Context.getContextComponent<MaterialManager>(ContextComponents.MaterialManager);
  }

  constructor() {
    super((transform) => {
      return ImportTransformer.parseImport(transform.transformSource).then((transformed: string) => {
        return {
          initialSource: transform.initialSource,
          transformSource: transformed,
          description: transform.description
        };
      });
    });
  }
}

export default ImportTransformer;
