import SceneManager = require("./SceneManager");
import Scene = require("./Scene");
interface ISceneListChangedEventArgs
{
  owner:SceneManager;
  changedScene:Scene;
  isAdditionalChange:boolean;
}
export = ISceneListChangedEventArgs;
