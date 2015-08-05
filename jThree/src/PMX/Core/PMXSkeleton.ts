import PMXModel = require('./PMXModel');
import PMXBone = require('./PMXBone');
import AssociativeArray = require('../../Base/Collections/AssociativeArray')
import TextureBuffer = require('../../Core/Resources/Texture/BufferTexture');
import JThreeContextProxy = require('../../Core/JThreeContextProxy');
import TextureFormat = require('../../Wrapper/TextureInternalFormatType');
import ElementFormat = require('../../Wrapper/TextureType');

class PMXSkeleton {
	constructor(model: PMXModel) {
		var bones = model.ModelData.Bones;
		this.bones = new Array(model.ModelData.Bones.length);
		this.bonesInTransformOrder = new Array(model.ModelData.Bones.length);
		this.matricies = new Float32Array(model.ModelData.Bones.length * 16);
		for (var i = 0; i < bones.length; i++) {
			var bone = bones[i];
			var pmxBone = new PMXBone(model, this, i);
			if (bone.parentBoneIndex == -1) {
				this.rootBones.push(pmxBone);
			}
			this.bonesInTransformOrder[i] = this.bones[i] = pmxBone;
			this.boneDictionary.set(bone.boneName, pmxBone);
		}
		this.bones.forEach((v) => v.boneDictionaryConstructed());
		this.bonesInTransformOrder.sort((a, b) => a.OrderCriteria - b.OrderCriteria);
		var j3 = JThreeContextProxy.getJThreeContext();
		this.matrixTexture=<TextureBuffer>j3.ResourceManager.createTexture("jthree.pmx.bonetransform" + model.ID, 4,this.bones.length, TextureFormat.RGBA, ElementFormat.Float);
	}

	private rootBones: PMXBone[] = [];

	private bones: PMXBone[];

	private bonesInTransformOrder: PMXBone[];

	private boneDictionary: AssociativeArray<PMXBone> = new AssociativeArray<PMXBone>();

	private matricies: Float32Array;

	private matrixTexture: TextureBuffer;

	public get MatrixTexture()
	{
		return this.matrixTexture;
	}

	public get BoneCount()
	{
		return this.bones.length;
	}

	public getBoneByName(name: string): PMXBone {
		return this.boneDictionary.get(name);
	}

	public getBoneByIndex(index: number): PMXBone {
		return this.bones[index];
	}

	public updateMatricies() {
		for (var i = 0; i < this.bones.length; i++) {
			this.bones[i].applyMatrixToBuffer(this.matricies);
		}
		this.matrixTexture.updateTexture(this.matricies);
	}

	public structureToString() {
		var result = "";
		this.rootBones.forEach(v=> result += v.structureToString(0));
		return result;
	}
}

export = PMXSkeleton;