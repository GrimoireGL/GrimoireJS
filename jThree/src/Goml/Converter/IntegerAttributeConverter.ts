import AttributeConverterBase = require("./AttributeConverterBase");
import IntegerAnimater = require("../Animater/IntegerAnimater");
import GomlAttribute = require("../GomlAttribute");
import EasingFunctionBase = require("../Easing/EasingFunctionBase");
import Delegates = require("../../Base/Delegates");
import AnimaterBase = require("../Animater/AnimaterBase");

class IntegerAttributeConverter extends AttributeConverterBase {
  public toStringAttr(val: number): string {
    return val.toString();
  }

  public toObjectAttr(attr: string): number {
    return parseInt(attr);
  }

  public GetAnimater(attr: GomlAttribute, beginVal: any, endVal: any, beginTime: number, duration: number, easing: EasingFunctionBase, onComplete?: Delegates.Action0): AnimaterBase {
    return new IntegerAnimater(attr, beginTime, duration, beginVal, endVal, easing, onComplete);
  }
}

export = IntegerAttributeConverter;
