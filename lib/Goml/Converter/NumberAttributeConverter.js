import AttributeConverterBase from "./AttributeConverterBase";
import NumberAnimater from "../Animater/NumberAnimater";
class NumberAttributeConverter extends AttributeConverterBase {
    toStringAttr(val) {
        return val.toString();
    }
    toObjectAttr(attr) {
        return Number(attr);
    }
    getAnimater(attr, beginVal, endVal, beginTime, duration, easing, onComplete) {
        return new NumberAnimater(attr, beginTime, duration, beginVal, endVal, easing, onComplete);
    }
}
export default NumberAttributeConverter;
