import Matrix = require("../../Math/Matrix");
import Color3 = require("../../Math/Color3");
import Vector3 = require("../../Math/Vector3");
import SceneObject = require("../SceneObject");
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

export = LightBase;
