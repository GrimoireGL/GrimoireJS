import EffecterBase from "./EffecterBase";
import Quaternion from "../../../Math/Quaternion";
class RotationEffecter extends EffecterBase {

  protected __updateEffect(progress: number): void {
    const b = <Quaternion>this.__beginValue;
    const e = <Quaternion>this.__endValue;
    const ef = this.__easingFunction.ease;
    this.__targetAttribute.Value = Quaternion.slerp(b, e, ef(0, 1, progress));
  }
}

export default RotationEffecter;
