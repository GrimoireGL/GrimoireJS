import ContextSafeResourceContainer from "./../ContextSafeResourceContainer";
import RBOWrapper from "./RBOWrapper";
import Canvas from "../../../Core/Canvas/Canvas";
class RBO extends ContextSafeResourceContainer<RBOWrapper> {

    private _width: number;
    private _height: number;
    private _format: number;

    constructor(width: number, height: number, format: number = WebGLRenderingContext.DEPTH_COMPONENT16) {
        super();
        this._width = width;
        this._height = height;
        this._format = format;
        this.__initializeForFirst();
    }

    public get Width(): number {
        return this._width;
    }

    public get Height(): number {
        return this._height;
    }

    public get Format(): number {
        return this._format;
    }

    protected __createWrapperForCanvas(canvas: Canvas): RBOWrapper {
        return new RBOWrapper(canvas, this);
    }

    public resize(width: number, height: number): void {
        if (this._width !== width || this._height !== height) {
            this._width = width;
            this._height = height;
            this.each(v => (<RBOWrapper>v).resize(width, height));
        }
    }
}

export default RBO;
