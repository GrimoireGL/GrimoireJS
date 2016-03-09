import ContextSafeResourceContainer from "./../ContextSafeResourceContainer";
import RBOWrapper from "./RBOWrapper";
class RBO extends ContextSafeResourceContainer {
    constructor(width, height, format = WebGLRenderingContext.DEPTH_COMPONENT16) {
        super();
        this._width = width;
        this._height = height;
        this._format = format;
        this.__initializeForFirst();
    }
    get Width() {
        return this._width;
    }
    get Height() {
        return this._height;
    }
    get Format() {
        return this._format;
    }
    __createWrapperForCanvas(canvas) {
        return new RBOWrapper(canvas, this);
    }
    resize(width, height) {
        if (this._width !== width || this._height !== height) {
            this._width = width;
            this._height = height;
            this.each(v => v.resize(width, height));
        }
    }
}
export default RBO;
