import Scene from "./Scene";
interface ISceneListChangedEventArgs {
  changedScene: Scene;
  isAdditionalChange: boolean;
}
export default ISceneListChangedEventArgs;
