import RBO from "../Resources/RBO/RBO";
import RenderPath from "./RenderPath";
import IRendererRecipe from "./Recipe/IRendererRecipe";
import RecipeLoader from "./Recipe/RecipeLoader";
import RendererBase from "./RendererBase";
import BufferSet from "./BufferSet";
import RenderPathExecutor from "./RenderPathExecutor";
import RendererConfiguratorBase from "./Recipe/RendererConfiguratorBase";
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
        const recipe = RecipeLoader.parseRender(require("./Recipe/DefaultRecipe.xml"));
        renderer.applyRecipe(recipe);
        return renderer;
    }


    public defaultRenderBuffer: RBO;

    public renderPath: RenderPath;

    public bufferSet: BufferSet;

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
        this._initializeRBO();
    }

    public applyRecipe(recipe: IRendererRecipe): void {
        this._resetRendererResources();
        this.bufferSet.appendBuffers(recipe.textures);
        this.renderPath.appendStages(recipe.stages);
        this._remapBuffers();
    }

    public dispose(): void {
        this.defaultRenderBuffer.dispose();
        this.bufferSet.dispose();
        this.renderPath.dispose();
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

    private _initializeRBO(): void {
     // Only works when the RBO was not initialized.
        if (!this.defaultRenderBuffer) {
            const rm = JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
            this.defaultRenderBuffer = rm.createRBO(this.id + ".rbo.default", this.region.Width, this.region.Height);
            // set event handler for the case when the viewport was resized.
            this.on("resize", () => {
                JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager).getRBO(this.id + ".rbo.default").resize(this.region.Width, this.region.Height);
            });
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

    /**
     * Reset bufferset and renderer path.
     */
    private _resetRendererResources(): void {
        if (this.renderPath) {
            this.renderPath.dispose();
        }
        if (this.bufferSet) {
            this.bufferSet.dispose();
        }
        this.bufferSet = new BufferSet(this);
        this.renderPath = new RenderPath(this);
        this.bufferSet.on("changed", () => this._remapBuffers());
    }
}


export default BasicRenderer;
