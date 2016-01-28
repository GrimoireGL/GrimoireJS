import SceneObject from "../../Core/SceneObjects/SceneObject";
import PMXSkeleton from "./PMXSkeleton";
import PMXModel from "./PMXModel";
import PMXBoneTransformer from "./PMXBoneTransformer";
import Vector3 from "../../Math/Vector3";
class PMXBone extends SceneObject {
  private targetModel: PMXModel;

  private targetSkeleton: PMXSkeleton;

  public boneIndex: number;

  public get TargetBoneData() {
    return this.targetModel.ModelData.Bones[this.boneIndex];
  }

  public get IsRootBone() {
    return this.TargetBoneData.parentBoneIndex === -1;
  }

  public get OrderCriteria() {
    const latex = this.targetModel.ModelData.Bones.length;
    return this.boneIndex + this.TargetBoneData.transformLayer * latex + (this.AfterPhysics ? latex * latex : 0);
  }

  public get AfterPhysics() {
    return (this.TargetBoneData.boneFlag & 0x1000) > 0;
  }

  constructor(model: PMXModel, skeleton: PMXSkeleton, boneIndex: number) {
    super();
    this.transformer = new PMXBoneTransformer(this, model, boneIndex);
    this.targetModel = model;
    this.targetSkeleton = skeleton;
    this.boneIndex = boneIndex;
    this.name = this.TargetBoneData.boneName;
  }

	/**
	 * This method is intended to use by PMXSkeleton.
	 * No need to call this method by user.
	 */
  public boneDictionaryConstructed() {
    if (this.IsRootBone) {
      this.targetModel.addChild(this);
    } else {
      this.targetSkeleton.getBoneByIndex(this.TargetBoneData.parentBoneIndex).addChild(this);
    }
    this.Transformer.LocalOrigin = new Vector3(this.TargetBoneData.position);
    const transformer = <PMXBoneTransformer>this.transformer;
    if (transformer.IsIKBone)
      for (let i = 0; i < this.TargetBoneData.ikLinkCount; i++)
        (<PMXBoneTransformer>this.targetSkeleton.getBoneByIndex(this.TargetBoneData.ikLinks[i].ikLinkBoneIndex).transformer).isIKLink = true;
  }

  public updateBoneTransform() {
    const t = <PMXBoneTransformer>this.transformer;
    t.updateTransformForPMX();
  }

  public structureToString(layer: number) {
    let result = "";
    for (let i = 0; i < layer; i++)result += "  ";
    result += this.toString() + "\n";
    let arr = this.Children;
    for (let index = 0; index < arr.length; index++) {
      if (typeof arr[index] !== "undefined") {
        result += (<PMXBone>arr[index]).structureToString(layer + 1);
      }
    }
    return result;
  }

  public toString() {
    return `${this.TargetBoneData.boneName}(${this.TargetBoneData.boneNameEn})`;
  }

  public applyMatrixToBuffer(buffer: Float32Array) {
    // if (!(<PMXBoneTransformer>this.Transformer).transformUpdated) return;
    for (let i = 0; i < 16; i++) {
      buffer[16 * this.boneIndex + i] = this.Transformer.LocalToGlobal.rawElements[i];
    }
    // (<PMXBoneTransformer>this.Transformer).transformUpdated = false;
  }
}

export default PMXBone;
