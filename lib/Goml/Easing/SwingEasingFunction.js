import EasingFunctionBase from "./EasingFunctionBase";
class SwingEasingFunction extends EasingFunctionBase {
    ease(begin, end, progress) {
        return begin + (end - begin) * (0.5 - Math.cos(progress * Math.PI) / 2);
    }
}
export default SwingEasingFunction;
