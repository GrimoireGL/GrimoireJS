import SceneObject from "../../Core/SceneObjects/SceneObject";
import PMXBoneTransformer from "./PMXBoneTransformer";
import Vector3 from "../../Math/Vector3";
class PMXBone extends SceneObject {
    constructor(model, skeleton, boneIndex) {
        super();
        this.__transformer = new PMXBoneTransformer(this, model, boneIndex);
        this._targetModel = model;
        this._targetSkeleton = skeleton;
        this.boneIndex = boneIndex;
        this.name = this.TargetBoneData.boneName;
    }
    get TargetBoneData() {
        return this._targetModel.ModelData.Bones[this.boneIndex];
    }
    get IsRootBone() {
        return this.TargetBoneData.parentBoneIndex === -1;
    }
    get OrderCriteria() {
        const latex = this._targetModel.ModelData.Bones.length;
        return this.boneIndex + this.TargetBoneData.transformLayer * latex + (this.AfterPhysics ? latex * latex : 0);
    }
    get AfterPhysics() {
        return (this.TargetBoneData.boneFlag & 0x1000) > 0;
    }
    boneDictionaryConstructed() {
        if (this.IsRootBone) {
            this._targetModel.addChild(this);
        }
        else {
            this._targetSkeleton.getBoneByIndex(this.TargetBoneData.parentBoneIndex).addChild(this);
        }
        this.Transformer.Position = new Vector3(this.TargetBoneData.position);
        const transformer = this.__transformer;
        if (transformer.IsIKBone) {
            for (let i = 0; i < this.TargetBoneData.ikLinkCount; i++) {
                this._targetSkeleton.getBoneByIndex(this.TargetBoneData.ikLinks[i].ikLinkBoneIndex).__transformer.isIKLink = true;
            }
        }
    }
    updateBoneTransform() {
        const t = this.__transformer;
        t.updateTransformForPMX();
    }
    structureToString(layer) {
        let result = "";
        for (let i = 0; i < layer; i++) {
            result += "  ";
        }
        result += this.toString() + "\n";
        let arr = this.Children;
        for (let index = 0; index < arr.length; index++) {
            if (typeof arr[index] !== "undefined") {
                result += arr[index].structureToString(layer + 1);
            }
        }
        return result;
    }
    toString() {
        return `${this.TargetBoneData.boneName}(${this.TargetBoneData.boneNameEn})`;
    }
    applyMatrixToBuffer(buffer) {
        for (let i = 0; i < 16; i++) {
            buffer[16 * this.boneIndex + i] = this.Transformer.LocalToGlobal.rawElements[i];
        }
    }
}
export default PMXBone;
//# sourceMappingURL=PMXBone.js.map