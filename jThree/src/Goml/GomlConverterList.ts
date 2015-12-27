declare function require(string): any;
/**
 * List for constructor functions of converter classes.
 * Converters manage how an attribute will be parsed, converted into string, or animated.
 */
var converterList = {
  "angle": require('./Converter/AngleAttributeConverter'),
  "float": require('./Converter/NumberAttributeConverter'),
  "int": require('./Converter/IntegerAttributeConverter'),
  "vec3": require('./Converter/Vector3AttributeConverter'),
  "rotation": require('./Converter/RotationAttributeConverter'),
  "color4": require('./Converter/Color4AttributeConverter'),
  "color3": require('./Converter/Color3AttributeConverter'),
  "boolean": require('./Converter/BooleanAttributeConverter'),
  "string": require('./Converter/StringAttributeConverter')
};
export = converterList;
