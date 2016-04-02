import JThreeObjectWithID from "../../../Base/JThreeObjectWithID";
import EasingFunctionBase from "../Easing/EasingFunctionBase";

abstract class EffecterBase<T> extends JThreeObjectWithID {
  public appeared: boolean = true;

  protected __duration: number;

  protected __beginTime: number;

  protected __easingFunction: EasingFunctionBase;

  protected __beginValue: T;

  protected __endValue: T;

  private _value: T;

  private _onComplete: () => void;

  private _onUpdate: (value: T) => void;

  constructor(begintime: number, duration: number, beginValue: T, endValue: T, easing: EasingFunctionBase, onUpdate: (value: T) => void, onComplete?: () => void) {
    super();
    this.__beginTime = begintime;
    this.__duration = duration;
    this.__easingFunction = easing;
    this.__beginValue = beginValue;
    this.__endValue = endValue;
    this._value = beginValue;
    this._onUpdate = onUpdate;
    this._onComplete = onComplete;
  }

  protected set Value(value: T) {
    this._value = value;
    if (this.appeared) {
      this._onUpdate(value);
    }
  }

  protected get Value(): T {
    return this._value;
  }

  public set beginTime(time: number) {
    this.__beginTime = time;
  }

  public set onUpdate(callbackfn: () => void) {
    this._onUpdate = callbackfn;
  }

  /**
  * Upate
  */
  public update(time: number): boolean {
    let progress = (time - this.__beginTime) / this.__duration;
    const isFinish = progress >= 1;
    progress = Math.min(Math.max(progress, 0), 1); // clamp [0,1]
    this.__updateEffect(progress);
    if (isFinish && typeof this._onComplete === "function") {
      this._onComplete();
    }
    return isFinish;
  }

  /**
   * This methods should be overridden.
   * @param {number} progress [description]
   */
  protected abstract __updateEffect(progress: number): void;
}

export default EffecterBase;
