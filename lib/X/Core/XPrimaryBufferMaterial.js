import BasicMaterial from "../../Core/Materials/Base/BasicMaterial";
class XPrimaryMaterial extends BasicMaterial {
    constructor(_material) {
        super(require("../Material/Primary.html"));
        this._material = _material;
        this.materialVariables = {
            power: _material.power
        };
    }
    getDrawGeometryLength(geo) {
        return this._material.faceColor.W > 0 ? this._material.indexCount : 0;
    }
    getDrawGeometryOffset(geo) {
        return this._material.indexOffset * 4;
    }
}
export default XPrimaryMaterial;
