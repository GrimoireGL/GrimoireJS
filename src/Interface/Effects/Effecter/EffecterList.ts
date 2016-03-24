import Color3Effecter from "./Color3Effecter";
import Color4Effecter from "./Color4Effecter";
import IntegerEffecter from "./IntegerEffecter";
import NumberEffecter from "./NumberEffecter";
import RotationEffecter from "./RotationEffecter";
import Vector3Effecter from "./Vector3Effecter";

const effecter = {
  // "angle": AngleEffecter,
  "float": NumberEffecter,
  "int": IntegerEffecter,
  "vec3": Vector3Effecter,
  "rotation": RotationEffecter,
  "color4": Color4Effecter,
  "color3": Color3Effecter,
  // "boolean": BooleanEffecter,
  // "string": StringEffecter,
};

export default effecter;
