"use strict";
const BufferSet_1 = require("./BufferSet");
const RenderPathExecutor_1 = require("./RenderPathExecutor");
const Rectangle_1 = require("../../Math/Rectangle");
const BasicRendererConfigurator_1 = require("./RendererConfigurator/BasicRendererConfigurator");
const JThreeContext_1 = require("../../JThreeContext");
const ContextComponents_1 = require("../../ContextComponents");
const RenderPath_1 = require("./RenderPath");
const CanvasRegion_1 = require("../Canvas/CanvasRegion");
class BasicRenderer extends CanvasRegion_1.default {
    constructor(canvas, viewportArea, configurator) {
        super(canvas.canvasElement);
        this.renderPath = new RenderPath_1.default(this);
        this._viewport = new Rectangle_1.default(0, 0, 256, 256);
        configurator = configurator || new BasicRendererConfigurator_1.default();
        this._canvas = canvas;
        this._renderPathExecutor = new RenderPathExecutor_1.default(this);
        this._viewport = viewportArea;
        const rm = JThreeContext_1.default.getContextComponent(ContextComponents_1.default.ResourceManager);
        if (this._viewport) {
            rm.createRBO(this.ID + ".rbo.default", this._viewport.Width, this._viewport.Height);
        }
        this.renderPath.fromPathTemplate(configurator.getStageChain(this));
        this.bufferSet = new BufferSet_1.default(this);
        this.bufferSet.appendBuffers(configurator.TextureBuffers);
        this.name = this.ID;
    }
    initialize() {
        this.alternativeTexture = this.__initializeAlternativeTexture();
        this.alternativeCubeTexture = this.__initializeAlternativeCubeTexture();
    }
    get Camera() {
        return this._camera;
    }
    set Camera(camera) {
        this._camera = camera;
    }
    render(scene) {
        this._renderPathExecutor.processRender(scene, this.renderPath);
    }
    get Canvas() {
        return this._canvas;
    }
    get GL() {
        return this._canvas.gl;
    }
    beforeRender() {
        this.applyDefaultBufferViewport();
        this.Canvas.beforeRender(this);
    }
    afterRender() {
        this.GL.flush();
        this.Canvas.afterRender(this);
    }
    get RenderPathExecutor() {
        return this._renderPathExecutor;
    }
    get region() {
        return this._viewport;
    }
    set region(area) {
        if (!Rectangle_1.default.equals(area, this._viewport) && (typeof area.Width !== "undefined") && (typeof area.Height !== "undefined")) {
            if (isNaN(area.Height + area.Width)) {
                return;
            }
            this._viewport = area;
            JThreeContext_1.default.getContextComponent(ContextComponents_1.default.ResourceManager).getRBO(this.ID + ".rbo.default").resize(area.Width, area.Height);
            this.emit("resize", area);
        }
    }
    applyDefaultBufferViewport() {
        this.GL.viewport(this._viewport.Left, this._canvas.region.Height - this._viewport.Bottom, this._viewport.Width, this._viewport.Height);
    }
    applyRendererBufferViewport() {
        this.GL.viewport(0, 0, this._viewport.Width, this._viewport.Height);
    }
    __initializeAlternativeTexture() {
        const rm = JThreeContext_1.default.getContextComponent(ContextComponents_1.default.ResourceManager);
        let tex = rm.createTexture("jthree.alt.texture2D." + this.ID, 1, 1);
        tex.updateTexture(new Uint8Array([255, 0, 255, 255]));
        return tex;
    }
    __initializeAlternativeCubeTexture() {
        const rm = JThreeContext_1.default.getContextComponent(ContextComponents_1.default.ResourceManager);
        let tex = rm.createCubeTextureWithSource("jthree.alt.textureCube." + this.ID, null);
        return tex;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BasicRenderer;
//# sourceMappingURL=BasicRenderer.js.map