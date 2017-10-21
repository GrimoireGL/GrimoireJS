import Identity from "../Core/Identity";
import Namespace from "../Core/Namespace";
import { __NAMESPACE__ } from "../metaInfo";
import { Undef } from "../Tools/Types";

export default {
  name: Namespace.define(__NAMESPACE__).for("String") as Identity,
  /**
   * convert to string
   * @param val
   */
  convert(val: any): Undef<string> {
    if (typeof val === "string") {
      return val;
    } else if (!val) {
      return val;
    } else if (typeof val.toString === "function") {
      return val.toString();
    }
    return undefined;
  },
};
