import RenderPathExecutor from "./RenderPathExecutor";
import RenderStageChain from "./RenderStageChain";
import ResolvedChainInfo from "./ResolvedChainInfo";
interface IRenderStageCompletedEventArgs {
  owner: RenderPathExecutor;
  completedChain: RenderStageChain;
  index: number;
  bufferTextures: ResolvedChainInfo;
}

export default IRenderStageCompletedEventArgs;
