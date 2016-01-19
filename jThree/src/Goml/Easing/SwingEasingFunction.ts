import EasingFunctionBase = require("./EasingFunctionBase");
class SwingEasingFunction extends EasingFunctionBase {
  public Ease(begin: number, end: number, progress: number): number {
    return begin + (end - begin) * (0.5 - Math.cos(progress * Math.PI) / 2);
  }
}

export = SwingEasingFunction;
