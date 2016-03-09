import BasicMaterial from "../../../Core/Materials/Base/BasicMaterial";
import Material from "../../../Core/Materials/Material";
import Vector4 from "../../../Math/Vector4";
import PMXMaterialParamContainer from "./../PMXMaterialMorphParamContainer";
/**
 * the materials for PMX.
 */
class PMXGBufferMaterial extends Material {
    constructor(material) {
        super();
        this.__associatedMaterial = material;
        this.__primaryMaterial = new BasicMaterial(require("../../Materials/PrimaryBuffer.html"));
        this.__secoundaryMaterial = new BasicMaterial(require("../../Materials/SecoundaryBuffer.html"));
        this.__thirdMaterial = new BasicMaterial(require("../../Materials/ThirdBuffer.html"));
        this.__setLoaded();
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
        if (this.__associatedMaterial.Diffuse.A < 1.0E-3) {
            return;
        }
        const skeleton = this.__associatedMaterial.ParentModel.skeleton;
        switch (matArg.techniqueIndex) {
            case 0:
                this.__primaryMaterial.materialVariables = {
                    boneMatriciesTexture: skeleton.MatrixTexture,
                    brightness: this.__associatedMaterial.Specular.W,
                    boneCount: skeleton.BoneCount
                };
                this.__primaryMaterial.apply(matArg);
                break;
            case 1:
                this.__secoundaryMaterial.materialVariables = {
                    boneMatriciesTexture: skeleton.MatrixTexture,
                    boneCount: skeleton.BoneCount,
                    diffuse: PMXMaterialParamContainer.calcMorphedVectorValue(this.__associatedMaterial.Diffuse.toVector(), this.__associatedMaterial.addMorphParam, this.__associatedMaterial.mulMorphParam, (t) => t.diffuse, 4),
                    texture: this.__associatedMaterial.Texture,
                    sphere: this.__associatedMaterial.Sphere,
                    textureUsed: this.__associatedMaterial.Texture ? 1 : 0,
                    sphereMode: this.__associatedMaterial.Sphere ? this.__associatedMaterial.SphereMode : 0,
                    addTextureCoefficient: new Vector4(this.__associatedMaterial.addMorphParam.textureCoeff),
                    mulTextureCoefficient: new Vector4(this.__associatedMaterial.mulMorphParam.textureCoeff),
                    addSphereCoefficient: new Vector4(this.__associatedMaterial.addMorphParam.sphereCoeff),
                    mulSphereCoefficient: new Vector4(this.__associatedMaterial.mulMorphParam.sphereCoeff)
                };
                this.__secoundaryMaterial.apply(matArg);
                break;
            case 2:
                this.__thirdMaterial.materialVariables = {
                    boneMatriciesTexture: skeleton.MatrixTexture,
                    boneCount: skeleton.BoneCount,
                    specular: PMXMaterialParamContainer.calcMorphedVectorValue(this.__associatedMaterial.Specular, this.__associatedMaterial.addMorphParam, this.__associatedMaterial.mulMorphParam, (t) => t.specular, 3)
                };
                this.__thirdMaterial.apply(matArg);
                break;
        }
    }
    get Priorty() {
        return 100;
    }
    getDrawGeometryLength(geo) {
        return this.__associatedMaterial.Diffuse.A > 0 ? this.VerticiesCount : 0;
    }
    getDrawGeometryOffset(geo) {
        return this.VerticiesOffset * 4;
    }
    get MaterialGroup() {
        return "jthree.materials.gbuffer";
    }
}
export default PMXGBufferMaterial;
