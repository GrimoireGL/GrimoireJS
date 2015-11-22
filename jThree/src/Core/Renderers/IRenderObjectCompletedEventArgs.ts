import RenderPathExecutor = require("./RenderPathExecutor");
import RenderStageBase = require("./RenderStages/RenderStageBase");
import SceneObject = require("../SceneObject");
import RenderStageChain = require("./RenderStageChain");
import ResolvedChainInfo = require("./ResolvedChainInfo");

interface IRenderObjectCompletedEventArgs
{
  owner:RenderPathExecutor;
  renderedObject:SceneObject;
  stage:RenderStageBase;
  stageChain:RenderStageChain;
  bufferTextures:ResolvedChainInfo;
  technique:number;
}
export = IRenderObjectCompletedEventArgs;
