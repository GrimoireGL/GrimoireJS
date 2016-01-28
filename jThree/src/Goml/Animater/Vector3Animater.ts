import AnimagterBase = require("./AnimaterBase");
import Vector3 = require("../../Math/Vector3");
class Vector3Animater extends AnimagterBase {

  protected updateAnimation(progress: number): void {
    const b = <Vector3>this.beginValue;
    const e = <Vector3>this.endValue;
    const ef = this.easingFunction.Ease;
    this.targetAttribute.Value = new Vector3(ef(b.X, e.X, progress), ef(b.Y, e.Y, progress), ef(b.Z, e.Z, progress));
    // console.log(this.targetAttribute.Value.Z);
  }
}

export = Vector3Animater;
