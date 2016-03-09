import AttributeConverterBase from "./AttributeConverterBase";
class BooleanAttributeConverter extends AttributeConverterBase {
    toStringAttr(val) {
        return val.toString();
    }
    toObjectAttr(attr) {
        return attr === "true";
    }
}
export default BooleanAttributeConverter;
