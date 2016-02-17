import IRenderStageRendererConfigure from "./Renderers/RenderStages/IRenderStageRendererConfigure";
import Material from "./Materials/Material";
import MaterialPass from "./Materials/Base/MaterialPass";
interface IConfigureEventArgs {
  pass: MaterialPass;
  passIndex: number;
  material: Material;
  configure: IRenderStageRendererConfigure;
}

export default IConfigureEventArgs;
