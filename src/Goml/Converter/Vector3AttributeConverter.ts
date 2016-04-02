import AttributeConverterBase from "./AttributeConverterBase";
import Vector3 from "../../Math/Vector3";

class Vector3AttributeConverter extends AttributeConverterBase {
  public toStringAttr(val: any): string {
    return val.toString();
  }

  public toObjectAttr(attr: any): Vector3 {
    return attr instanceof Vector3 ? attr : Vector3.parse(attr);
  }
}

export default Vector3AttributeConverter;
