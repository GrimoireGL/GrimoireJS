import { Undef } from "../Tool/Types";
import Utility from "../Tool/Utility";

export default {
  name: "Number",
  /**
   * converter for number value.
   * number,string,null will be converted.
   * Array<number> also convertable only if length equivalent to 1.
   * @param  {any}    val [description]
   * @return {number}     [description]
   */
  convert(val: any): Undef<number> {
    if (typeof val === "number") {
      return val;
    }
    if (typeof val === "string") {
      const parsed = Number.parseFloat(val);
      return Number.isNaN(parsed) ? undefined : parsed;
    }
    if (val === null) {
      return null;
    }
    if (Array.isArray(val) && val.length === 1) {
      Utility.w("[Deprecated] converting from Array is deprecated in NumberConverter.");
      const ret = val[0];
      if (typeof ret === "number") {
        return ret;
      }
    }
    return undefined;
  },
};
