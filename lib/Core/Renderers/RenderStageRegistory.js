import HitAreaRenderStage from "./RenderStages/HitAreaRenderStage";
import RSMLRenderStage from "./RenderStages/RSML/RSMLRenderStage";
import ContextComponents from "../../ContextComponents";
class RenderStageRegistory {
    constructor() {
        this._renderStageFactoryFunctions = {};
        this.register("jthree.hitarea", (renderer) => new HitAreaRenderStage(renderer));
        this.register(require("./RenderStages/BuiltIn/GBuffer.html"));
        this.register(require("./RenderStages/BuiltIn/LightAccumulationStage.html"));
        this.register(require("./RenderStages/BuiltIn/ForwardShading.html"));
        this.register(require("./RenderStages/BuiltIn/Fog.html"));
        this.register(require("./RenderStages/BuiltIn/FogExp2.html"));
        this.register(require("./RenderStages/BuiltIn/Skybox.html"));
        this.register(require("./RenderStages/BuiltIn/FXAA.html"));
        this.register(require("./RenderStages/BuiltIn/Sobel.html"));
        this.register(require("./RenderStages/BuiltIn/Gaussian.html"));
    }
    getContextComponentIndex() {
        return ContextComponents.RenderStageRegistory;
    }
    register(nameOrsource, factory) {
        if (factory) {
            this._renderStageFactoryFunctions[nameOrsource] = factory;
            return;
        }
        const parser = new DOMParser();
        const rsmlRoot = parser.parseFromString(nameOrsource, "text/xml");
        const stageRoot = rsmlRoot.querySelector("rsml > stage");
        const name = stageRoot.getAttribute("name");
        if (!name) {
            console.error(`The name field was not found in RSML file.\n${nameOrsource}`);
            return;
        }
        this._renderStageFactoryFunctions[name] = (renderer) => new RSMLRenderStage(renderer, nameOrsource);
    }
    /**
     * Construct new render stage related to specifed key.
     * @param  {string}          name     the key to identify render stage
     * @param  {BasicRenderer}   renderer the renderer being going to hold generated render stage base
     * @return {RenderStageBase}          generated render stage base
     */
    construct(name, renderer) {
        return this._renderStageFactoryFunctions[name](renderer);
    }
}
export default RenderStageRegistory;
