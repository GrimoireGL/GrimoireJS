import BasicMaterial from "../../../Core/Materials/Base/BasicMaterial";
/**
 * the materials for PMX.
 */
class PMXShadowMapMaterial extends BasicMaterial {
    constructor(material) {
        super(require("../../Materials/ShadowMap.html"));
        this.__associatedMaterial = material;
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
        // var light = matArg.scene.LightRegister.shadowDroppableLights[matArg.techniqueIndex];
        // const skeleton = this.associatedMaterial.ParentModel.skeleton;
        // this.materialVariables = {
        //    matL:light.matLightViewProjection,
        //    boneMatriciesTexture:skeleton.MatrixTexture,
        //    boneCount:skeleton.BoneCount
        // };
        super.apply(matArg);
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
}
export default PMXShadowMapMaterial;
