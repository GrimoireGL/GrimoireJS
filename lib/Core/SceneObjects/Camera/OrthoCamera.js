import ViewCamera from "./ViewCameraBase";
import { mat4 } from "gl-matrix";
class OrthoCamera extends ViewCamera {
    constructor() {
        super();
        this._updateProjectionMatrix();
    }
    _updateProjectionMatrix() {
        mat4.ortho(this.projectionMatrix.rawElements, this.Left, this.Right, this.Bottom, this.Top, this.Near, this.Far);
        mat4.invert(this.invProjectionMatrix.rawElements, this.projectionMatrix.rawElements);
        this.__updateViewProjectionMatrix();
    }
    get Left() {
        return this._left;
    }
    set Left(left) {
        this._left = left;
        this._updateProjectionMatrix();
    }
    get Right() {
        return this._right;
    }
    set Right(right) {
        this._right = right;
        this._updateProjectionMatrix();
    }
    get Top() {
        return this._top;
    }
    set Top(_top) {
        this._top = _top;
        this._updateProjectionMatrix();
    }
    get Bottom() {
        return this._bottom;
    }
    set Bottom(bottom) {
        this._bottom = bottom;
        this._updateProjectionMatrix();
    }
    get Near() {
        return this._near;
    }
    set Near(near) {
        this._near = near;
        this._updateProjectionMatrix();
    }
    get Far() {
        return this._far;
    }
    set Far(far) {
        this._far = far;
        this._updateProjectionMatrix();
    }
}
export default OrthoCamera;
