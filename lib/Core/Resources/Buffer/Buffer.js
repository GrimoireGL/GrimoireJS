import ContextSafeResourceContainer from "../ContextSafeResourceContainer";
import BufferWrapper from "./BufferWrapper";
/**
 * Provides buffer resource without considering context.
 */
class Buffer extends ContextSafeResourceContainer {
    constructor(target, usage, unitCount, elementType) {
        super();
        /**
         * This elements are normalized or not.
         * It must be false in WebGL1.0.
         */
        this._normalized = false;
        this._stride = 0;
        this._offset = 0;
        /**
      * Length of this buffer.
      */
        this._length = 0;
        this._target = target;
        this._usage = usage;
        this._unitCount = unitCount;
        this._elementType = elementType;
        this.__initializeForFirst();
    }
    /**
    * Buffer target.
    * ArrayBuffer => VertexBuffer, ArrayElementBuffer => IndexBuffer
    */
    get Target() {
        return this._target;
    }
    /**
    * Buffer usage.
    * StaticDraw,DynamicDraw,StreamDraw
    */
    get Usage() {
        return this._usage;
    }
    get ElementType() {
        return this._elementType;
    }
    /**
    * This elements are normalized or not.
    * It must be false in WebGL1.0.
    */
    get Normalized() {
        return this._normalized;
    }
    /**
    * This elements are normalized or not.
    * It must be false in WebGL1.0.
    */
    set Normalized(normalized) {
        this._normalized = normalized;
    }
    get Stride() {
        return this._stride;
    }
    set Stride(stride) {
        this._stride = stride;
    }
    get Offset() {
        return this._offset;
    }
    set Offset(offset) {
        this._offset = offset;
    }
    /**
  * Element count per 1 vertex.
  * This accessor is readonly.
  */
    get UnitCount() {
        return this._unitCount;
    }
    get ElementCache() {
        return this._elementCache;
    }
    /**
     * Length of this buffer.
     */
    get Length() {
        return this._length;
    }
    update(array, length) {
        this._elementCache = array;
        this._length = length;
        this.each((a) => a.update(array, length));
    }
    __createWrapperForCanvas(canvas) {
        return new BufferWrapper(this, canvas);
    }
}
export default Buffer;
