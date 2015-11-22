import RenderPathExecutor = require("./RenderPathExecutor");
import RenderStageChain = require("./RenderStageChain");
import ResolvedChainInfo = require("./ResolvedChainInfo");
interface IRenderStageCompletedEventArgs
{
  owner:RenderPathExecutor;
  completedChain:RenderStageChain;
  index:number;
  bufferTextures:ResolvedChainInfo;
}

export = IRenderStageCompletedEventArgs;
