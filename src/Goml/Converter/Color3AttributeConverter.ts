import AttributeConverterBase from "./AttributeConverterBase";
import GomlAttribute from "../GomlAttribute";
import {Action0} from "../../Base/Delegates";
import EasingFunctionBase from "../Easing/EasingFunctionBase";
import AnimaterBase from "../Animater/AnimaterBase";
import Color3 from "../../Math/Color3";
import Color3Animater from "../Animater/Color3Animater";

class Color3AttributeConverter extends AttributeConverterBase {
  public toStringAttr(val: Color3): string {
    return val.toString();
  }

  public toObjectAttr(attr: string): Color3 {
    return Color3.parse(attr);
  }

  public getAnimater(attr: GomlAttribute, beginVal: any, endVal: any, beginTime: number, duration: number, easing: EasingFunctionBase, onComplete?: Action0): AnimaterBase {
    return new Color3Animater(attr, beginTime, duration, beginVal, endVal, easing, onComplete);
  }
}

export default Color3AttributeConverter;
