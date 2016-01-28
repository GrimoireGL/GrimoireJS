import IRenderStageRendererConfigure = require("./Renderers/RenderStages/IRenderStageRendererConfigure");
import Material = require("./Materials/Material");
import MaterialPass = require("./Materials/Base/MaterialPass");
interface IConfigureEventArgs {
  pass: MaterialPass;
  passIndex: number;
  material: Material;
  configure: IRenderStageRendererConfigure;
}

export = IConfigureEventArgs;
