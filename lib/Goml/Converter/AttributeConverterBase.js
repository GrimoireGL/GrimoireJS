import JThreeObject from "../../Base/JThreeObject";
import { AbstractClassMethodCalledException } from "../../Exceptions";
class AttributeConverterBase extends JThreeObject {
    toStringAttr(val) {
        throw new AbstractClassMethodCalledException();
    }
    toObjectAttr(attr) {
        throw new AbstractClassMethodCalledException();
    }
    getAnimater(attr, beginVal, endVal, beginTime, duration, easing, onComplete) {
        throw new AbstractClassMethodCalledException();
    }
}
export default AttributeConverterBase;
