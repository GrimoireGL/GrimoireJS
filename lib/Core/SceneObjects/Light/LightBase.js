import Matrix from "../../../Math/Matrix";
import Color3 from "../../../Math/Color3";
import Vector3 from "../../../Math/Vector3";
import SceneObject from "../SceneObject";
class LightBase extends SceneObject {
    constructor(...args) {
        super(...args);
        this._color = new Color3(0, 0, 0);
    }
    get Color() {
        return this._color;
    }
    set Color(col) {
        this._color = col;
    }
    get Position() {
        return Matrix.transformPoint(this.Transformer.LocalToGlobal, new Vector3(0, 0, 0));
    }
}
export default LightBase;
