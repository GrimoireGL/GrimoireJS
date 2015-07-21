import SceneObject = require('../../Core/SceneObject');
import PMXSkeleton = require('./PMXSkeleton');
import PMXModel = require('./PMXModel');
import PMXBoneTransformer = require('./PMXBoneTransformer');
import Vector3 = require('../../Math/Vector3');
class PMXBone extends SceneObject {
	private targetModel: PMXModel;

	private targetSkeleton: PMXSkeleton;

	public boneIndex: number;

	public get TargetBoneData() {
		return this.targetModel.ModelData.Bones[this.boneIndex];
	}

	public get IsRootBone() {
		return this.TargetBoneData.parentBoneIndex == -1;
	}

	public get OrderCriteria() {
		return this.boneIndex + this.TargetBoneData.transformLayer * this.targetModel.ModelData.Bones.length;
	}

	public get AfterPhysics() {
		return (this.TargetBoneData.boneFlag & 0x1000) > 0;
	}

	constructor(model: PMXModel, skeleton: PMXSkeleton, boneIndex: number) {
		super(new PMXBoneTransformer(this,model,boneIndex));
		this.targetModel = model;
		this.targetSkeleton = skeleton;
		this.boneIndex = boneIndex;
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
	}

	public structureToString(layer: number) {
		var result = "";
		for (var i = 0; i < layer; i++)result += "  ";
		result += this.toString() + '\n';
		var arr = this.Children.asArray();
		for (var index = 0; index < arr.length; index++) {
			if (typeof arr[index] !== 'undefined') result += (<PMXBone>arr[index]).structureToString(layer + 1);
		}
		return result;
	}

	public toString() {
		return `${this.TargetBoneData.boneName}(${this.TargetBoneData.boneNameEn})`;
	}

	public applyMatrixToBuffer(buffer: Float32Array) {
		if (!(<PMXBoneTransformer>this.Transformer).transformUpdated) return;
		for (var i = 0; i < 16; i++) {
			buffer[16 * this.boneIndex + i] = this.Transformer.LocalToGlobal.rawElements[i];
		}
		(<PMXBoneTransformer>this.Transformer).transformUpdated = false;
	}
}

export = PMXBone;