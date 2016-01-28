/**
 * Easing function classes constructors is listed below.
 * If you extend this hash, the user can use new easing functions.
 * Each easing function class must extends EasingFunctionBase class.
 */

 import LinearEasingFunction from "./Easing/LinearEasingFunction";
 import SwingEasingFunction from "./Easing/SwingEasingFunction";

const easingFunction = {
  "linear": LinearEasingFunction,
  "swing": SwingEasingFunction,
};
export default easingFunction;
