import EffecterBase from "./EffecterBase";
import Vector3 from "../../../Math/Vector3";
class Vector3Effecter extends EffecterBase {

  protected __updateEffect(progress: number): void {
    const b = <Vector3>this.__beginValue;
    const e = <Vector3>this.__endValue;
    const ef = this.__easingFunction.ease;
    this.__targetAttribute.Value = new Vector3(ef(b.X, e.X, progress), ef(b.Y, e.Y, progress), ef(b.Z, e.Z, progress));
    // console.log(this.targetAttribute.Value.Z);
  }
}

export default Vector3Effecter;
