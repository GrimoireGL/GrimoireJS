import AttributeConverterBase from "./AttributeConverterBase";
import Color3 from "../../Math/Color3";

class Color3AttributeConverter extends AttributeConverterBase {
  public name: string = "color3";

  public toStringAttr(val: any): string {
    return val.toString();
  }

  public toObjectAttr(attr: any): Color3 {
    return attr instanceof Color3 ? attr : Color3.parse(attr);
  }
}

export default Color3AttributeConverter;
