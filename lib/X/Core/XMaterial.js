import ContextComponents from "../../ContextComponents";
import JThreeContext from "../../JThreeContext";
import BasicMaterial from "../../Core/Materials/Base/BasicMaterial";
class XMaterial extends BasicMaterial {
    constructor(_material) {
        super(require("../Material/Forward.html"));
        this._material = _material;
        this.materialVariables = {
            faceColor: this._material.faceColor,
            power: this._material.power,
            specularColor: this._material.specularColor,
            emissiveColor: this._material.emissiveColor
        };
        const rm = JThreeContext.getContextComponent(ContextComponents.ResourceManager);
        if (_material.texture) {
            rm.loadTexture(_material.texture).then(texture => {
                texture.MagFilter = WebGLRenderingContext.LINEAR;
                this.materialVariables["texture"] = texture;
            });
        }
    }
    getDrawGeometryLength(geo) {
        return this._material.faceColor.W > 0 ? this._material.indexCount : 0;
    }
    getDrawGeometryOffset(geo) {
        return this._material.indexOffset * 4;
    }
}
export default XMaterial;
