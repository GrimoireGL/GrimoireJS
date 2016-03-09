import AnimagterBase from "./AnimaterBase";
class IntegerAnimater extends AnimagterBase {
    __updateAnimation(progress) {
        const b = this.__beginValue;
        const e = this.__endValue;
        const ef = this.__easingFunction.ease;
        const val = Math.floor(ef(b, e, progress));
        if (this.__targetAttribute.Value !== val) {
            this.__targetAttribute.Value = val;
        }
    }
}
export default IntegerAnimater;
