import Scene from "../Scene";
import RenderPathExecutor from "./RenderPathExecutor";
interface IRenderPathCompletedEventArgs {
  owner: RenderPathExecutor;
  scene: Scene;
}
export default IRenderPathCompletedEventArgs;
