import AttributeConverterBase from "./AttributeConverterBase";

class NumberAttributeConverter extends AttributeConverterBase {
  public name: string = "float";

  public toStringAttr(val: any): string {
    return val.toString();
  }

  public toObjectAttr(attr: any): number {
    return Number(attr);
  }
}

export default NumberAttributeConverter;
