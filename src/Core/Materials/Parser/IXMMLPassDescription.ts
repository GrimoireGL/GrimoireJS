import IProgramDescription from "../../ProgramTransformer/Base/IProgramDescription";
import Program from "../../Resources/Program/Program";
import IRenderStageRenderConfigure from "../../Renderers/RenderStages/IRenderStageRendererConfigure";
interface IXMMLPassDescription {
  renderConfig: IRenderStageRenderConfigure;
  program: Program;
  programDescription: IProgramDescription;
  passIndex: number;
}
export default IXMMLPassDescription;
