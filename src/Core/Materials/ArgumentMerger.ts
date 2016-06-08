import NamedValue from "../../Base/NamedValue";
import IShaderArgumentContainer from "./IShaderArgumentContainer";
class ArgumentMerger {

  private static _argumentCache: NamedValue<any> = {};
  /**
   * シェーダー引数をマージする
   * @param  {IShaderArgumentContainer} stage    [RenderStageのインスタンス]
   * @param  {IShaderArgumentContainer} material [Materialのインスタンス]
   * @param  {IShaderArgumentContainer} object   [SceneObjectのインスタンス]
   * @return {[type]}                            [description]
   */
  public static merge(stage: IShaderArgumentContainer, material: IShaderArgumentContainer, object?: IShaderArgumentContainer): NamedValue<any> {
    ArgumentMerger._deleteCache();
    ArgumentMerger._mergeArgument(stage);
    ArgumentMerger._mergeArgument(material);
    if (object) {
      ArgumentMerger._mergeArgument(object);
    }
    return ArgumentMerger._argumentCache;
  }

  private static _deleteCache(): void {
    for (let key in ArgumentMerger._argumentCache) {
      delete ArgumentMerger._argumentCache[key];
    }
  }

  private static _mergeArgument(container: IShaderArgumentContainer): void {
    for (let key in container.shaderVariables) {
      ArgumentMerger._argumentCache[key] = container.shaderVariables[key];
    }
  }
}

export default ArgumentMerger;
