import ResourceManager from "../../Core/ResourceManager";
import Geometry from "../../Core/Geometries/Base/Geometry";
import IXMaterialData from "../IXMaterialData";
import BasicMaterial from "../../Core/Materials/BasicMaterial";
class XMaterial extends BasicMaterial {
  constructor(private _material: IXMaterialData) {
    super(require("../Material/Forward.xmml"), "x.forward");
    this.shaderVariables = {
      faceColor: this._material.faceColor,
      power: this._material.power,
      specularColor: this._material.specularColor,
      emissiveColor: this._material.emissiveColor
    };
    if (_material.texture) {
      ResourceManager.loadTexture(_material.texture).then(texture => {
        texture.MagFilter = WebGLRenderingContext.LINEAR;
        this.shaderVariables["texture"] = texture;
      });
    }
  }

  public getDrawGeometryLength(geo: Geometry): number {
    return this._material.faceColor.W > 0 ? this._material.indexCount : 0;
  }

  public getDrawGeometryOffset(geo: Geometry): number {
    return this._material.indexOffset * 4;
  }
}
export default XMaterial;
