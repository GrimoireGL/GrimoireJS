import AnimagterBase from "./AnimaterBase";
import Quaternion from "../../Math/Quaternion";
class RotationAnimater extends AnimagterBase {
    __updateAnimation(progress) {
        const b = this.__beginValue;
        const e = this.__endValue;
        const ef = this.__easingFunction.ease;
        this.__targetAttribute.Value = Quaternion.slerp(b, e, ef(0, 1, progress));
    }
}
export default RotationAnimater;
