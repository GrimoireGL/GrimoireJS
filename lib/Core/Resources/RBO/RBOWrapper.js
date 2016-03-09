import ResourceWrapper from "../ResourceWrapper";
/**
 * Provides wrapper class for Render Buffer Object depending on particular WebGLRenderingContext.
 * Most of user may have no reason to modify by themselves.
 */
class RBOWrapper extends ResourceWrapper {
    constructor(canvas, parentRBO) {
        super(canvas);
        this._parent = parentRBO;
    }
    get Target() {
        return this._targetRBO;
    }
    init() {
        if (this.Initialized) {
            return;
        }
        this._targetRBO = this.GL.createRenderbuffer();
        this.bind();
        this.GL.renderbufferStorage(this.GL.RENDERBUFFER, this._parent.Format, this._parent.Width, this._parent.Height);
        this.__setInitialized();
    }
    bind() {
        this.GL.bindRenderbuffer(this.GL.RENDERBUFFER, this._targetRBO);
    }
    resize(width, height) {
        if (this.Initialized) {
            this.bind();
            this.GL.renderbufferStorage(this.GL.RENDERBUFFER, this._parent.Format, this._parent.Width, this._parent.Height);
        }
    }
    dispose() {
        if (this._targetRBO) {
            this.GL.deleteRenderbuffer(this._targetRBO);
            this._targetRBO = null;
            this.__setInitialized(false);
        }
    }
}
export default RBOWrapper;
