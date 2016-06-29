import IDObject from "../../Base/IDObject";

abstract class AttributeConverterBase extends IDObject {
  public name: string = null;

  public abstract toStringAttr(val: any): string;

  public abstract toObjectAttr(attr: any): any;
}

export default AttributeConverterBase;
