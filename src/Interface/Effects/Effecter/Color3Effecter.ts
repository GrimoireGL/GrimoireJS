import EffecterBase from "./EffecterBase";
import Color3 from "../../../Math/Color3";

class Color3Effecter extends EffecterBase<Color3> {
  protected __updateEffect(progress: number): void {
    const b = this.__beginValue;
    const e = this.__endValue;
    const ef = this.__easingFunction.ease;
    this.Value = new Color3(ef(b.R, e.R, progress), ef(b.G, e.G, progress), ef(b.B, e.B, progress));
  }
}

export default Color3Effecter;
