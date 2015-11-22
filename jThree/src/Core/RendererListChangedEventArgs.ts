import Scene = require("./Scene");
import RendererBase = require("./Renderers/RendererBase");

interface RendererListChangedEventArgs
{
  owner:Scene;
  renderer:RendererBase;
  isAdditionalChange:boolean;
}

export = RendererListChangedEventArgs;
