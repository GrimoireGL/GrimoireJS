import AttributeConverterBase from "./AttributeConverterBase";
import GomlAttribute from "../GomlAttribute";
import {Action0} from "../../Base/Delegates";
import EasingFunctionBase from "../Easing/EasingFunctionBase";
import AnimaterBase from "../Animater/AnimaterBase";
import Vector3 from "../../Math/Vector3";
import Vector3Animater from "../Animater/Vector3Animater";

class Vector3AttributeConverter extends AttributeConverterBase {
  public toStringAttr(val: Vector3): string {
    return val.toString();
  }

  public toObjectAttr(attr: string): Vector3 {
    return Vector3.parse(attr);
  }

  public GetAnimater(attr: GomlAttribute, beginVal: any, endVal: any, beginTime: number, duration: number, easing: EasingFunctionBase, onComplete?: Action0): AnimaterBase {
    return new Vector3Animater(attr, beginTime, duration, beginVal, endVal, easing, onComplete);
  }
}

export default Vector3AttributeConverter;
