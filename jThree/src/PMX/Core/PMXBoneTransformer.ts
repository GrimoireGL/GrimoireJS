import Transformer = require('../../Core/Transform/Transformer');
import SceneObject = require('../../Core/SceneObject');
import PMXModel = require('./PMXModel');
import glm = require('gl-matrix');
import Quaternion = require('../../Math/Quaternion');
import Vector3 = require('../../Math/Vector3');
import Matrix = require('../../Math/Matrix');
import PMXIKLink= require('../PMXIKLink');
class PMXBoneTransformer extends Transformer {
	private pmx: PMXModel;

	private boneIndex: number;

	private ikLinkRotation:Quaternion = Quaternion.Identity;

	public userRotation:Quaternion = Quaternion.Identity;

	public userTranslation:Vector3 = Vector3.Zero;

	private morphRotation:Quaternion = Quaternion.Identity;

	private morphTranslation:Vector3 = Vector3.Zero;

	private providingRotation:Quaternion = Quaternion.Identity;

	private providingTranslation:Vector3 = Vector3.Zero;

	public get PMXModelData() {
		return this.pmx.ModelData;
	}

	public get TargetBoneData() {
		return this.PMXModelData.Bones[this.boneIndex];
	}

	public get ProvidingBone()
	{
		return this.pmx.skeleton.getBoneByIndex(this.TargetBoneData.providingBoneIndex);
	}

