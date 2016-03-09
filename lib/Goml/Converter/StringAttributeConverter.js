import AttributeConverterBase from "./AttributeConverterBase";
class StringAttributeConverter extends AttributeConverterBase {
    toStringAttr(val) {
        return val;
    }
    toObjectAttr(attr) {
        return attr;
    }
}
export default StringAttributeConverter;
