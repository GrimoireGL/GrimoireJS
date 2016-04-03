import EffecterBase from "./EffecterBase";
import Color4 from "../../../Math/Color4";

class Color4Effecter extends EffecterBase<Color4> {
  protected __updateEffect(progress: number): void {
    const b = this.__beginValue;
    const e = this.__endValue;
    const ef = this.__easingFunction.ease;
    this.Value = new Color4(ef(b.R, e.R, progress), ef(b.G, e.G, progress), ef(b.B, e.B, progress), ef(b.A, b.A, progress));
  }
}

export default Color4Effecter;
