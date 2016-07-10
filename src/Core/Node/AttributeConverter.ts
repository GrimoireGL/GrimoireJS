import IDObject from "../Base/IDObject";

abstract class AttributeConverter extends IDObject {
  public abstract toStringAttr(val: any): string;
  public abstract toObjectAttr(attr: string): any;
}

export default AttributeConverter;
