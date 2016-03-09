import BasicRenderer from "./BasicRenderer";
import BasicRendererConfigurator from "./RendererConfigurator/BasicRendererConfigurator";
import SpriteRendererConfigurator from "./RendererConfigurator/SpriteRendererConfigurator";
class RendererFactory {
    static generateRenderer(canvas, drawRect, configureName) {
        configureName = configureName || "default";
        const renderer = new BasicRenderer(canvas, drawRect, new RendererFactory.rendererConfigurations[configureName]());
        renderer.initialize();
        return renderer;
    }
}
RendererFactory.rendererConfigurations = {
    "default": BasicRendererConfigurator,
    "sprite": SpriteRendererConfigurator
};
export default RendererFactory;
