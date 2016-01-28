import Camera = require("./Camera");
import Vector3 = require("../../Math/Vector3");
import glm = require("gl-matrix");
/**
 * The abstract class to be overridden by camera related class having view matrix.
 *
 * ビュー行列を保持するカメラによってオーバーライドされるための抽象クラス
 * @type {[type]}
 */
abstract class ViewCameraBase extends Camera {
    /**
     * constructor
     */
    constructor() {
        super();
        this._generateViewMatrix();
        this.transformer.onUpdateTransform((t, o) => this._updateViewProjectionMatrix());
    }

    /**
     * Notify view-projection matrix was updated.
     *
     * ビュー・射影行列が更新されたことを通知します。
     */
    private _updateViewProjectionMatrix(): void {
        this._generateViewMatrix();
        this.__updateViewProjectionMatrix();
    }

    /**
     * Generate view matrix
     *
     * ビュー行列を生成します。
     */
    private _generateViewMatrix(): void {
        glm.mat4.lookAt(this.viewMatrix.rawElements, this.Transformer.GlobalPosition.rawElements, Vector3.add(this.Transformer.forward, this.Transformer.GlobalPosition).rawElements, this.Transformer.up.rawElements);
    }
}

export = ViewCameraBase;
