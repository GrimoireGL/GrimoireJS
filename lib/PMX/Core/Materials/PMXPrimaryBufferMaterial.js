import BasicMaterial from "../../../Core/Materials/Base/BasicMaterial";
class PMXPrimaryBufferMaterial extends BasicMaterial {
    constructor(material) {
        super(require("../../Materials/PrimaryBuffer.html"));
        this._associatedMaterial = material;
    }
    apply(matArg) {
        if (this._associatedMaterial.Diffuse.A < 1.0E-3) {
            return;
        }
        const skeleton = this._associatedMaterial.ParentModel.skeleton;
        this.materialVariables = {
            boneMatriciesTexture: skeleton.MatrixTexture,
            brightness: this._associatedMaterial.Specular.W,
            boneCount: skeleton.BoneCount
        };
        super.apply(matArg);
    }
    /**
     * Count of verticies
     */
    get VerticiesCount() {
        return this._associatedMaterial.VerticiesCount;
    }
    /**
     * Offset of verticies in index buffer
     */
    get VerticiesOffset() {
        return this._associatedMaterial.VerticiesOffset;
    }
    getDrawGeometryLength(geo) {
        return this._associatedMaterial.Diffuse.A > 0 ? this.VerticiesCount : 0;
    }
    getDrawGeometryOffset(geo) {
        return this.VerticiesOffset * 4;
    }
}
export default PMXPrimaryBufferMaterial;
