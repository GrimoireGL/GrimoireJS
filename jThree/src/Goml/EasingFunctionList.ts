/**
 * Easing function classes constructors is listed below.
 * If you extend this hash, the user can use new easing functions.
 * Each easing function class must extends EasingFunctionBase class.
 */

const easingFunction = {
  "linear": require("./Easing/LinearEasingFunction"),
  "swing": require("./Easing/SwingEasingFunction")
};
export = easingFunction;
