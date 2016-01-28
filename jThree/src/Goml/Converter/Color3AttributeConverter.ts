import AttributeConverterBase = require("./AttributeConverterBase");
import GomlAttribute = require("../GomlAttribute");
import Delegates = require("../../Base/Delegates");
import EasingFunctionBase = require("../Easing/EasingFunctionBase");
import AnimaterBase = require("../Animater/AnimaterBase");
import Color3 = require("../../Math/Color3");
import Color3Animater = require("../Animater/Color3Animater");

class Color3AttributeConverter extends AttributeConverterBase {
  public toStringAttr(val: Color3): string {
    return val.toString();
  }

  public toObjectAttr(attr: string): Color3 {
    return Color3.parse(attr);
  }

  public GetAnimater(attr: GomlAttribute, beginVal: any, endVal: any, beginTime: number, duration: number, easing: EasingFunctionBase, onComplete?: Delegates.Action0): AnimaterBase {
    return new Color3Animater(attr, beginTime, duration, beginVal, endVal, easing, onComplete);
  }
}

export = Color3AttributeConverter;
