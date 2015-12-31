/**
 * List for constructor functions of converter classes.
 * Converters manage how an attribute will be parsed, converted into string, or animated.
 */
var converterList = {
  "angle": require('./Converter/AngleAttributeConverter'),
  "number": require('./Converter/NumberAttributeConverter'),
  "vector3": require('./Converter/Vector3AttributeConverter'),
  "rotation": require('./Converter/RotationAttributeConverter'),
  "color4": require('./Converter/Color4AttributeConverter'),
  "color3": require('./Converter/Color3AttributeConverter'),
  "boolean": require('./Converter/BooleanAttributeConverter'),
  "integer": require('./Converter/IntegerAttributeConverter'),
  "string": require('./Converter/StringAttributeConverter')
};
export = converterList;
