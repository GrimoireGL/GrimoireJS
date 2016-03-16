import RenderStageChain from "./RenderStageChain";
import BufferSet from "./BufferSet";
interface IRenderStageCompletedEventArgs {
  completedChain: RenderStageChain;
  index: number;
  bufferTextures: BufferSet;
}

export default IRenderStageCompletedEventArgs;
