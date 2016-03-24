import EffecterBase from "./EffecterBase";

class IntegerEffecter extends EffecterBase<number> {
  protected __updateEffect(progress: number): void {
    const b = this.__beginValue;
    const e = this.__endValue;
    const ef = this.__easingFunction.ease;
    const val = Math.floor(ef(b, e, progress));
    if (this.Value !== val) {
      this.Value = val;
    }
  }
}

export default IntegerEffecter;
