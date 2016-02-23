import AnimagterBase from "./AnimaterBase";
import Quaternion from "../../Math/Quaternion";
class RotationAnimater extends AnimagterBase {

  protected updateAnimation(progress: number): void {
    const b = <Quaternion>this.beginValue;
    const e = <Quaternion>this.endValue;
    const ef = this.easingFunction.Ease;
    this.targetAttribute.Value = Quaternion.slerp(b, e, ef(0, 1, progress));
  }
}

export default RotationAnimater;
