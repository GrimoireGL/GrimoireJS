import AttributeConverterBase from "./AttributeConverterBase";
import GomlAttribute from "../GomlAttribute";
import {Action0} from "../../Base/Delegates";
import EasingFunctionBase from "../Easing/EasingFunctionBase";
import AnimaterBase from "../Animater/AnimaterBase";
import Color4 from "../../Math/Color4";
import Color4Animater from "../Animater/Color4Animater";

class Color4AttributeConverter extends AttributeConverterBase {
  public toStringAttr(val: Color4): string {
    return val.toString();
  }

  public toObjectAttr(attr: string): Color4 {
    return Color4.parse(attr);
  }

  public getAnimater(attr: GomlAttribute, beginVal: any, endVal: any, beginTime: number, duration: number, easing: EasingFunctionBase, onComplete?: Action0): AnimaterBase {
    return new Color4Animater(attr, beginTime, duration, beginVal, endVal, easing, onComplete);
  }
}

export default Color4AttributeConverter;
