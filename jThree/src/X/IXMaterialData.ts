import Vector3 = require("../Math/Vector3");
import Vector4 = require("../Math/Vector4");
interface IXMaterialData {
  faceColor: Vector4;
  power: number;
  specularColor: Vector3;
  emissiveColor: Vector3;
  indexCount: number;
  indexOffset: number;
  texture?: string;
}
export = IXMaterialData;
