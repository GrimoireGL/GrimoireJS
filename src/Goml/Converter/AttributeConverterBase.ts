import JThreeObject from "../../Base/JThreeObject";
import {AbstractClassMethodCalledException} from "../../Exceptions";
import AnimaterBase from "../Animater/AnimaterBase";
import GomlAttribute from "../GomlAttribute";
import EasingFunctionBase from "../Easing/EasingFunctionBase";
import {Action0} from "../../Base/Delegates";

class AttributeConverterBase extends JThreeObject {
  public toStringAttr(val: any): string {
    throw new AbstractClassMethodCalledException();
  }

  public toObjectAttr(attr: string): any {
    throw new AbstractClassMethodCalledException();
  }

  public getAnimater(attr: GomlAttribute, beginVal: any, endVal: any, beginTime: number, duration: number, easing: EasingFunctionBase, onComplete?: Action0): AnimaterBase {
    throw new AbstractClassMethodCalledException();
  }
}

export default AttributeConverterBase;
