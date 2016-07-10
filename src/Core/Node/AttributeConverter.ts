abstract class AttributeConverter {
  public abstract toStringAttr(val: any): string;
  public abstract toObjectAttr(attr: string): any;
}

export default AttributeConverter;
