import BasicMaterial from "../../../Core/Materials/Base/BasicMaterial";
import Material from "../../../Core/Materials/Material";
import Vector4 from "../../../Math/Vector4";
import Color4 from "../../../Math/Color4";
import Color3 from "../../../Math/Color3";
import PmxMaterialMorphParamContainer from "./../PMXMaterialMorphParamContainer";
import ContextComponents from "../../../ContextComponents";
import JThreeContext from "../../../JThreeContext";
/**
 * the materials for PMX.
 */
class PMXMaterial extends Material {
    constructor(pmx, index, offset) {
        super();
        this.edgeColor = null;
        this._sphere = null;
        this._texture = null;
        this._toon = null;
        this.addMorphParam = new PmxMaterialMorphParamContainer(1);
        this.mulMorphParam = new PmxMaterialMorphParamContainer(0);
        this._parentModel = pmx;
        this._pmxData = pmx.ModelData;
        this.materialIndex = index;
        let materialData = this._pmxData.Materials[index];
        this._verticiesCount = materialData.vertexCount;
        this._verticiesOffset = offset;
        this.name = materialData.materialName;
        this.cullEnabled = !((materialData.drawFlag & 0x01) > 0); // each side draw flag
        this._ambient = new Color3(materialData.ambient[0], materialData.ambient[1], materialData.ambient[2]);
        this._diffuse = new Color4(materialData.diffuse[0], materialData.diffuse[1], materialData.diffuse[2], materialData.diffuse[3]);
        if ((materialData.drawFlag & 0x10) > 0) {
            this.edgeColor = new Color4(materialData.edgeColor[0], materialData.edgeColor[1], materialData.edgeColor[2], materialData.edgeColor[3]);
        }
        this._specular = new Vector4(materialData.specular);
        this._edgeSize = materialData.edgeSize;
        this._sphereMode = materialData.sphereMode;
        this.__innerMaterial = new BasicMaterial(require("../../Materials/Forward.html"));
        const tm = this._parentModel.pmxTextureManager;
        tm.loadTexture(materialData.sphereTextureIndex).then((texture) => {
            this._sphere = texture;
        });
        tm.loadTexture(materialData.textureIndex).then((texture) => {
            this._texture = texture;
        });
        if (materialData.sharedToonFlag === 0) {
            tm.loadTexture(materialData.targetToonIndex).then((texture) => {
                this._toon = texture;
            });
        }
        else {
            this._toon = this._loadSharedTexture(materialData.targetToonIndex);
        }
        this.__innerMaterial.on("configure", (v) => {
            if (v.passIndex === 0) {
                v.configure.cullOrientation = this.cullEnabled ? "BACK" : "NONE";
            }
        });
        this.__innerMaterial.on("ready", () => {
            this.__setLoaded();
        });
    }
    /**
     * Count of verticies
     */
    get VerticiesCount() {
        return this._verticiesCount;
    }
    /**
     * Offset of verticies in index buffer
     */
    get VerticiesOffset() {
        return this._verticiesOffset;
    }
    get ParentModel() {
        return this._parentModel;
    }
    get Diffuse() {
        return this._diffuse;
    }
    get Texture() {
        return this._texture;
    }
    get Sphere() {
        return this._sphere;
    }
    get SphereMode() {
        return this._sphereMode;
    }
    get Specular() {
        return this._specular;
    }
    getPassCount(techniqueIndex) {
        return this.edgeColor == null ? 1 : 2;
    }
    get SelfShadow() {
        return (this._pmxData.Materials[this.materialIndex].drawFlag & 0x04) > 0;
    }
    apply(matArg) {
        const skeleton = this._parentModel.skeleton;
        if (matArg.passIndex === 1) {
            this.__innerMaterial.materialVariables = {
                boneCount: skeleton.BoneCount,
                boneMatriciesTexture: skeleton.MatrixTexture,
                edgeSize: PmxMaterialMorphParamContainer.calcMorphedSingleValue(this._edgeSize, this.addMorphParam, this.mulMorphParam, (t) => t.edgeSize),
                edgeColor: PmxMaterialMorphParamContainer.calcMorphedVectorValue(this.edgeColor.toVector(), this.addMorphParam, this.mulMorphParam, (t) => t.edgeColor, 4)
            };
        }
        else {
            this.__innerMaterial.materialVariables = {
                boneCount: skeleton.BoneCount,
                boneMatriciesTexture: skeleton.MatrixTexture,
                texture: this._texture,
                toon: this._toon,
                sphere: this._sphere,
                diffuse: this._diffuse.toVector(),
                specular: this._specular,
                ambient: this._ambient.toVector(),
                textureUsed: !this._texture ? 0 : 1,
                sphereMode: !this._sphere ? 0 : this._sphereMode,
                toonFlag: !this._toon ? 0 : 1,
                addTexCoeff: new Vector4(this.addMorphParam.textureCoeff),
                mulTexCoeff: new Vector4(this.mulMorphParam.textureCoeff),
                addSphereCoeff: new Vector4(this.addMorphParam.sphereCoeff),
                mulSphereCoeff: new Vector4(this.mulMorphParam.sphereCoeff),
                addToonCoeff: new Vector4(this.addMorphParam.toonCoeff),
                mulToonCoeff: new Vector4(this.mulMorphParam.toonCoeff),
                ambientCoefficient: matArg.scene.sceneAmbient.toVector()
            };
        }
        this.__innerMaterial.apply(matArg);
    }
    get Priorty() {
        return 100 + this.materialIndex;
    }
    getDrawGeometryLength(geo) {
        return this._diffuse.A > 0 ? this.VerticiesCount : 0;
    }
    getDrawGeometryOffset(geo) {
        return this.VerticiesOffset * 4;
    }
    _loadSharedTexture(index) {
        if (index < 0) {
            return null;
        }
        const rm = JThreeContext.getContextComponent(ContextComponents.ResourceManager);
        const resName = "jthree.pmx.sharedtoon." + index;
        if (rm.getTexture(resName)) {
            return rm.getTexture(resName);
        }
        else {
            const tex = rm.createTextureWithSource(resName, this._parentModel.pmxTextureManager.generateSharedToonImg(index));
            return tex;
        }
    }
}
export default PMXMaterial;
