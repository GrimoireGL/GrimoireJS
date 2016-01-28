import JThreeObject from "../../Base/JThreeObject";
import AttributeParser from "../AttributeParser";
import RotationAnimater from "../Animater/RotationAnimater";
import GomlAttribute from "../GomlAttribute";
import EasingFunctionBase from "../Easing/EasingFunctionBase";
import {Action0} from "../../Base/Delegates";
import AnimaterBase from "../Animater/AnimaterBase";
import Quaternion from "../../Math/Quaternion";

class RotationAttributeConverter extends JThreeObject {
  public toStringAttr(val: Quaternion): string {
    return val.toAngleAxisString();
  }

  public toObjectAttr(attr: string): Quaternion {
    return AttributeParser.ParseRotation3D(attr);
  }

  public GetAnimater(attr: GomlAttribute, beginVal: any, endVal: any, beginTime: number, duration: number, easing: EasingFunctionBase, onComplete?: Action0): AnimaterBase {
    return new RotationAnimater(attr, beginTime, duration, beginVal, endVal, easing, onComplete);
  }
}

export default RotationAttributeConverter;
