import ResourceWrapper from "../ResourceWrapper";
/**
 * Provides wrapper class for Render Buffer Object depending on particular WebGLRenderingContext.
 * Most of user may have no reason to modify by themselves.
 */
class VAOWrapper extends ResourceWrapper {
    constructor(canvas, parentVAO) {
        super(canvas);
        this._parent = parentVAO;
        this._vaoInterface = canvas.glExtensionResolver.extensions["OES_vertex_array_object"];
    }
    get Target() {
        return this._targetVAO;
    }
    init() {
        if (this.Initialized) {
            return;
        }
        this._targetVAO = this._vaoInterface.createVertexArrayOES();
        this.__setInitialized();
    }
    bind() {
        // this.GL.bindRenderbuffer(this.targetVAO);
        this._vaoInterface.bindVertexArrayOES(this._targetVAO);
    }
    dispose() {
        if (this._targetVAO) {
            this._vaoInterface.deleteVertexArrayOES(this._targetVAO);
            this.__setInitialized(false);
            this._targetVAO = null;
        }
    }
}
export default VAOWrapper;
