import Identity from "../Core/Identity";
import Namespace from "../Core/Namespace";
import { __NAMESPACE__ } from "../metaInfo";
import { Undef } from "../Tools/Types";

export default {
  name: Namespace.define(__NAMESPACE__).for("Boolean"),

  /**
   * converter for booleam value.
   * Pass through boolean value as it is.
   * Pass through string value only 'true' or 'false'.
   * @param  {any}       val  [description]
   * @param  {Attribute} attr [description]
   * @return {any}            [description]
   */
  convert(val: any): Undef<boolean> {
    if (typeof val === "boolean") {
      return val;
    } else if (typeof val === "string") {
      switch (val) {
        case "true":
          return true;
        case "false":
          return false;
      }
    }
    return undefined;
  },
};
