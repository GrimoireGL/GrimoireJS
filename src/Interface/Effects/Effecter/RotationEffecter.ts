import EffecterBase from "./EffecterBase";
import Quaternion from "../../../Math/Quaternion";

class RotationEffecter extends EffecterBase<Quaternion> {
  protected __updateEffect(progress: number): void {
    const b = this.__beginValue;
    const e = this.__endValue;
    const ef = this.__easingFunction.ease;
    this.Value = Quaternion.slerp(b, e, ef(0, 1, progress));
  }
}

export default RotationEffecter;
