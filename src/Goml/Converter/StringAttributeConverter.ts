import AttributeConverterBase from "./AttributeConverterBase";

class StringAttributeConverter extends AttributeConverterBase {
  public toStringAttr(val: any): string {
    return String(val);
  }

  public toObjectAttr(attr: any): string {
    return String(attr);
  }
}

export default StringAttributeConverter;
