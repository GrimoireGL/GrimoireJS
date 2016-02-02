import ContextComponents from "../../ContextComponents";
import ResourceManager from "../../Core/ResourceManager";
import JThreeContext from "../../JThreeContext";
import Geometry from "../../Core/Geometries/Base/Geometry";
import IXMaterialData from "../IXMaterialData";
import BasicMaterial from "../../Core/Materials/Base/BasicMaterial";
class XMaterial extends BasicMaterial {
  constructor(private _material: IXMaterialData) {
    super(require("../Material/Forward.html"));
    this.materialVariables = {
      faceColor: this._material.faceColor,
      power: this._material.power,
      specularColor: this._material.specularColor,
      emissiveColor: this._material.emissiveColor
    };
    const rm = JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
    if (_material.texture) {
      rm.loadTexture(_material.texture).then(texture => {
        texture.MagFilter = WebGLRenderingContext.LINEAR;
        this.materialVariables["texture"] = texture;
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
