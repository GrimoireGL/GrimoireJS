import isUndefined from "lodash.isundefined";
import isNumber from "lodash.isnumber";
import isString from "lodash.isstring";
import isFunction from "lodash.isfunction";
import isPlainObject from "lodash.isplainobject";
import IOption from "./IOption";

class EffectArgumentFormatter {
  public static toOption(argu0: any, argu1: any, argu2: any): IOption {
    let option: IOption = {
      duration: 400,
      easing: "swing",
      queue: true,
      complete: () => { return; },
    };
    switch (true) {
      case isUndefined(argu0):
        break;
      case (isPlainObject(argu0) && isUndefined(argu1)):
        option = argu0;
        break;
      case (isFunction(argu0) && isUndefined(argu1)):
        option.complete = argu0;
        break;
      case (isNumber(argu0) || isString(argu0)):
        option.duration = argu0;
        switch (true) {
          case isUndefined(argu1):
            // duration: number
            break;
          case isFunction(argu1) && isUndefined(argu2):
            // duration: string, complete: () => void
            option.complete = argu1;
            break;
          case isString(argu1):
            option.easing = argu1;
            switch (true) {
              case isUndefined(argu2):
                // duration: string, easing: string
                break;
              case isFunction(argu2):
                // duration: string, easing: string, complete: () => void
                option.complete = argu2;
                break;
              default:
                throw new Error("Argument type is not correct");
            }
            break;
          default:
            throw new Error("Argument type is not correct");
        }
        break;
      default:
        throw new Error("Argument type is not correct");
    }
    return option;
  }
}

export default EffectArgumentFormatter;
