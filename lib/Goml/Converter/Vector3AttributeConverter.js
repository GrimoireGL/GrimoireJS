import AttributeConverterBase from "./AttributeConverterBase";
import Vector3 from "../../Math/Vector3";
import Vector3Animater from "../Animater/Vector3Animater";
class Vector3AttributeConverter extends AttributeConverterBase {
    toStringAttr(val) {
        return val.toString();
    }
    toObjectAttr(attr) {
        return Vector3.parse(attr);
    }
    getAnimater(attr, beginVal, endVal, beginTime, duration, easing, onComplete) {
        return new Vector3Animater(attr, beginTime, duration, beginVal, endVal, easing, onComplete);
    }
}
export default Vector3AttributeConverter;
