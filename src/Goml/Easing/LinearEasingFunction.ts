import EasingFunctionBase from "./EasingFunctionBase";

class LinearEasingFunction extends EasingFunctionBase {
  public ease(begin: number, end: number, progress: number): number {
    return begin + (end - begin) * progress;
  }
}

export default LinearEasingFunction;
