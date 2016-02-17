import Matrix from "../../../Math/Matrix";
import Color3 from "../../../Math/Color3";
import Vector3 from "../../../Math/Vector3";
import SceneObject from "../SceneObject";
class LightBase extends SceneObject {

  private color: Color3 = new Color3(0, 0, 0);

  public get Color(): Color3 {
    return this.color;
  }

  public set Color(col: Color3) {
    this.color = col;
  }

  public get Position(): Vector3 {
    return Matrix.transformPoint(this.Transformer.LocalToGlobal, new Vector3(0, 0, 0));
  }
}

export default LightBase;
