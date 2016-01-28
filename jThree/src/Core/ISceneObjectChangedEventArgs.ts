import Scene from "./Scene";
import SceneObject from "./SceneObjects/SceneObject";
interface ISceneObjectStructureChangedEventArgs {
  scene: Scene;
  owner: SceneObject;
  isAdditionalChange: boolean;
  changedSceneObject?: SceneObject;
  changedSceneObjectID: string;
}

export default ISceneObjectStructureChangedEventArgs;
