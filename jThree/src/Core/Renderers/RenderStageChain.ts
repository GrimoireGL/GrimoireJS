import RenderStage from "./RenderStages/RenderStageBase";
interface RenderStageChain {
  buffers: {
    [name: string]: string
  };
  stage: RenderStage;
  variables: {};
}

export default RenderStageChain;
