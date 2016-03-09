import AnimagterBase from "./AnimaterBase";
import Color3 from "../../Math/Color3";
class Color3Animater extends AnimagterBase {
    __updateAnimation(progress) {
        const b = this.__beginValue;
        const e = this.__endValue;
        const ef = this.__easingFunction.ease;
        this.__targetAttribute.Value = new Color3(ef(b.R, e.R, progress), ef(b.G, e.G, progress), ef(b.B, e.B, progress));
    }
}
export default Color3Animater;
