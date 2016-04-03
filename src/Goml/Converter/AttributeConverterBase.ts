import JThreeObject from "../../Base/JThreeObject";

abstract class AttributeConverterBase extends JThreeObject {
  public name: string = null;

  public abstract toStringAttr(val: any): string;

  public abstract toObjectAttr(attr: any): any;
}

export default AttributeConverterBase;
