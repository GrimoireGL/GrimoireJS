import AttributeConverterBase = require("./AttributeConverterBase");

class BooleanAttributeConverter extends AttributeConverterBase {
  public toStringAttr(val: boolean): string {
    return val.toString();
  }

  public toObjectAttr(attr: string): any {
    return attr === "true";
  }
}

export = BooleanAttributeConverter;
