import AnimagterBase from "./AnimaterBase";
class NumberAnimater extends AnimagterBase {
    __updateAnimation(progress) {
        this.__targetAttribute.Value = this.__easingFunction.ease(this.__beginValue, this.__endValue, progress);
    }
}
export default NumberAnimater;
