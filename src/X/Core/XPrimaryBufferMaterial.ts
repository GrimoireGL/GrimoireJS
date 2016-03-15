import Geometry from "../../Core/Geometries/Base/Geometry";
import IXMaterialData from "../IXMaterialData";
import BasicMaterial from "../../Core/Materials/BasicMaterial";
class XPrimaryMaterial extends BasicMaterial {
  constructor(private _material: IXMaterialData) {
    super(require("../Material/Primary.html"));
    this.materialVariables = {
      power: _material.power
    };
  }

  public getDrawGeometryLength(geo: Geometry): number {
    return this._material.faceColor.W > 0 ? this._material.indexCount : 0;
  }

  public getDrawGeometryOffset(geo: Geometry): number {
    return this._material.indexOffset * 4;
  }
}
export default XPrimaryMaterial;
