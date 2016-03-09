import JThreeObject from "../../Base/JThreeObject";
import AttributeParser from "../AttributeParser";
import RotationAnimater from "../Animater/RotationAnimater";
class RotationAttributeConverter extends JThreeObject {
    toStringAttr(val) {
        return val.toAngleAxisString();
    }
    toObjectAttr(attr) {
        return AttributeParser.parseRotation3D(attr);
    }
    getAnimater(attr, beginVal, endVal, beginTime, duration, easing, onComplete) {
        return new RotationAnimater(attr, beginTime, duration, beginVal, endVal, easing, onComplete);
    }
}
export default RotationAttributeConverter;
