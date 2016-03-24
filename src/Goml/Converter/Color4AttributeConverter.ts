import AttributeConverterBase from "./AttributeConverterBase";
import Color4 from "../../Math/Color4";

class Color4AttributeConverter extends AttributeConverterBase {
  public name: string = "color4";

  public toStringAttr(val: any): string {
    return val.toString();
  }

  public toObjectAttr(attr: any): Color4 {
    return attr instanceof Color4 ? attr : Color4.parse(attr);
  }
}

export default Color4AttributeConverter;
