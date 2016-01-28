import AnimagterBase from "./AnimaterBase";

class IntegerAnimater extends AnimagterBase {

  protected updateAnimation(progress: number): void {
    const b = <number>this.beginValue;
    const e = <number>this.endValue;
    const ef = this.easingFunction.Ease;
    const val = Math.floor(ef(b, e, progress));
    if (this.targetAttribute.Value !== val) {
      this.targetAttribute.Value = val;
    }
  }
}

export default IntegerAnimater;
