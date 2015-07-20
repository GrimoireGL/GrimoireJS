import Transformer = require('../../Core/Transform/Transformer');
import SceneObject = require('../../Core/SceneObject');
import PMX = require('../PMXLoader');
class PMXBoneTransformer extends Transformer
{
	private pmx: PMX;

	private boneIndex: number;

	public get TargetBoneData()
	{
		return this.pmx.Bones[this.boneIndex];
	}

	public get IsLocalProvidingBone()
	{
		return (this.TargetBoneData.boneFlag & 0x0080) > 0;
	}

	public get IsRotationProvidingBone()
	{
		return (this.TargetBoneData.boneFlag & 0x0100) > 0;
	}

	public get IsTranslationProvidingBone()
	{
		return (this.TargetBoneData.boneFlag & 0x0200) > 0;
	}

	constructor(sceneObj:SceneObject,pmx:PMX,index:number)
	{
		super(sceneObj);
		this.pmx = pmx;
		this.boneIndex = index;
	}

	public transformUpdated = false;

	public updateTransform(): void {
		super.updateTransform();

		this.transformUpdated = true;
	}
}

export = PMXBoneTransformer;