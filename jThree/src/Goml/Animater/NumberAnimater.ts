import AnimagterBase = require("./AnimaterBase");
class NumberAnimater extends AnimagterBase {

  protected updateAnimation(progress: number): void {
    this.targetAttribute.Value = this.easingFunction.Ease(this.beginValue, this.endValue, progress);
  }
}

export = NumberAnimater;
