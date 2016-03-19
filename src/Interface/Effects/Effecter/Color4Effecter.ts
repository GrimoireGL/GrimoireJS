import EffecterBase from "./EffecterBase";
import Color4 from "../../../Math/Color4";

class Color4Effecter extends EffecterBase {

  protected __updateEffect(progress: number): void {
    const b = <Color4>this.__beginValue;
    const e = <Color4>this.__endValue;
    const ef = this.__easingFunction.ease;
    this.__targetAttribute.Value = new Color4(ef(b.R, e.R, progress), ef(b.G, e.G, progress), ef(b.B, e.B, progress), ef(b.A, b.A, progress));
  }
}

export default Color4Effecter;
