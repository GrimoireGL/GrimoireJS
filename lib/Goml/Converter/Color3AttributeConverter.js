import AttributeConverterBase from "./AttributeConverterBase";
import Color3 from "../../Math/Color3";
import Color3Animater from "../Animater/Color3Animater";
class Color3AttributeConverter extends AttributeConverterBase {
    toStringAttr(val) {
        return val.toString();
    }
    toObjectAttr(attr) {
        return Color3.parse(attr);
    }
    getAnimater(attr, beginVal, endVal, beginTime, duration, easing, onComplete) {
        return new Color3Animater(attr, beginTime, duration, beginVal, endVal, easing, onComplete);
    }
}
export default Color3AttributeConverter;
