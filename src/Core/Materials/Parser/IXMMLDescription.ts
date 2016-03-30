import RegistererBase from "../../Pass/Registerer/RegistererBase";
import Program from "../../Resources/Program/Program";
import IRenderStageRenderConfigure from "../../Renderers/RenderStages/IRenderStageRendererConfigure";
interface IXMMLDescription {
  order: number;
  name: string;
  group: string;
  registerers: RegistererBase[];
  pass: IXMMLPassDescription[];
}

interface IXMMLPassDescription {
  renderConfig: IRenderStageRenderConfigure;
  program: Program;
}

export default IXMMLDescription;
