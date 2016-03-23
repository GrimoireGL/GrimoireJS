import isUndefined from "lodash.isundefined";
import isNumber from "lodash.isnumber";
import isString from "lodash.isstring";
import isFunction from "lodash.isfunction";
import isPlainObject from "lodash.isplainobject";
import objectAssign from "object-assign";
import IOption from "./IOption";
import IOptionUser from "./IOptionUser";

class EffectUtilities {
  public static toOption(argu0: any, argu1: any, argu2: any): IOption {
    let optionUser: IOptionUser = {};
    switch (true) {
      case isUndefined(argu0):
        break;
      case (isPlainObject(argu0) && isUndefined(argu1)):
        optionUser = argu0;
        break;
      case (isFunction(argu0) && isUndefined(argu1)):
        optionUser.complete = argu0;
        break;
      case (isNumber(argu0) || isString(argu0)):
        optionUser.duration = argu0;
        switch (true) {
          case isUndefined(argu1):
            // duration: number | string
            break;
          case isFunction(argu1) && isUndefined(argu2):
            // duration: number | string, complete: () => void
            optionUser.complete = argu1;
            break;
          case isString(argu1):
            optionUser.easing = argu1;
            switch (true) {
              case isUndefined(argu2):
                // duration: number | string, easing: string
                break;
              case isFunction(argu2):
                // duration: number | string, easing: string, complete: () => void
                optionUser.complete = argu2;
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
    const option: IOption = {
      duration: 400,
      easing: "swing",
      queue: true,
      queueName: "fx",
      step: (now, tween) => { return; },
      progress: (animation, progress, remainingMs) => { return; },
      complete: (node) => { return; },
      start: (animation) => { return; },
      done: (animation, jumpedToEnd) => { return; },
      fail: (animation, jumpedToEnd) => { return; },
      always: (animation, jumpToEnd) => { return; },
    };
    // check .duration type
    if (isString(optionUser.duration)) {
      const speed: {[key: string]: number} = {
        slow: 600,
        fast: 200,
        _default: 400,
      };
      if (speed[optionUser.duration]) {
        option.duration = speed[optionUser.duration];
      } else {
        option.duration = speed["default"];
      }
      delete optionUser.duration;
    }
    // check .queue type
    if (isString(optionUser.queue)) {
      option.queue = true;
      option.queueName = <string>optionUser.queue;
    } else if (optionUser.queue === true || optionUser.queue === false) {
      option.queue = <boolean>optionUser.queue;
      option.queueName = optionUser.queue ? "fx" : null;
    }
    delete optionUser.queue;
    // assign
    objectAssign(option, optionUser);
    return option;
  }
}

export default EffectUtilities;
