import ResourceWrapper from "../ResourceWrapper";
/**
 * Buffer wrapper based on context.
 */
class BufferWrapper extends ResourceWrapper {
    constructor(parentBuffer, canvas) {
        super(canvas);
        this._targetBuffer = null;
        this._length = 0;
        this._parentBuffer = parentBuffer;
    }
    dispose() {
        if (this._targetBuffer) {
            this.GL.deleteBuffer(this._targetBuffer);
            this.__setInitialized(false);
            this._targetBuffer = null;
        }
    }
    get Length() {
        return this._length;
    }
    get UnitCount() {
        return this._parentBuffer.UnitCount;
    }
    get ElementType() {
        return this._parentBuffer.ElementType;
    }
    get Normalized() {
        return this._parentBuffer.Normalized;
    }
    get Stride() {
        return this._parentBuffer.Stride;
    }
    get Offset() {
        return this._parentBuffer.Offset;
    }
    update(array, length) {
        if (!this.Initialized) {
            this.init();
        }
        this.bindBuffer();
        this.GL.bufferData(this._parentBuffer.Target, array, this._parentBuffer.Usage);
        this.unbindBuffer();
        this._length = length;
    }
    init() {
        if (this._targetBuffer == null) {
            this._targetBuffer = this.GL.createBuffer();
            this.__setInitialized();
        }
    }
    bindBuffer() {
        if (this.Initialized) {
            this.GL.bindBuffer(this._parentBuffer.Target, this._targetBuffer);
        }
        else {
            this.init();
            this.update(this._parentBuffer.ElementCache, this._parentBuffer.Length);
            this.GL.bindBuffer(this._parentBuffer.Target, this._targetBuffer);
        }
    }
    unbindBuffer() {
        if (this.Initialized) {
            this.GL.bindBuffer(this._parentBuffer.Target, null);
        }
    }
}
export default BufferWrapper;
