import ViewCamera from "./ViewCameraBase";
import {mat4} from "gl-matrix";
class OrthoCamera extends ViewCamera {
    private _left: number;
    private _right: number;
    private _top: number;
    private _bottom: number;
    private _near: number;
    private _far: number;

    constructor() {
        super();
        this._updateProjectionMatrix();
    }

    private _updateProjectionMatrix() {
        mat4.ortho(this.projectionMatrix.rawElements, this.Left, this.Right, this.Bottom, this.Top, this.Near, this.Far);
        mat4.invert(this.invProjectionMatrix.rawElements, this.projectionMatrix.rawElements);
        this.__updateViewProjectionMatrix();
    }

    public get Left(): number {
        return this._left;
    }

    public set Left(left: number) {
        this._left = left;
        this._updateProjectionMatrix();
    }

    public get Right(): number {
        return this._right;
    }

    public set Right(right: number) {
        this._right = right;
        this._updateProjectionMatrix();
    }

    public get Top(): number {
        return this._top;
    }

    public set Top(_top: number) {
        this._top = _top;
        this._updateProjectionMatrix();
    }

    public get Bottom() {
        return this._bottom;
    }

    public set Bottom(bottom: number) {
        this._bottom = bottom;
        this._updateProjectionMatrix();
    }

    public get Near(): number {
        return this._near;
    }

    public set Near(near: number) {
        this._near = near;
        this._updateProjectionMatrix();
    }

    public get Far(): number {
        return this._far;
    }

    public set Far(far: number) {
        this._far = far;
        this._updateProjectionMatrix();
    }

}

export default OrthoCamera;
