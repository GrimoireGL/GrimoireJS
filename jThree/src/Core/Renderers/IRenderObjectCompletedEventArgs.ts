import RenderPathExecutor = require("./RenderPathExecutor");
import RenderStageBase = require("./RenderStages/RenderStageBase");
import SceneObject = require("../SceneObject");
interface IRenderObjectCompletedEventArgs
{
  owner:RenderPathExecutor;
  renderedObject:SceneObject;
  stage:RenderStageBase;
}
export = IRenderObjectCompletedEventArgs;
