import GomlNodeListElement = require("./GomlNodeListElement");

declare function require(string):any ;

var converterList={
  "angle":require('./Converter/AngleAttributeConverter'),
  "number":require('./Converter/NumberAttributeConverter'),
  "vector3":require('./Converter/Vector3AttributeConverter'),
  "rotation":require('./Converter/RotationAttributeConverter')
};
export=converterList;
