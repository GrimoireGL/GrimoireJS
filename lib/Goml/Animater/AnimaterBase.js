import JThreeObjectWithID from "../../Base/JThreeObjectWithID";
class AnimaterBase extends JThreeObjectWithID {
    constructor(targetAttribute, begintime, duration, beginValue, endValue, easing, onComplete) {
        super();
        this.__targetAttribute = targetAttribute;
        this.__beginTime = begintime;
        this.__duration = duration;
        this.__onComplete = onComplete;
        this.__easingFunction = easing;
        this.__beginValue = this.__targetAttribute.Converter.toObjectAttr(beginValue);
        this.__endValue = this.__targetAttribute.Converter.toObjectAttr(endValue);
    }
    /**
    * Upate
    */
    update(time) {
        let progress = (time - this.__beginTime) / this.__duration;
        const isFinish = progress >= 1;
        progress = Math.min(Math.max(progress, 0), 1); // clamp [0,1]
        this.__updateAnimation(progress);
        if (isFinish && typeof this.__onComplete === "function") {
            this.__onComplete();
        }
        return isFinish;
    }
    /**
     * This methods should be overridden.
     * @param {number} progress [description]
     */
    __updateAnimation(progress) {
        return;
    }
}
export default AnimaterBase;
