import EffecterBase from "./EffecterBase";
class NumberEffecter extends EffecterBase {

  protected __updateEffect(progress: number): void {
    this.__targetAttribute.Value = this.__easingFunction.ease(this.__beginValue, this.__endValue, progress);
  }
}

export default NumberEffecter;
