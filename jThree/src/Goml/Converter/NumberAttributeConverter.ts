import AttributeConverterBase from "./AttributeConverterBase";
import GomlAttribute from "../GomlAttribute";
import {Action0} from "../../Base/Delegates";
import EasingFunctionBase from "../Easing/EasingFunctionBase";
import AnimaterBase from "../Animater/AnimaterBase";
import NumberAnimater from "../Animater/NumberAnimater";

class NumberAttributeConverter extends AttributeConverterBase {
  public toStringAttr(val: number): string {
    return val.toString();
  }

  public toObjectAttr(attr: string): number {
    return Number(attr);
  }

  public GetAnimater(attr: GomlAttribute, beginVal: any, endVal: any, beginTime: number, duration: number, easing: EasingFunctionBase, onComplete?: Action0): AnimaterBase {
    return new NumberAnimater(attr, beginTime, duration, beginVal, endVal, easing, onComplete);
  }
}

export default NumberAttributeConverter;
