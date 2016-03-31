import Scene from "./Scene";
import IRenderer from "./Renderers/IRenderer";

interface RendererListChangedEventArgs {
  owner: Scene;
  renderer: IRenderer;
  isAdditionalChange: boolean;
}

export default RendererListChangedEventArgs;
