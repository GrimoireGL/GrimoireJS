import Transformer = require('../../Core/Transform/Transformer');
import SceneObject = require('../../Core/SceneObject');
import PMX = require('../PMXLoader');
import PMXModel = require('./PMXModel');
import glm = require('glm');
import Quaternion = require('../../Math/Quaternion');
import Vector3 = require('../../Math/Vector3');
import Matrix = require('../../Math/Matrix');
class PMXBoneTransformer extends Transformer {
	private pmx: PMXModel;

	private boneIndex: number;

	private pmxCalcCacheVec = glm.vec3.create();

	private pmxCalcCacheVec2 = glm.vec3.create();

	private pmxCalcCacheQuat = glm.quat.create();

	private pmxCalcCacheQuat2 = glm.quat.create();
	
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
		var TargetGlobalPos =Matrix.transformPoint(this.LocalToGlobal,this.LocalOrigin);
		// glm.vec3.transformMat4(this.pmxCalcCacheVec, this.LocalOrigin.targetVector, this.LocalToGlobal.rawElements);
		for (var i = 0; i < this.TargetBoneData.ikLinkCount; i++) {
			var ikLinkData = this.TargetBoneData.ikLinks[i];
			var ikLinkTransform = <PMXBoneTransformer>this.pmx.Skeleton.getBoneByIndex(ikLinkData.ikLinkBoneIndex).Transformer;
			var link2Effector = this.getLink2Effector(ikLinkTransform, effectorTransformer);
			var link2Target = this.getLink2Target(ikLinkTransform, TargetGlobalPos);
			this.ikLinkCalc(ikLinkTransform, link2Effector, link2Target, this.TargetBoneData.ikLimitedRotation);
		}
	}

	private getLink2Effector(link: PMXBoneTransformer, effector: PMXBoneTransformer) {
		var ToLinkLocal =  Matrix.inverse(link.LocalToGlobal);
		var ep = effector.LocalOrigin;
		var local2effectorLocal=Matrix.multiply(ToLinkLocal,effector.LocalToGlobal);
		var effectorPos = Matrix.transformPoint(local2effectorLocal,ep);
		return effectorPos.subtractWith(link.LocalOrigin).normalizeThis();
	}

	private getLink2Target(link: PMXBoneTransformer, tp: Vector3) {
		var ToLinkLocal =  Matrix.inverse(link.LocalToGlobal);
		var effectorPos = Matrix.transformPoint(ToLinkLocal,tp);
		return effectorPos.subtractWith(link.LocalOrigin).normalizeThis();
	}

	private ikLinkCalc(link: PMXBoneTransformer, effector: Vector3, target: Vector3, rotationLimit: number) {
		//回転角度を求める
		var dot = Vector3.dot(effector,target);
		if (dot > 1.0) dot = 1.0;
		var rotationAngle = this.clampFloat(Math.acos(dot), rotationLimit);
		if (isNaN(rotationAngle)) return;
		if (rotationAngle <= 1.0e-3) return;

		//回転軸を求める
		var rotationAxis = Vector3.cross(effector,target);

		//軸を中心として回転する行列を作成する。
		var rotation =Quaternion.AngleAxis(rotationAngle, rotationAxis);
		link.Rotation=Quaternion.Multiply(rotation,link.Rotation);
	}


	private clampFloat(f: number, limit: number) {
		return Math.max(Math.min(f, limit), -limit);
	}


}

export = PMXBoneTransformer;