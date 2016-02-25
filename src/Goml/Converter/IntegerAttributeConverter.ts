import AttributeConverterBase from "./AttributeConverterBase";
import IntegerAnimater from "../Animater/IntegerAnimater";
import GomlAttribute from "../GomlAttribute";
import EasingFunctionBase from "../Easing/EasingFunctionBase";
import {Action0} from "../../Base/Delegates";
import AnimaterBase from "../Animater/AnimaterBase";

class IntegerAttributeConverter extends AttributeConverterBase {
  public toStringAttr(val: number): string {
    return val.toString();
  }

  public toObjectAttr(attr: string): number {
    return parseInt(attr, 10);
  }

  public getAnimater(attr: GomlAttribute, beginVal: any, endVal: any, beginTime: number, duration: number, easing: EasingFunctionBase, onComplete?: Action0): AnimaterBase {
    return new IntegerAnimater(attr, beginTime, duration, beginVal, endVal, easing, onComplete);
  }
}

export default IntegerAttributeConverter;
