import AttributeConverterBase = require("./AttributeConverterBase");
import Exceptions = require("../../Exceptions");
import GomlAttribute = require("../GomlAttribute");
import Delegates = require("../../Base/Delegates");
import EasingFunctionBase = require("../Easing/EasingFunctionBase");
import AnimaterBase = require("../Animater/AnimaterBase");
import Color4 = require("../../Math/Color4");
import Color4Animater = require("../Animater/Color4Animater");

class Color4AttributeConverter extends AttributeConverterBase {
  public toStringAttr(val: Color4): string {
    return val.toString();
  }

  public toObjectAttr(attr: string): Color4 {
    return Color4.parse(attr);
  }

  public GetAnimater(attr: GomlAttribute, beginVal: any, endVal: any, beginTime: number, duration: number, easing: EasingFunctionBase, onComplete?: Delegates.Action0): AnimaterBase {
    return new Color4Animater(attr, beginTime, duration, beginVal, endVal, easing, onComplete);
  }
}

export = Color4AttributeConverter;
