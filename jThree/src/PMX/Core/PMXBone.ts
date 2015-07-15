import SceneObject = require('../../Core/SceneObject');
import PMXSkeleton = require('./PMXSkeleton');
import PMXModel = require('./PMXModel');
class PMXBone extends SceneObject
{
	private targetModel: PMXModel;

	private targetSkeleton: PMXSkeleton;

	private boneIndex: number;

	public get TargetBoneData()
	{
		return this.targetModel.ModelData.Bones[this.boneIndex];
	}

	public get IsRootBone()
	{
		return this.TargetBoneData.parentBoneIndex == -1;
	}

	constructor(model: PMXModel, skeleton:PMXSkeleton,boneIndex:number)
	{
		super();
		this.targetModel = model;
		this.targetSkeleton = skeleton;
		this.boneIndex = boneIndex;
	}

	/**
	 * This method is intended to use by PMXSkeleton.
	 * No need to call this method by user.
	 */
	public boneDictionaryConstructed()
	{
		if(this.IsRootBone)
		{
			this.targetModel.addChild(this);
		}else{
			this.targetSkeleton.getBoneByIndex(this.TargetBoneData.parentBoneIndex).addChild(this);
		}
	}

	public structureToString(layer:number)
	{
		var result = "";
		for (var i = 0; i < layer; i++)result += "  ";
		result += `${this.TargetBoneData.boneName}(${this.TargetBoneData.boneNameEn})\n`;
		var arr = this.Children.asArray();
		for (var index = 0; index < arr.length;index++)
		{
			if(typeof arr[index] !=='undefined')result += (<PMXBone>arr[index]).structureToString(layer + 1);
		}
		return result;
	}
}

export = PMXBone;