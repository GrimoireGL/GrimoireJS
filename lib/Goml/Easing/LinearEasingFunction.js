import EasingFunctionBase from "./EasingFunctionBase";
class LinearEasingFunction extends EasingFunctionBase {
    ease(begin, end, progress) {
        return begin + (end - begin) * progress;
    }
}
export default LinearEasingFunction;
