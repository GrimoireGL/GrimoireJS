import BasicMaterial from "../../../Core/Materials/Base/BasicMaterial";
import Vector4 from "../../../Math/Vector4";
/**
 * the materials for PMX.
 */
class PMXHitAreaMaterial extends BasicMaterial {
    constructor(material) {
        super(require("../../Materials/HitAreaTest.html"));
        this.__associatedMaterial = material;
    }
    /**
     * Count of verticies
     */
    get VerticiesCount() {
        return this.__associatedMaterial.VerticiesCount;
    }
    /**
     * Offset of verticies in index buffer
     */
    get VerticiesOffset() {
        return this.__associatedMaterial.VerticiesOffset;
    }
    apply(matArg) {
        const r = 0xFF00 & matArg.renderStage.___objectIndex;
        const g = 0x00FF & matArg.renderStage.___objectIndex;
        const b = 0xFF & this.__associatedMaterial.materialIndex;
        const skeleton = this.__associatedMaterial.ParentModel.skeleton;
        this.materialVariables = {
            boneCount: skeleton.BoneCount,
            boneMatriciesTexture: skeleton.MatrixTexture,
            indexColor: new Vector4(r / 0xFF, g / 0xFF, b / 0xFF, 1)
        };
        super.apply(matArg);
    }
    getDrawGeometryLength(geo) {
        return this.__associatedMaterial.Diffuse.A > 0 ? this.VerticiesCount : 0;
    }
    getDrawGeometryOffset(geo) {
        return this.VerticiesOffset * 4;
    }
}
export default PMXHitAreaMaterial;
