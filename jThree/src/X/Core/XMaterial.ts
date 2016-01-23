import ContextComponents = require("../../ContextComponents");
import ResourceManager = require("../../Core/ResourceManager");
import JThreeContext = require("../../JThreeContext");
import Geometry = require("../../Core/Geometries/Base/Geometry");
import IXMaterialData = require("../IXMaterialData");
import BasicMaterial = require("../../Core/Materials/Base/BasicMaterial");
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
export = XMaterial;
