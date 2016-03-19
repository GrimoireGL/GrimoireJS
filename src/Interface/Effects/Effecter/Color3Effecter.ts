import EffecterBase from "./EffecterBase";
import Color3 from "../../../Math/Color3";

class Color3Effecter extends EffecterBase {

  protected __updateEffect(progress: number): void {
    const b = <Color3>this.__beginValue;
    const e = <Color3>this.__endValue;
    const ef = this.__easingFunction.ease;
    this.__targetAttribute.Value = new Color3(ef(b.R, e.R, progress), ef(b.G, e.G, progress), ef(b.B, e.B, progress));
  }
}

export default Color3Effecter;
