import AnimagterBase = require("./AnimaterBase");
import Color4 = require("../../Math/Color4");
class Color4Animater extends AnimagterBase {

  protected updateAnimation(progress: number): void {
    const b = <Color4>this.beginValue;
    const e = <Color4>this.endValue;
    const ef = this.easingFunction.Ease;
    this.targetAttribute.Value = new Color4(ef(b.R, e.R, progress), ef(b.G, e.G, progress), ef(b.B, e.B, progress), ef(b.A, b.A, progress));
  }
}

export = Color4Animater;
