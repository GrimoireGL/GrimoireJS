import PMXModel from "./PMXModel";
import PMXBone from "./PMXBone";
import TextureBuffer from "../../Core/Resources/Texture/BufferTexture";
import TextureFormat from "../../Wrapper/TextureInternalFormatType";
import ElementFormat from "../../Wrapper/TextureType";
import ContextComponents from "../../ContextComponents";
import JThreeContext from "../../JThreeContext";
import ResourceManager from "../../Core/ResourceManager";

class PMXSkeleton {

  private rootBones: PMXBone[] = [];

  private bones: PMXBone[];

  private bonesInTransformOrder: PMXBone[];

  private boneDictionary: { [boneName: string]: PMXBone } = {};

  private matricies: Float32Array;

  private matrixTexture: TextureBuffer;

  constructor(model: PMXModel) {
    model.skeleton = this;
    const bones = model.ModelData.Bones;
    this.bones = new Array(model.ModelData.Bones.length);
    this.bonesInTransformOrder = new Array(model.ModelData.Bones.length);
    this.matricies = new Float32Array(model.ModelData.Bones.length * 16);
    for (let i = 0; i < bones.length; i++) {
      const bone = bones[i];
      const pmxBone = new PMXBone(model, this, i);
      if (bone.parentBoneIndex === -1) {
        this.rootBones.push(pmxBone);
      }
      this.bonesInTransformOrder[i] = this.bones[i] = pmxBone;
      this.boneDictionary[bone.boneName] = pmxBone;
    }
    this.bones.forEach((v) => v.boneDictionaryConstructed());
    this.bonesInTransformOrder.sort((a, b) => a.OrderCriteria - b.OrderCriteria);
    this.matrixTexture = <TextureBuffer>JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager).createTexture("jthree.pmx.bonetransform" + model.ID, 4, this.bones.length, TextureFormat.RGBA, ElementFormat.Float);
  }

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
    for (let i = 0; i < this.bones.length; i++) {
      this.bones[i].applyMatrixToBuffer(this.matricies);
    }
    this.matrixTexture.updateTexture(this.matricies);
  }

  public updateBoneTransforms() {
    // this.rootBones.forEach(v=>v.callRecursive(l=>{
    // 	if(l["updateBoneTransform"])(<PMXBone>l).updateBoneTransform();
    // }));
    this.bonesInTransformOrder.forEach(v => (v.updateBoneTransform()));
  }

  public structureToString() {
    let result = "";
    this.rootBones.forEach(v => result += v.structureToString(0));
    return result;
  }
}

export default PMXSkeleton;
