import AnimagterBase = require("./AnimaterBase");
import Quaternion = require("../../Math/Quaternion");
class RotationAnimater extends AnimagterBase {

  protected updateAnimation(progress: number): void {
    const b = <Quaternion>this.beginValue;
    const e = <Quaternion>this.endValue;
    const ef = this.easingFunction.Ease;
    this.targetAttribute.Value = Quaternion.Slerp(b, e, ef(0, 1, progress));
  }
}

export = RotationAnimater;
