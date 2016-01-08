import JThreeObject = require("../../Base/JThreeObject");
import Exceptions = require("../../Exceptions");
import AttributeParser = require("../AttributeParser");
import RotationAnimater = require("../Animater/RotationAnimater");
import GomlAttribute = require("../GomlAttribute");
import EasingFunctionBase = require("../Easing/EasingFunctionBase");
import Delegates = require("../../Base/Delegates");
import AnimaterBase = require("../Animater/AnimaterBase");
import Quaternion = require("../../Math/Quaternion");

class RotationAttributeConverter extends JThreeObject {
  public toStringAttr(val: Quaternion): string {
    return val.toAngleAxisString();
  }

  public toObjectAttr(attr: string): Quaternion {
    return AttributeParser.ParseRotation3D(attr);
  }

  public GetAnimater(attr: GomlAttribute, beginVal: any, endVal: any, beginTime: number, duration: number, easing: EasingFunctionBase, onComplete?: Delegates.Action0): AnimaterBase {
    return new RotationAnimater(attr, beginTime, duration, beginVal, endVal, easing, onComplete);
  }
}

export =RotationAttributeConverter;
