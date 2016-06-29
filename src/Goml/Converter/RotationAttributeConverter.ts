import IDObject from "../../Base/IDObject";
import AttributeParser from "../AttributeParser";
import Quaternion from "../../Math/Quaternion";

class RotationAttributeConverter extends IDObject {
  public name: string = "rotation";

  public toStringAttr(val: any): string {
    return val.toAngleAxisString();
  }

  public toObjectAttr(attr: any): Quaternion {
    return attr instanceof Quaternion ? attr : AttributeParser.parseRotation3D(attr);
  }
}

export default RotationAttributeConverter;
