import Scene = require("./Scene");
import BasicRenderer = require("./Renderers/BasicRenderer");

interface RendererListChangedEventArgs {
  owner: Scene;
  renderer: BasicRenderer;
  isAdditionalChange: boolean;
}

export = RendererListChangedEventArgs;
