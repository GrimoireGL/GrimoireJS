/**
 * Easing function classes constructors is listed below.
 * If you extend this hash, the user can use new easing functions.
 * Each easing function class must extends EasingFunctionBase class.
 */

import LinearEasingFunction from "./LinearEasingFunction";
import SwingEasingFunction from "./SwingEasingFunction";

const easingFunction = {
  "linear": LinearEasingFunction,
  "swing": SwingEasingFunction,
};

export default easingFunction;
