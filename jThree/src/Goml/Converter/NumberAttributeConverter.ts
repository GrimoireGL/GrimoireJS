import AttributeConverterBase = require("./AttributeConverterBase");
import Exceptions = require("../../Exceptions");
import GomlAttribute = require("../GomlAttribute");
import Delegates = require("../../Base/Delegates");
import EasingFunctionBase = require("../Easing/EasingFunctionBase");
import AnimaterBase = require("../Animater/AnimaterBase");
import NumberAnimater = require("../Animater/NumberAnimater");

class NumberAttributeConverter extends AttributeConverterBase {
  public toStringAttr(val: number): string {
    return val.toString();
  }

  public toObjectAttr(attr: string): number {
    return Number(attr);
  }

  public GetAnimater(attr: GomlAttribute, beginVal: any, endVal: any, beginTime: number, duration: number, easing: EasingFunctionBase, onComplete?: Delegates.Action0): AnimaterBase {
    return new NumberAnimater(attr, beginTime, duration, beginVal, endVal, easing, onComplete);
  }
}

export =NumberAttributeConverter;
