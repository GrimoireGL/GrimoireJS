import AnimagterBase from "./AnimaterBase";

class IntegerAnimater extends AnimagterBase {

  protected __updateAnimation(progress: number): void {
    const b = <number>this.__beginValue;
    const e = <number>this.__endValue;
    const ef = this.__easingFunction.ease;
    const val = Math.floor(ef(b, e, progress));
    if (this.__targetAttribute.Value !== val) {
      this.__targetAttribute.Value = val;
    }
  }
}

export default IntegerAnimater;
