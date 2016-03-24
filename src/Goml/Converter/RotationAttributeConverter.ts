import JThreeObject from "../../Base/JThreeObject";
import AttributeParser from "../AttributeParser";
import Quaternion from "../../Math/Quaternion";

class RotationAttributeConverter extends JThreeObject {
  public name: string = "rotation";

  public toStringAttr(val: any): string {
    return val.toAngleAxisString();
  }

  public toObjectAttr(attr: any): Quaternion {
    return attr instanceof Quaternion ? attr : AttributeParser.parseRotation3D(attr);
  }
}

export default RotationAttributeConverter;
