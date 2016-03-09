/**
 * List for constructor functions of converter classes.
 * Converters manage how an attribute will be parsed, converted into string, or animated.
 */
import AngleAttributeConverter from "./Converter/AngleAttributeConverter";
import NumberAttributeConverter from "./Converter/NumberAttributeConverter";
import IntegerAttributeConverter from "./Converter/IntegerAttributeConverter";
import Vector3AttributeConverter from "./Converter/Vector3AttributeConverter";
import RotationAttributeConverter from "./Converter/RotationAttributeConverter";
import Color4AttributeConverter from "./Converter/Color4AttributeConverter";
import Color3AttributeConverter from "./Converter/Color3AttributeConverter";
import BooleanAttributeConverter from "./Converter/BooleanAttributeConverter";
import StringAttributeConverter from "./Converter/StringAttributeConverter";
const converterList = {
    "angle": AngleAttributeConverter,
    "float": NumberAttributeConverter,
    "int": IntegerAttributeConverter,
    "vec3": Vector3AttributeConverter,
    "rotation": RotationAttributeConverter,
    "color4": Color4AttributeConverter,
    "color3": Color3AttributeConverter,
    "boolean": BooleanAttributeConverter,
    "string": StringAttributeConverter,
};
export default converterList;
