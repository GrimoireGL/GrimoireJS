import ContextManagerBase = require("../ContextManagerBase");
import Rectangle = require("../../Math/Rectangle");
import RendererBase = require("./RendererBase");
class RendererFactory
{
  public static rendererConfigurations={
    "default":require("./RendererConfigurator/BasicRendererConfigurator"),
    "sprite":require("./RendererConfigurator/SpriteRendererConfigurator")
  };

  public static generateRenderer(contextManager:ContextManagerBase,drawRect:Rectangle,configureName:string)
  {
    configureName = configureName || "default";
    return new RendererBase(contextManager,drawRect,new RendererFactory.rendererConfigurations[configureName]());
  }
}

export = RendererFactory;
