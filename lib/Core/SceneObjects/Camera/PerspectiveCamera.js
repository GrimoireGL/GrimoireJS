import ViewCamera from "./ViewCameraBase";
import { mat4 } from "gl-matrix";
class PerspectiveCamera extends ViewCamera {
    constructor(...args) {
        super(...args);
        this._fovy = Math.PI / 4;
        this._aspect = 1;
        this._near = 0.1;
        this._far = 10;
    }
    _updateProjectionMatrix() {
        mat4.perspective(this.projectionMatrix.rawElements, this._fovy, this._aspect, this._near, this._far);
        mat4.invert(this.invProjectionMatrix.rawElements, this.projectionMatrix.rawElements);
        this.__updateViewProjectionMatrix();
    }
    get Fovy() {
        return this._fovy;
    }
    set Fovy(fovy) {
        this._fovy = fovy;
        this._updateProjectionMatrix();
    }
    get Aspect() {
        return this._aspect;
    }
    set Aspect(aspect) {
        this._aspect = aspect;
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
export default PerspectiveCamera;
