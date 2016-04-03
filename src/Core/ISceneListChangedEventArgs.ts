import SceneManager from "./SceneManager";
import Scene from "./Scene";
interface ISceneListChangedEventArgs {
  owner: SceneManager;
  changedScene: Scene;
  isAdditionalChange: boolean;
}
export default ISceneListChangedEventArgs;
