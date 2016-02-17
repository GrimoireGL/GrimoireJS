import Scene from "./Scene";
import BasicRenderer from "./Renderers/BasicRenderer";

interface RendererListChangedEventArgs {
  owner: Scene;
  renderer: BasicRenderer;
  isAdditionalChange: boolean;
}

export default RendererListChangedEventArgs;
