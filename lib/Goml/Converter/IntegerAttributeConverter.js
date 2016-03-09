import AttributeConverterBase from "./AttributeConverterBase";
import IntegerAnimater from "../Animater/IntegerAnimater";
class IntegerAttributeConverter extends AttributeConverterBase {
    toStringAttr(val) {
        return val.toString();
    }
    toObjectAttr(attr) {
        return parseInt(attr, 10);
    }
    getAnimater(attr, beginVal, endVal, beginTime, duration, easing, onComplete) {
        return new IntegerAnimater(attr, beginTime, duration, beginVal, endVal, easing, onComplete);
    }
}
export default IntegerAttributeConverter;
