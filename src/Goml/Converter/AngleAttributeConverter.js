import { InvalidArgumentException } from "../../Exceptions";
import AttributeParser from "../AttributeParser";
import AttributeConverterBase from "./AttributeConverterBase";
class AngleAttributeConverter extends AttributeConverterBase {
    toStringAttr(val) {
        return val.toString();
    }
    toObjectAttr(attr) {
        return AttributeParser.parseAngle(attr);
    }
    fromInterface(val) {
        if (typeof val === "string") {
            return this.toObjectAttr(val);
        }
        else if (typeof val === "number") {
            return val;
        }
        throw new InvalidArgumentException("val can't parse");
    }
}
export default AngleAttributeConverter;
//# sourceMappingURL=AngleAttributeConverter.js.map