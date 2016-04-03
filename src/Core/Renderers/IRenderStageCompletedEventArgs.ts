import RenderStageChain from "./RenderStageChain";
import BufferInput from "./BufferInput";
interface IRenderStageCompletedEventArgs {
  completedChain: RenderStageChain;
  index: number;
  bufferTextures: BufferInput;
}

export default IRenderStageCompletedEventArgs;
