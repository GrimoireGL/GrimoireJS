import PMXBone from "./PMXBone";
import ContextComponents from "../../ContextComponents";
import JThreeContext from "../../JThreeContext";
class PMXSkeleton {
    constructor(model) {
        this._rootBones = [];
        this._boneDictionary = {};
        model.skeleton = this;
        const bones = model.ModelData.Bones;
        this._bones = new Array(model.ModelData.Bones.length);
        this._bonesInTransformOrder = new Array(model.ModelData.Bones.length);
        this._matricies = new Float32Array(model.ModelData.Bones.length * 16);
        for (let i = 0; i < bones.length; i++) {
            const bone = bones[i];
            const pmxBone = new PMXBone(model, this, i);
            if (bone.parentBoneIndex === -1) {
                this._rootBones.push(pmxBone);
            }
            this._bonesInTransformOrder[i] = this._bones[i] = pmxBone;
            this._boneDictionary[bone.boneName] = pmxBone;
        }
        this._bones.forEach((v) => v.boneDictionaryConstructed());
        this._bonesInTransformOrder.sort((a, b) => a.OrderCriteria - b.OrderCriteria);
        this._matrixTexture = JThreeContext.getContextComponent(ContextComponents.ResourceManager).createTexture("jthree.pmx.bonetransform" + model.ID, 4, this._bones.length, WebGLRenderingContext.RGBA, WebGLRenderingContext.FLOAT);
    }
    get MatrixTexture() {
        return this._matrixTexture;
    }
    get BoneCount() {
        return this._bones.length;
    }
    getBoneByName(name) {
        return this._boneDictionary[name];
    }
    getBoneByIndex(index) {
        return this._bones[index];
    }
    updateMatricies() {
        this.updateBoneTransforms();
        for (let i = 0; i < this._bones.length; i++) {
            this._bones[i].applyMatrixToBuffer(this._matricies);
        }
        this._matrixTexture.updateTexture(this._matricies);
    }
    updateBoneTransforms() {
        // this.rootBones.forEach(v=>v.callRecursive(l=>{
        // 	if(l["updateBoneTransform"])(<PMXBone>l).updateBoneTransform();
        // }));
        this._bonesInTransformOrder.forEach(v => (v.updateBoneTransform()));
    }
    structureToString() {
        let result = "";
        this._rootBones.forEach(v => result += v.structureToString(0));
        return result;
    }
}
export default PMXSkeleton;
