import Scene from "./Scene";
interface IParentSceneChangedEventArgs {
  lastParentScene: Scene;
  currentParentScene: Scene;
}

export default IParentSceneChangedEventArgs;
