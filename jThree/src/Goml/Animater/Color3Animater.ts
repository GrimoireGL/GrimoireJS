import AnimagterBase = require("./AnimaterBase");
import Color3 = require("../../Math/Color3");
class Color3Animater extends AnimagterBase {

  protected updateAnimation(progress: number): void {
    const b = <Color3>this.beginValue;
    const e = <Color3>this.endValue;
    const ef = this.easingFunction.Ease;
    this.targetAttribute.Value = new Color3(ef(b.R, e.R, progress), ef(b.G, e.G, progress), ef(b.B, e.B, progress));
  }
}

export = Color3Animater;
