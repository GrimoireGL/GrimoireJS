"use strict";
const GLExtensionRegistory_1 = require("./GL/GLExtensionRegistory");
const Rectangle_1 = require("../../Math/Rectangle");
const JThreeEvent_1 = require("../../Base/JThreeEvent");
const CanvasSizeChangedEventArgs_1 = require("./CanvasSizeChangedEventArgs");
const Color4_1 = require("../../Math/Color4");
const CanvasRegion_1 = require("./CanvasRegion");
const Exceptions_1 = require("../../Exceptions");
class Canvas extends CanvasRegion_1.default {
    constructor(canvasElement) {
        super(canvasElement);
        this.canvasResized = new JThreeEvent_1.default();
        this.clearColor = new Color4_1.default(1, 1, 1, 1);
        this.glExtensionResolver = new GLExtensionRegistory_1.default();
        this._lastWidth = canvasElement.width;
        this._lastHeight = canvasElement.height;
        this.__setGLContext(this._tryGetGLContext());
    }
    afterRender(renderer) {
        return;
    }
    afterRenderAll() {
        return;
    }
    beforeRender(renderer) {
        return;
    }
    beforeRenderAll() {
        if (this.canvasElement.height !== this._lastHeight || this.canvasElement.width !== this._lastWidth) {
            this.canvasResized.fire(this, new CanvasSizeChangedEventArgs_1.default(this, this._lastWidth, this._lastHeight, this.canvasElement.width, this.canvasElement.height));
            this._lastHeight = this.canvasElement.height;
            this._lastWidth = this.canvasElement.width;
        }
        this._clearCanvas();
    }
    get region() {
        return new Rectangle_1.default(0, 0, this._lastWidth, this._lastHeight);
    }
    __setGLContext(glContext) {
        this.gl = glContext;
        this.glExtensionResolver.checkExtensions(glContext);
        return;
    }
    _clearCanvas() {
        this.gl.colorMask(true, true, true, true);
        this.gl.clearColor.apply(this.gl, this.clearColor.rawElements);
        this.gl.depthMask(true);
        this.gl.clearDepth(1.0);
        this.gl.clear(WebGLRenderingContext.COLOR_BUFFER_BIT | WebGLRenderingContext.DEPTH_BUFFER_BIT);
    }
    _tryGetGLContext() {
        try {
            return this.canvasElement.getContext("webgl") || this.canvasElement.getContext("experimental-webgl");
        }
        catch (e) {
            throw new Exceptions_1.WebGLNotSupportedException();
        }
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Canvas;
//# sourceMappingURL=Canvas.js.map