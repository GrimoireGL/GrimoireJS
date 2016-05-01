import Canvas from "../Canvas/Canvas";
import Rectangle from "../../Math/Rectangle";
import BasicRenderer from "./BasicRenderer";
import DefaultRecipe from "./Recipe/DefaultRecipe";
import SpriteRendererConfigurator from "./Recipe/SpriteRendererConfigurator";

class RendererFactory {
    public static rendererConfigurations: { [key: string]: any; } = {
        "default": DefaultRecipe,
        "sprite": SpriteRendererConfigurator
    };

    public static generateRenderer(canvas: Canvas, drawRect: Rectangle, configureName: string): BasicRenderer {
        configureName = configureName || "default";
        const renderer = BasicRenderer.fromConfigurator(canvas, new RendererFactory.rendererConfigurations[configureName]());
        renderer.region = drawRect;
        renderer.initialize();
        return renderer;
    }
}

export default RendererFactory;
