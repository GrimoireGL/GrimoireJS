import AttributeConverterBase from "./AttributeConverterBase";

class StringAttributeConverter extends AttributeConverterBase {
  public toStringAttr(val: string): string {
    return val;
  }

  public toObjectAttr(attr: string): string {
    return attr;
  }
}

export default StringAttributeConverter;
