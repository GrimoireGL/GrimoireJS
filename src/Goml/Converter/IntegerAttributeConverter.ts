import AttributeConverterBase from "./AttributeConverterBase";

class IntegerAttributeConverter extends AttributeConverterBase {
  public name: string = "int";

  public toStringAttr(val: any): string {
    return val.toString();
  }

  public toObjectAttr(attr: any): number {
    return parseInt(attr, 10);
  }
}

export default IntegerAttributeConverter;
