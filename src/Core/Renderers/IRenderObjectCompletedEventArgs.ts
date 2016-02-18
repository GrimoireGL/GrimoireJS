import RenderPathExecutor from "./RenderPathExecutor";
import RenderStageBase from "./RenderStages/RenderStageBase";
import SceneObject from "../SceneObjects/SceneObject";
import RenderStageChain from "./RenderStageChain";
import ResolvedChainInfo from "./ResolvedChainInfo";

interface IRenderObjectCompletedEventArgs {
  owner: RenderPathExecutor;
  renderedObject: SceneObject;
  stage: RenderStageBase;
  stageChain: RenderStageChain;
  bufferTextures: ResolvedChainInfo;
  technique: number;
}
export default IRenderObjectCompletedEventArgs;