	public get ProvidingBoneTransformer()
	{
		return <PMXBoneTransformer>this.ProvidingBone.Transformer;
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

	public needUpdateChildren = true;

	public get NeedUpdateChildren()
	{
		return this.needUpdateChildren;
	}

	/**
	 * Whether this bone transformer is IKLink or not.
	 * This variable will be assigned by PMXSkeleton after loading all bones.
	 * @type {boolean}
	 */
	public isIKLink:boolean=false;

	constructor(sceneObj: SceneObject, pmx: PMXModel, index: number) {
		super(sceneObj);
		this.pmx = pmx;
		this.boneIndex = index;
	}

	public transformUpdated = false;

	public updateTransform(): void {
		super.updateTransform();
	}

	public updateTransformForPMX()
	{
		if (this.pmx == null) return;
		this.updateLocalTranslation();
		if (this.IsIKBone&&this.pmx.skeleton) {
			this.applyCCDIK();
		}else{
			this.updateLocalRotation();
			super.updateTransform();
		}
	}

	private updateLocalRotation()
	{
		glm.quat.identity(this.Rotation.rawElements);
		if(false&&this.IsRotationProvidingBone)
		{
			if(this.IsLocalProvidingBone)
			{
				//Do something when this bone is local providing bone
				console.error("Local providing is not implemented yet!");
			}
			if(this.ProvidingBoneTransformer.isIKLink)
			{
				//Interpolate ikLink rotation with providing rate
				glm.quat.slerp(this.Rotation.rawElements,this.Rotation.rawElements,this.ProvidingBoneTransformer.ikLinkRotation.rawElements,this.TargetBoneData.providingRate);
			}
		}
		//Multiply local rotations of this bone
		glm.quat.mul(this.Rotation.rawElements,this.Rotation.rawElements,this.userRotation.rawElements);
		glm.quat.mul(this.Rotation.rawElements,this.Rotation.rawElements,this.morphRotation.rawElements);
		if(this.IsRotationProvidingBone)
		{ //Memorize providing rotation of this bone
			glm.quat.copy(this.providingRotation.rawElements,this.Rotation.rawElements);
		}
		//Calculate IkLink rotation of this bone
		glm.quat.mul(this.Rotation.rawElements,this.Rotation.rawElements,this.ikLinkRotation.rawElements);
	}

	private updateLocalTranslation()
	{
		this.Position.rawElements[0] = 0;
		this.Position.rawElements[1] = 0;
		this.Position.rawElements[2] = 0;
		if(this.IsTranslationProvidingBone)
		{
			if(this.IsLocalProvidingBone)
			{
				//Do something when this bone is local providing bone
				console.error("Local providing is not implemented yet!");
			}
			glm.vec3.lerp(this.Position.rawElements,this.Position.rawElements,this.ProvidingBone.Transformer.Position.rawElements,this.TargetBoneData.providingRate);
		}
		glm.vec3.add(this.Position.rawElements,this.Position.rawElements,this.userTranslation.rawElements);
		glm.vec3.add(this.Position.rawElements,this.Position.rawElements,this.morphTranslation.rawElements);
		if(this.IsTranslationProvidingBone)
		{
			glm.vec3.copy(this.providingTranslation.rawElements,this.Position.rawElements);
		}
	}

	private applyCCDIK() {
		for(var i = 0; i < this.TargetBoneData.ikLinkCount; i ++)
		{
			var link = this.getIkLinkTransformerByIndex(i);
			link.ikLinkRotation = Quaternion.Identity;
			link.updateTransform();
		}
		for (var i = 0; i < this.TargetBoneData.ikLoopCount;i++)
		{
			this.CCDIKOperation();
		}
	}

  private CCDIKOperation() {
		var effector = this.PMXModelData.Bones[this.TargetBoneData.ikTargetBoneIndex];
		var effectorTransformer = <PMXBoneTransformer> this.pmx.skeleton.getBoneByIndex(this.TargetBoneData.ikTargetBoneIndex).Transformer;
		var TargetGlobalPos =Matrix.transformPoint(this.LocalToGlobal,this.LocalOrigin);
		// glm.vec3.transformMat4(this.pmxCalcCacheVec, this.LocalOrigin.rawElements, this.LocalToGlobal.rawElements);
		for (var i = 0; i < this.TargetBoneData.ikLinkCount; i++) {
			var ikLinkData = this.TargetBoneData.ikLinks[i];
			var ikLinkTransform = this.getIkLinkTransformerByIndex(i);
			var link2Effector = this.getLink2Effector(ikLinkTransform, effectorTransformer);
			var link2Target = this.getLink2Target(ikLinkTransform, TargetGlobalPos);
			this.ikLinkCalc(ikLinkTransform, link2Effector, link2Target, this.TargetBoneData.ikLimitedRotation,ikLinkData);
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

	private ikLinkCalc(link: PMXBoneTransformer, effector: Vector3, target: Vector3, rotationLimit: number,ikLink:PMXIKLink) {
		//Calculate rotation angle
		var dot = Vector3.dot(effector,target);
		if (dot > 1.0) dot = 1.0;
		var rotationAngle = this.clampFloat(Math.acos(dot), rotationLimit);
		if (isNaN(rotationAngle)) return;
		if (rotationAngle <= 1.0e-3) return;
		//Calculate rotation axis of rotation
		var rotationAxis = Vector3.cross(effector,target);
		//Generate the rotation matrix rotating along the axis
		var rotation =Quaternion.AngleAxis(rotationAngle, rotationAxis);
		link.ikLinkRotation = rotation;
		link.updateLocalRotation();
		link.updateTransformMatricies();
		//Rotation = (providingRotation) * userRotation * morphRotation * ikLinkRotation
		//RestrictedRotation = Rotation * ikLinkAdjust
		//ikLinkAdust = (Rotation) ^ -1 * RestrictedRotation
		var restrictedRotation = this.RestrictRotation(ikLink,link.Rotation);
		var ikLinkAdust = Quaternion.Multiply(link.Rotation.Inverse(),restrictedRotation);
	  link.ikLinkRotation = Quaternion.Multiply(link.ikLinkRotation,ikLinkAdust);
		link.updateTransform();
		// link.updateTransformMatricies();
	}

	private getIkLinkTransformerByIndex(index:number):PMXBoneTransformer
	{
		return <PMXBoneTransformer>this.pmx.skeleton.getBoneByIndex(this.TargetBoneData.ikLinks[index].ikLinkBoneIndex).Transformer;
	}

	private RestrictRotation(link:PMXIKLink,rot:Quaternion):Quaternion
{
  if (!link.isLimitedRotation) return rot;
  var decomposed = rot.FactoringQuaternionXYZ();
  var xRotation = Math.max(link.limitedRotation[0],Math.min(link.limitedRotation[3],-decomposed.x));
  var yRotation = Math.max(link.limitedRotation[1],Math.min(link.limitedRotation[4],-decomposed.y));
  var zRotation = Math.max(link.limitedRotation[2],Math.min(link.limitedRotation[5],decomposed.z));
  return Quaternion.EulerXYZ(-xRotation,-yRotation,zRotation);
}

	private clampFloat(f: number, limit: number) {
		return Math.max(Math.min(f, limit), -limit);
	}
}

export = PMXBoneTransformer;
