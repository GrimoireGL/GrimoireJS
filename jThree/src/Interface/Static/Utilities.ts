import isArray = require("lodash.isarray");
import J3Object = require("../J3Object");

const BreakException = {};

class Utilities {
  public static each(array: any[], callback: (indexInArray: number, value: any) => boolean): any;
  public static each(array: any[], callback: (indexInArray: number, value: any) => void): any;
  public static each(object: any, callback: (propertyName: string, valueOfProperty: any) => boolean): any;
  public static each(object: any, callback: (propertyName: string, valueOfProperty: any) => void): any;
  public static each(argu0: any, callback: (argu1: any, argu2: any) => any): any {
    try {
      if (isArray(argu0) || argu0 instanceof J3Object) { // TODO pnly: check array like object
        Array.prototype.forEach.call(argu0, (value: any, indexInArray: number) => {
          const ret = callback.bind(value)(indexInArray, value);
          if (ret === false) {
            throw BreakException;
          }
        });
      } else {
        Object.keys(argu0).forEach((propertyName: string, index: number) => {
          const valueOfProperty = argu0[propertyName];
          const ret = callback.bind(valueOfProperty)(propertyName, valueOfProperty);
          if (ret === false) {
            throw BreakException;
          }
        });
      }
    } catch (e) {
      if (e !== BreakException) {
        throw e;
      }
    }
    return argu0;
  }
}

export = Utilities;
