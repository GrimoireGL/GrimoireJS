import { InvalidArgumentException } from "../../Exceptions";
import AttributeParser from "../AttributeParser";
import AttributeConverterBase from "./AttributeConverterBase";
class AngleAttributeConverter extends AttributeConverterBase {
    toStringAttr(val) {
        return val.toString();
    }
    toObjectAttr(attr) {
        return AttributeParser.ParseAngle(attr);
    }
    fromInterface(val) {
        if (typeof val === "string") {
            return this.toObjectAttr(val);
        }
        else if (typeof val === "number") {
            return val;
        }
        // we should implememnt something here?
        throw new InvalidArgumentException("val can't parse");
    }
}
export default AngleAttributeConverter;
