import Identity from "../Core/Identity";
import Namespace from "../Core/Namespace";
import { IStandardConverterDeclaration } from "../Interface/IAttributeConverterDeclaration";
import { __NAMESPACE__ } from "../metaInfo";
import { Name, Undef } from "../Tool/Types";

export const StringConverter = {
  name: Namespace.define(__NAMESPACE__).for("String"),
  /**
   * convert to string
   * @param val
   */
  convert(val: any): string | undefined {
    if (typeof val === "string") {
      return val;
    } else if (typeof val.toString === "function") {
      return val.toString();
    }
    return undefined;
  },
};
export default StringConverter;
