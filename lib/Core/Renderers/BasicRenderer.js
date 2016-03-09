import BufferSet from "./BufferSet";
import RenderPathExecutor from "./RenderPathExecutor";
import Rectangle from "../../Math/Rectangle";
import RendererConfigurator from "./RendererConfigurator/BasicRendererConfigurator";
import JThreeContext from "../../JThreeContext";
import ContextComponents from "../../ContextComponents";
import RenderPath from "./RenderPath";
import CanvasRegion from "../Canvas/CanvasRegion";
/**
* Provides base class feature for renderer classes.
*/
class BasicRenderer extends CanvasRegion {
    /**
     * Constructor of RenderBase
     * @param canvas
     * @param viewportArea
     * @returns {}
     */
    constructor(canvas, viewportArea, configurator) {
        super(canvas.canvasElement);
        this.renderPath = new RenderPath(this);
        this._viewport = new Rectangle(0, 0, 256, 256);
        configurator = configurator || new RendererConfigurator();
        this._canvas = canvas;
        this._renderPathExecutor = new RenderPathExecutor(this);
        this._viewport = viewportArea;
        const rm = JThreeContext.getContextComponent(ContextComponents.ResourceManager);
        if (this._viewport) {
            rm.createRBO(this.ID + ".rbo.default", this._viewport.Width, this._viewport.Height);
        }
        this.renderPath.fromPathTemplate(configurator.getStageChain(this));
        this.bufferSet = new BufferSet(this);
        this.bufferSet.appendBuffers(configurator.TextureBuffers);
        this.name = this.ID;
    }
    /**
     * Initialize renderer to be rendererd.
     * Basically, this method are used for initializing GL resources, the other variable and any resources will be initialized when constructor was called.
     * This method is not intended to be called by user manually.
     */
    initialize() {
        this.alternativeTexture = this.__initializeAlternativeTexture();
        this.alternativeCubeTexture = this.__initializeAlternativeCubeTexture();
    }
    /**
     * The camera reference this renderer using for draw.
     */
    get Camera() {
        return this._camera;
    }
    /**
     * The camera reference this renderer using for draw.
     */
    set Camera(camera) {
        this._camera = camera;
    }
    render(scene) {
        this._renderPathExecutor.processRender(scene, this.renderPath);
    }
    /**
     * Canvas managing this renderer.
     */
    get Canvas() {
        return this._canvas;
    }
    get GL() {
        return this._canvas.gl;
    }
    /**
     * It will be called before processing renderer.
     * If you need to override this method, you need to call same method of super class first.
     */
    beforeRender() {
        this.applyDefaultBufferViewport();
        this.Canvas.beforeRender(this);
    }
    /**
     * It will be called after processing renderer.
     * If you need to override this method, you need to call same method of super class first.
     */
    afterRender() {
        this.GL.flush();
        this.Canvas.afterRender(this);
    }
    /**
     * Provides render stage abstraction
     */
    get RenderPathExecutor() {
        return this._renderPathExecutor;
    }
    /**
     * Getter for viewport area. Viewport area is the area to render.
     * @returns {Rectangle} the rectangle region to render.
     */
    get region() {
        return this._viewport;
    }
    /**
     * Setter for viewport area. viewport area is the area to render.
     * @param area {Rectangle} the rectangle to render.
     */
    set region(area) {
        if (!Rectangle.equals(area, this._viewport) && (typeof area.Width !== "undefined") && (typeof area.Height !== "undefined")) {
            if (isNaN(area.Height + area.Width)) {
                return;
            }
            this._viewport = area;
            JThreeContext.getContextComponent(ContextComponents.ResourceManager).getRBO(this.ID + ".rbo.default").resize(area.Width, area.Height);
            this.emit("resize", area); // This should be moved in canvas region
        }
    }
    /**
     * Apply viewport configuration
     */
    applyDefaultBufferViewport() {
        this.GL.viewport(this._viewport.Left, this._canvas.region.Height - this._viewport.Bottom, this._viewport.Width, this._viewport.Height);
    }
    applyRendererBufferViewport() {
        this.GL.viewport(0, 0, this._viewport.Width, this._viewport.Height);
    }
    /**
     * Initialize and obtain the buffer texture which will be used when any texture sampler2D variable in GLSL was not assigned.
     * This method will be called when RendererFactory called initialize method to construct instance.
     * Basically,this method is not intended to be called from user.
     * @return {TextureBase} Constructed texture buffer.
     */
    __initializeAlternativeTexture() {
        const rm = JThreeContext.getContextComponent(ContextComponents.ResourceManager);
        let tex = rm.createTexture("jthree.alt.texture2D." + this.ID, 1, 1);
        tex.updateTexture(new Uint8Array([255, 0, 255, 255])); // Use purple color as the color of default buffer texture.
        return tex;
    }
    __initializeAlternativeCubeTexture() {
        const rm = JThreeContext.getContextComponent(ContextComponents.ResourceManager);
        let tex = rm.createCubeTextureWithSource("jthree.alt.textureCube." + this.ID, null);
        return tex;
    }
}
export default BasicRenderer;
