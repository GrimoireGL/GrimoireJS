import Transformer = require('../../Core/Transform/Transformer');
import SceneObject = require('../../Core/SceneObject');
import PMX = require('../PMXLoader');
import PMXModel = require('./PMXModel');
import glm = require('glm');
import Quaternion = require('../../Math/Quaternion');
class PMXBoneTransformer extends Transformer {
	private pmx: PMXModel;

	private boneIndex: number;

	private pmxCalcCacheVec = glm.vec3.create();

	private pmxCalcCacheVec2 = glm.vec3.create();

	private pmxCalcCacheQuat = glm.quat.create();
	private pmxCalcCahceMat = glm.mat4.create();

	public get PMXModelData() {
		return this.pmx.ModelData;
	}

	public get TargetBoneData() {
		return this.PMXModelData.Bones[this.boneIndex];
	}

	public get IsLocalProvidingBone() {
		return (this.TargetBoneData.boneFlag & 0x0080) > 0;
	}

	public get IsRotationProvidingBone() {
		return (this.TargetBoneData.boneFlag & 0x0100) > 0;
	}

	public get IsTranslationProvidingBone() {
		return (this.TargetBoneData.boneFlag & 0x0200) > 0;
	}

	public get IsIKBone() {
		return (this.TargetBoneData.boneFlag & 0x0020) > 0;
	}

	constructor(sceneObj: SceneObject, pmx: PMXModel, index: number) {
		super(sceneObj);
		this.pmx = pmx;
		this.boneIndex = index;
	}

	public transformUpdated = false;

	public updateTransform(): void {
		super.updateTransform();
		if (this.pmx == null) return;
		if (this.IsIKBone&&this.pmx.Skeleton) {
			this.applyCCDIK();
		}
		this.transformUpdated = true;
	}

	private applyCCDIK() {
		for (var i = 0; i < this.TargetBoneData.ikLoopCount;i++)
		{
			this.CCDIKOperation();
		}
	}

	private CCDIKOperation() {
		var effector = this.PMXModelData.Bones[this.TargetBoneData.ikTargetBoneIndex];
		var effectorTransformer = <PMXBoneTransformer> this.pmx.Skeleton.getBoneByIndex(this.TargetBoneData.ikTargetBoneIndex).Transformer;
		var TargetGlobalPos = glm.vec3.transformMat4(this.pmxCalcCacheVec, this.LocalOrigin.targetVector, this.LocalToGlobal.rawElements);
		for (var i = 0; i < this.TargetBoneData.ikLinkCount; i++) {
			var ikLinkData = this.TargetBoneData.ikLinks[i];
			var ikLinkTransform = <PMXBoneTransformer>this.pmx.Skeleton.getBoneByIndex(ikLinkData.ikLinkBoneIndex).Transformer;
			var link2Effector = this.getLink2Effector(ikLinkTransform, effectorTransformer);
			var link2Target = this.getLink2Target(ikLinkTransform, TargetGlobalPos);
			this.ikLinkCalc(ikLinkTransform, link2Effector, link2Target, this.TargetBoneData.ikLimitedRotation);
		}
	}

	private getLink2Effector(link: PMXBoneTransformer, effector: PMXBoneTransformer) {
		var ToLinkLocal = glm.mat4.invert(this.pmxCalcCahceMat, link.LocalToGlobal.rawElements);
		var ep = effector.LocalOrigin;
		var effectorPos = glm.vec3.transformMat4(this.pmxCalcCacheVec2, [ep.X, ep.Y, ep.Z, 1], glm.mat4.mul(this.pmxCalcCahceMat, ToLinkLocal, effector.LocalToGlobal.rawElements)); //●
		return glm.vec3.normalize(this.pmxCalcCacheVec2, glm.vec3.sub(this.pmxCalcCacheVec2, effectorPos, link.LocalOrigin.targetVector));
	}

	private getLink2Target(link: PMXBoneTransformer, tp: glm.GLM.IArray) {
		var targetInLinkLocal = glm.vec3.transformMat4(this.pmxCalcCacheVec, [tp[0], tp[1], tp[2], 1], this.pmxCalcCahceMat);
		return glm.vec3.normalize(this.pmxCalcCacheVec, glm.vec3.sub(this.pmxCalcCacheVec, tp, link.LocalOrigin.targetVector));
	}

	private ikLinkCalc(link: PMXBoneTransformer, effector: glm.GLM.IArray, target: glm.GLM.IArray, rotationLimit: number) {
		//回転角度を求める
		var dot = glm.vec3.dot(effector, target);
		if (dot > 1.0) dot = 1.0;
		var rotationAngle = this.clampFloat(Math.acos(dot), rotationLimit);
		if (isNaN(rotationAngle)) return;
		if (rotationAngle <= 1.0e-3) return;

		//回転軸を求める
		var rotationAxis = glm.vec3.cross(effector,effector,target);

		//軸を中心として回転する行列を作成する。
		var rotation = glm.quat.setAxisAngle(this.pmxCalcCacheQuat, rotationAxis, rotationAngle);
		glm.quat.normalize(rotation,rotation);
		link.Rotation=new Quaternion(glm.quat.mul(rotation,rotation,link.Rotation.targetQuat));
	}

	private clampFloat(f: number, limit: number) {
		return Math.max(Math.min(f, limit), -limit);
	}

}

export = PMXBoneTransformer;