import RendererBase from "./RendererBase";
import BufferSet from "./BufferSet";
import RenderPathExecutor from "./RenderPathExecutor";
import RendererConfiguratorBase from "./Recipe/RendererConfiguratorBase";
import RendererConfigurator from "./Recipe/DefaultRecipe";
import JThreeContext from "../../JThreeContext";
import ContextComponents from "../../ContextComponents";
import ResourceManager from "../ResourceManager";
import Scene from "../Scene";
import Canvas from "../Canvas/Canvas";

/**
* Provides base class feature for renderer classes.
*/
class BasicRenderer extends RendererBase {

    public static fromConfigurator(canvas: Canvas, configurator: RendererConfiguratorBase): BasicRenderer {
        const renderer = new BasicRenderer(canvas);
        configurator = configurator || new RendererConfigurator();
        renderer.renderPath.fromPathTemplate(configurator.getStageChain(renderer));
        renderer.bufferSet.appendBuffers(configurator.TextureBuffers);
        return renderer;
    }

    /**
     * Constructor of RenderBase
     * @param canvas
     * @param viewportArea
     * @returns {}
     */
    constructor(canvas: Canvas) {
        super(canvas);
        this.region = canvas.region;
        this.bufferSet = new BufferSet(this);
    }

    /**
     * Initialize renderer to be rendererd.
     * Basically, this method are used for initializing GL resources, the other variable and any resources will be initialized when constructor was called.
     * This method is not intended to be called by user manually.
     */
    public initialize(): void {
        const rm = JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
        this.defaultRenderBuffer = rm.createRBO(this.id + ".rbo.default", this.region.Width, this.region.Height);
        this.on("resize", () => {
            JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager).getRBO(this.id + ".rbo.default").resize(this.region.Width, this.region.Height);
        });
        this._remapBuffers();
        this.bufferSet.on("changed", () => this._remapBuffers());
    }

    public dispose(): void {
        this.defaultRenderBuffer.dispose();
        this.bufferSet.dispose();
    }

    public render(scene: Scene): void {
        RenderPathExecutor.processRender(this, scene);
    }


    /**
     * It will be called before processing renderer.
     * If you need to override this method, you need to call same method of super class first.
     */
    public beforeRender(): void {
        this.applyViewport(true);
        this.canvas.beforeRender(this);
    }

    /**
     * It will be called after processing renderer.
     * If you need to override this method, you need to call same method of super class first.
     */
    public afterRender(): void {
        this.gl.flush();
        this.canvas.afterRender(this);
    }

    /**
     * Apply viewport configuration
     */
    public applyViewport(isDefaultBuffer: boolean): void {
        if (isDefaultBuffer) {
            this.gl.viewport(this.region.Left, this.canvas.region.Height - this.region.Bottom, this.region.Width, this.region.Height);
        } else {
            this.gl.viewport(0, 0, this.region.Width, this.region.Height);
        }
    }

    private _remapBuffers(): void {
        this.renderPath.path.forEach(chain => {
            chain.stage.bufferTextures.defaultRenderBuffer = this.defaultRenderBuffer;
            for (let bufferName in chain.buffers) {
                chain.stage.bufferTextures[bufferName] = this.bufferSet.getColorBuffer(chain.buffers[bufferName]);
            }
        });
    }
}


export default BasicRenderer;
