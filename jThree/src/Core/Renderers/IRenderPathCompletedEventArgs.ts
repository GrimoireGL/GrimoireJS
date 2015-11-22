import Scene = require("../Scene");
import RenderPathExecutor = require("./RenderPathExecutor");
interface IRenderPathCompletedEventArgs
{
  owner:RenderPathExecutor;
  scene:Scene;
}
export = IRenderPathCompletedEventArgs;
