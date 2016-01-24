import Vector4 = require("../Math/Vector4");
import Color4 = require("../Math/Color4");
import Vector3 = require("../Math/Vector3");
import Color3 = require("../Math/Color3");
import VectorBase = require("../Math/VectorBase");

class VectorColorCombinedParser {
  public static parseTuple3(source: string): VectorBase {
    const asColor = Color3.parse(source);
    if (typeof asColor !== "undefined") {
      return asColor;
    }
    return Vector3.parse(source);
  }

  public static parseTuple4(source: string): VectorBase {
    const asColor = Color4.parse(source);
    if (typeof asColor !== "undefined") {
      return asColor;
    }
    return Vector4.parse(source);
  }
}

export = VectorColorCombinedParser;
