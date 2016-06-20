import NamespaceUtil from "../../Base/NamespaceUtil";
import XMLReader from "../../Base/XMLReader";
import IRenderer from "./IRenderer";
import HitAreaRenderStage from "./RenderStages/HitAreaRenderStage";
import BasicRenderStage from "./RenderStages/Base/BasicRenderStage";
import PathRenderer from "./PathRenderer";
import RenderStageBase from "./RenderStages/RenderStageBase";
import ContextComponents from "../../ContextComponents";
import IContextComponent from "../../IContextComponent";
class RenderStageRegistory implements IContextComponent {
    private _renderStageFactoryFunctions: { [key: string]: (r: IRenderer) => RenderStageBase } = {};

    constructor() {
        this.register("http://grimoire.gl/ns/recipe/stages", "hitarea", (renderer) => new HitAreaRenderStage(renderer));
        this.register(require("./RenderStages/BuiltIn/GBuffer.rsml"));
        this.register(require("./RenderStages/BuiltIn/LightAccumulationStage.rsml"));
        this.register(require("./RenderStages/BuiltIn/ForwardShading.rsml"));
        this.register(require("./RenderStages/BuiltIn/Fog.rsml"));
        this.register(require("./RenderStages/BuiltIn/FogExp2.rsml"));
        this.register(require("./RenderStages/BuiltIn/Skybox.rsml"));
        this.register(require("./RenderStages/BuiltIn/FXAA.rsml"));
        this.register(require("./RenderStages/BuiltIn/Sobel.rsml"));
        this.register(require("./RenderStages/BuiltIn/Gaussian.rsml"));
    }

    public getContextComponentIndex(): number {
        return ContextComponents.RenderStageRegistory;
    }

    /**
     * Register new render stage factory from RSML source.
     * @param {string} source RSML source
     */
    public register(source: string): void;
    /**
     * Register new render stage factory from delegate function.
     * This overload mainly used for registering custum overrided class.
     * @param {string}                            name              the key to be used for constructing the render stage
     * @param {Func1<PathRenderer, RenderStageBase>} factory       factory function for constructing the render stage
     */
    public register(namespace: string, name: string, factory: (r: PathRenderer) => RenderStageBase): void;
    public register(name: string, factory: (r: PathRenderer) => RenderStageBase): void;
    public register(arg1: string, arg2?: ((r: PathRenderer) => RenderStageBase) | string, arg3?: (r: PathRenderer) => RenderStageBase): void {
        if (arg1 && !arg2 && !arg3) {
            // Assume raw source code was passe
            const source = arg1;
            const rsmlRoot = XMLReader.getSingleElement(XMLReader.parseXML(source), "rsml", true);
            const stageRoot = XMLReader.getSingleElement(rsmlRoot, "stage", true);
            const name = NamespaceUtil.generateFQN(stageRoot.getAttribute("namespace"), stageRoot.getAttribute("name"));
            if (!name) {
                console.error(`The name field was not found in RSML file.\n${source}`);
                return;
            }
            this._renderStageFactoryFunctions[name] = (renderer: PathRenderer) => new BasicRenderStage(renderer, source);

        } else {
            let ns: string = null;
            let factory: (r: PathRenderer) => RenderStageBase;
            let name: string;
            if (arg3) {
                // Assume namespace was specified
                ns = arg1;
                factory = arg3;
                name = <string>arg2;
            } else {
                factory = <(r: PathRenderer) => RenderStageBase>arg2;
                name = arg1;
            }
            this._renderStageFactoryFunctions[NamespaceUtil.generateFQN(ns, name)] = factory;
        }
    }

    /**
     * Construct new render stage related to specifed key.
     * @param  {string}          name     the key to identify render stage
     * @param  {PathRenderer}   renderer the renderer being going to hold generated render stage base
     * @return {RenderStageBase}          generated render stage base
     */
    public construct(name: string, renderer: IRenderer): RenderStageBase {
        return this._renderStageFactoryFunctions[name](renderer);
    }
}
export default RenderStageRegistory;
