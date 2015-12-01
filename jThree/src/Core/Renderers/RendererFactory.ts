import Canvas = require("../Canvas");
import Rectangle = require("../../Math/Rectangle");
import BasicRenderer = require("./BasicRenderer");
class RendererFactory
{
  public static rendererConfigurations={
    "default":require("./RendererConfigurator/BasicRendererConfigurator"),
    "sprite":require("./RendererConfigurator/SpriteRendererConfigurator")
  };

  public static generateRenderer(canvas:Canvas,drawRect:Rectangle,configureName:string)
  {
    configureName = configureName || "default";
    return new BasicRenderer(canvas,drawRect,new RendererFactory.rendererConfigurations[configureName]());
  }
}

export = RendererFactory;
