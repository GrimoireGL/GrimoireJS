declare function require(string):any ;

var easingFunction={
  "linear":require("./Easing/LinearEasingFunction"),
  "swing":require("./Easing/SwingEasingFunction")
};
export=easingFunction;
