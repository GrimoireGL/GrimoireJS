import GomlNodeListElement = require("./GomlNodeListElement");

declare function require(string):any ;

var converterList={
  "angle":require('./Converter/AngleAttributeConverter')
};
export=converterList;
