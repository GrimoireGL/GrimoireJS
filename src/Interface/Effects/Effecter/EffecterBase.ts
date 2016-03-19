import JThreeObjectWithID from "../../../Base/JThreeObjectWithID";
import GomlAttribute from "../../../Goml/GomlAttribute";
import EasingFunctionBase from "../Easing/EasingFunctionBase";

class EffecterBase extends JThreeObjectWithID {
  protected __targetAttribute: GomlAttribute;

  protected __onComplete: () => void;

  protected __duration: number;

  protected __beginTime: number;

  protected __easingFunction: EasingFunctionBase;

  protected __beginValue: any;

  protected __endValue: any;

  constructor(targetAttribute: GomlAttribute, begintime: number, duration: number, beginValue: any, endValue: any, easing: EasingFunctionBase, onComplete?: () => void) {
    super();
    this.__targetAttribute = targetAttribute;
    this.__beginTime = begintime;
    this.__duration = duration;
    this.__onComplete = onComplete;
    this.__easingFunction = easing;
    this.__beginValue = this.__targetAttribute.Converter.toObjectAttr(beginValue);
    this.__endValue = this.__targetAttribute.Converter.toObjectAttr(endValue);
  }

  public set beginTime(time: number) {
    this.__beginTime = time;
  }

  /**
  * Upate
  */
  public update(time: number): boolean {
    let progress = (time - this.__beginTime) / this.__duration;
    const isFinish = progress >= 1;
    progress = Math.min(Math.max(progress, 0), 1); // clamp [0,1]
    this.__updateEffect(progress);
    if (isFinish && typeof this.__onComplete === "function") {
      this.__onComplete();
    }
    return isFinish;
  }

  /**
   * This methods should be overridden.
   * @param {number} progress [description]
   */
  protected __updateEffect(progress: number): void {
    return;
  }
}

export default EffecterBase;
