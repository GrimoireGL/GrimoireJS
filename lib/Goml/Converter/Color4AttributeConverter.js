import AttributeConverterBase from "./AttributeConverterBase";
import Color4 from "../../Math/Color4";
import Color4Animater from "../Animater/Color4Animater";
class Color4AttributeConverter extends AttributeConverterBase {
    toStringAttr(val) {
        return val.toString();
    }
    toObjectAttr(attr) {
        return Color4.parse(attr);
    }
    getAnimater(attr, beginVal, endVal, beginTime, duration, easing, onComplete) {
        return new Color4Animater(attr, beginTime, duration, beginVal, endVal, easing, onComplete);
    }
}
export default Color4AttributeConverter;
