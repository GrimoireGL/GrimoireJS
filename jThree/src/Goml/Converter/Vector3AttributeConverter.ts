import AttributeConverterBase = require("./AttributeConverterBase");
import Exceptions = require("../../Exceptions");
import GomlAttribute = require("../GomlAttribute");
import Delegates = require("../../Base/Delegates");
import EasingFunctionBase = require("../Easing/EasingFunctionBase");
import AnimaterBase = require("../Animater/AnimaterBase");
import Vector3 = require("../../Math/Vector3");
import Vector3Animater = require("../Animater/Vector3Animater");

class Vector3AttributeConverter extends AttributeConverterBase {
  public toStringAttr(val: Vector3): string {
    return val.toString();
  }

  public toObjectAttr(attr: string): Vector3 {
    return Vector3.parse(attr);
  }

  public GetAnimater(attr: GomlAttribute, beginVal: any, endVal: any, beginTime: number, duration: number, easing: EasingFunctionBase, onComplete?: Delegates.Action0): AnimaterBase {
    return new Vector3Animater(attr, beginTime, duration, beginVal, endVal, easing, onComplete);
  }
}

export = Vector3AttributeConverter;
