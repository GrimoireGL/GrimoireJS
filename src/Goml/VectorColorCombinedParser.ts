import Vector4 from "../Math/Vector4";
import Color4 from "../Math/Color4";
import Vector3 from "../Math/Vector3";
import Color3 from "../Math/Color3";
import VectorBase from "../Math/VectorBase";

class VectorColorCombinedParser {
  public static parseTuple3(source: string): VectorBase {
    const asColor = Color3.parse(source, true);
    if (typeof asColor !== "undefined") {
      return asColor;
    }
    return Vector3.parse(source);
  }

  public static parseTuple4(source: string): VectorBase {
    const asColor = Color4.parse(source, true);
    if (typeof asColor !== "undefined") {
      return asColor;
    }
    return Vector4.parse(source);
  }
}

export default VectorColorCombinedParser;
