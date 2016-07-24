import NamespacedIdentity from "../../Base/NamespacedIdentity";
import AttributeConverter from "../AttributeConverter";

class StringConverter implements AttributeConverter {
  public name: NamespacedIdentity = new NamespacedIdentity("StringConverter");

  public convert(obj: any): any {
    if (typeof obj === "string") {
      return obj.toString();
    }
  }
}

export default StringConverter;
