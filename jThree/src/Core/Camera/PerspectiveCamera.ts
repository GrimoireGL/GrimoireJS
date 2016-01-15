import ViewCamera = require("./ViewCameraBase");
import glm = require("gl-matrix");
class PerspectiveCamera extends ViewCamera {
    private _fovy: number = Math.PI / 4;
    private _aspect: number = 1;
    private _near: number = 0.1;
    private _far: number = 10;

    private _updateProjectionMatrix() {
        glm.mat4.perspective(this.projectionMatrix.rawElements, this._fovy, this._aspect, this._near, this._far);
        this.__updateViewProjectionMatrix();
    }

    public get Fovy(): number {
        return this._fovy;
    }

    public set Fovy(fovy: number) {
        this._fovy = fovy;
        this._updateProjectionMatrix();
    }

    public get Aspect(): number {
        return this._aspect;
    }

    public set Aspect(aspect: number) {
        this._aspect = aspect;
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

export = PerspectiveCamera;
