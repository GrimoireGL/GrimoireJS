import Scene = require("./Scene");
import SceneObject = require("./SceneObjects/SceneObject");
interface ISceneObjectStructureChangedEventArgs {
  scene: Scene;
  owner: SceneObject;
  isAdditionalChange: boolean;
  changedSceneObject?: SceneObject;
  changedSceneObjectID: string;
}

export = ISceneObjectStructureChangedEventArgs;
