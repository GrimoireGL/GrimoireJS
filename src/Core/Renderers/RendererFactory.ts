import Canvas from "../Canvas/Canvas";
import Rectangle from "../../Math/Rectangle";
import BasicRenderer from "./BasicRenderer";
import BasicRendererConfigurator from "./RendererConfigurator/BasicRendererConfigurator";
import SpriteRendererConfigurator from "./RendererConfigurator/SpriteRendererConfigurator";

class RendererFactory {
  public static rendererConfigurations = {
    "default": BasicRendererConfigurator,
    "sprite": SpriteRendererConfigurator
  };

  public static generateRenderer(canvas: Canvas, drawRect: Rectangle, configureName: string) {
    configureName = configureName || "default";
    const renderer = new BasicRenderer(canvas, drawRect, new RendererFactory.rendererConfigurations[configureName]());
    renderer.initialize();
    return renderer;
  }
}

export default RendererFactory;
