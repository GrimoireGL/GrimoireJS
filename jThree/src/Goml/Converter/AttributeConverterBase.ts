import JThreeObject = require("../../Base/JThreeObject");
import Exceptions = require("../../Exceptions");
import AnimaterBase = require("../Animater/AnimaterBase");
import GomlAttribute = require("../GomlAttribute");
import EasingFunctionBase = require("../Easing/EasingFunctionBase");
import Delegates = require("../../Base/Delegates");

class AttributeConverterBase extends JThreeObject {
  public toStringAttr(val: any): string {
    throw new Exceptions.AbstractClassMethodCalledException();
  }

  public toObjectAttr(attr: string): any {
    throw new Exceptions.AbstractClassMethodCalledException();
  }

  public GetAnimater(attr: GomlAttribute, beginVal: any, endVal: any, beginTime: number, duration: number, easing: EasingFunctionBase, onComplete?: Delegates.Action0): AnimaterBase {
    throw new Exceptions.AbstractClassMethodCalledException();
  }
}

export = AttributeConverterBase;
