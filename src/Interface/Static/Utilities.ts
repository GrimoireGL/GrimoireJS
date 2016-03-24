import isArray from "lodash.isarray";
import J3Object from "../J3Object";
import J3ObjectBase from "../J3ObjectBase";
import GomlTreeNodeBase from "../../Goml/GomlTreeNodeBase";

const BreakException = {};

class Utilities {
  public static each<T>(array: T[], callback: (indexInArray: number, value: T) => boolean): T;
  public static each<T>(array: T[], callback: (indexInArray: number, value: T) => void): T;
  public static each(j3obj: J3ObjectBase, callback: (indexInArray: number, value: GomlTreeNodeBase) => void): J3ObjectBase;
  public static each<T>(object: {[propertyName: string]: T}, callback: (propertyName: string, valueOfProperty: T) => boolean): {[propertyName: string]: T};
  public static each<T>(object: {[propertyName: string]: T}, callback: (propertyName: string, valueOfProperty: T) => void): {[propertyName: string]: T};
  public static each<T>(argu0: any, callback: (argu1: any, argu2: any) => any): any {
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

export default Utilities;
