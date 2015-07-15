import PMXModel = require('./PMXModel');
import PMXBone = require('./PMXBone');
import AssociativeArray = require('../../Base/Collections/AssociativeArray')
class PMXSkeleton
{
	constructor(model:PMXModel)
	{
		var bones=model.ModelData.Bones;
		this.bones = new Array(model.ModelData.Bones.length);
		for (var i = 0; i < bones.length;i++)
		{
			var bone = bones[i];
			var pmxBone = new PMXBone(model,this,i);
			if(bone.parentBoneIndex==-1)
			{
				this.rootBones.push(pmxBone);
			}
			this.bones[i]=pmxBone;
			this.boneDictionary.set(bone.boneName, pmxBone);
		}
		this.bones.forEach((v) => v.boneDictionaryConstructed());
		console.warn(this.structureToString());
	}

	private rootBones:PMXBone[]=[];

	private bones:PMXBone[];

	private boneDictionary: AssociativeArray<PMXBone> = new AssociativeArray<PMXBone>();

	public getBoneByName(name:string):PMXBone
	{
		return this.boneDictionary.get(name);
	}

	public getBoneByIndex(index:number):PMXBone
	{
		return this.bones[index];
	}

	public structureToString()
	{
		var result = "";
		this.rootBones.forEach(v=> result += v.structureToString(0));
		return result;
	}
}

export = PMXSkeleton;