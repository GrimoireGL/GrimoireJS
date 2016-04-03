import RenderStageBase from "./RenderStages/RenderStageBase";
import SceneObject from "../SceneObjects/SceneObject";
import RenderStageChain from "./RenderStageChain";
import BufferInput from "./BufferInput";

interface IRenderObjectCompletedEventArgs {
  renderedObject: SceneObject;
  stage: RenderStageBase;
  stageChain: RenderStageChain;
  bufferTextures: BufferInput;
  technique: number;
}
export default IRenderObjectCompletedEventArgs;
