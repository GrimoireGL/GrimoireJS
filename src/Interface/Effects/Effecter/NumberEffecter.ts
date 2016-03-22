import EffecterBase from "./EffecterBase";

class NumberEffecter extends EffecterBase<number> {
  protected __updateEffect(progress: number): void {
    this.Value = this.__easingFunction.ease(this.__beginValue, this.__endValue, progress);
  }
}

export default NumberEffecter;
