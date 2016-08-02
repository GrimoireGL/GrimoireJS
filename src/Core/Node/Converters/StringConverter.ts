import NamespacedIdentity from "../../Base/NamespacedIdentity";
import AttributeConverter from "../AttributeConverter";

class StringConverter implements AttributeConverter {
    public name: NamespacedIdentity = new NamespacedIdentity("StringConverter");

    public convert(obj: any): any {
        if (typeof obj === "string") {
            return obj;
        } else {
            if (obj.toString) {
                return obj.toString();
            } else {
                throw new Error("The provided argument is not campatible with casting into string");
            }
        }
    }
}

export default StringConverter;
