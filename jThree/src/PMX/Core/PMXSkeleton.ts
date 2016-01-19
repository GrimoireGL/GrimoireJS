import PMXModel = require("./PMXModel");
import PMXBone = require("./PMXBone");
import TextureBuffer = require("../../Core/Resources/Texture/BufferTexture");
import TextureFormat = require("../../Wrapper/TextureInternalFormatType");
import ElementFormat = require("../../Wrapper/TextureType");
import PMXBoneTransformer = require("./PMXBoneTransformer");
import ContextComponents = require("../../ContextComponents");
import JThreeContext = require("../../JThreeContext");
import ResourceManager = require("../../Core/ResourceManager");
class PMXSkeleton {
  constructor(model: PMXModel) {
    model.skeleton = this;
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
      this.boneDictionary[bone.boneName] = pmxBone;
    }
    this.bones.forEach((v) => v.boneDictionaryConstructed());
    this.bonesInTransformOrder.sort((a, b) => a.OrderCriteria - b.OrderCriteria);
    this.matrixTexture = <TextureBuffer>JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager).createTexture("jthree.pmx.bonetransform" + model.ID, 4, this.bones.length, TextureFormat.RGBA, ElementFormat.Float);
  }

  private rootBones: PMXBone[] = [];

  private bones: PMXBone[];

  private bonesInTransformOrder: PMXBone[];

  private boneDictionary: { [boneName: string]: PMXBone } = {};

  private matricies: Float32Array;

  private matrixTexture: TextureBuffer;

  public get MatrixTexture() {
    return this.matrixTexture;
  }

  public get BoneCount() {
    return this.bones.length;
  }

  public getBoneByName(name: string): PMXBone {
    return this.boneDictionary[name];
  }

  public getBoneByIndex(index: number): PMXBone {
    return this.bones[index];
  }

  public updateMatricies() {
    this.updateBoneTransforms();
    for (var i = 0; i < this.bones.length; i++) {
      this.bones[i].applyMatrixToBuffer(this.matricies);
    }
    this.matrixTexture.updateTexture(this.matricies);
  }

  public updateBoneTransforms() {
    // this.rootBones.forEach(v=>v.callRecursive(l=>{
    // 	if(l["updateBoneTransform"])(<PMXBone>l).updateBoneTransform();
    // }));
    this.bonesInTransformOrder.forEach(v=> (v.updateBoneTransform()));
  }

  public structureToString() {
    var result = "";
    this.rootBones.forEach(v=> result += v.structureToString(0));
    return result;
  }
}

export = PMXSkeleton;
