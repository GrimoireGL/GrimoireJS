import PMXModel from "./PMXModel";
import PMXBone from "./PMXBone";
import TextureBuffer from "../../Core/Resources/Texture/BufferTexture";
import ContextComponents from "../../ContextComponents";
import Context from "../../Context";
import ResourceManager from "../../Core/ResourceManager";

class PMXSkeleton {

  private _rootBones: PMXBone[] = [];

  private _bones: PMXBone[];

  private _bonesInTransformOrder: PMXBone[];

  private _boneDictionary: { [boneName: string]: PMXBone } = {};

  private _matricies: Float32Array;

  private _matrixTexture: TextureBuffer;

  constructor(model: PMXModel) {
    model.skeleton = this;
    const bones = model.ModelData.Bones;
    this._bones = new Array(model.ModelData.Bones.length);
    this._bonesInTransformOrder = new Array(model.ModelData.Bones.length);
    this._matricies = new Float32Array(model.ModelData.Bones.length * 16);
    for (let i = 0; i < bones.length; i++) {
      const bone = bones[i];
      const pmxBone = new PMXBone(model, this, i);
      if (bone.parentBoneIndex === -1) {
        this._rootBones.push(pmxBone);
      }
      this._bonesInTransformOrder[i] = this._bones[i] = pmxBone;
      this._boneDictionary[bone.boneName] = pmxBone;
    }
    this._bones.forEach((v) => v.boneDictionaryConstructed());
    this._bonesInTransformOrder.sort((a, b) => a.OrderCriteria - b.OrderCriteria);
    this._matrixTexture = <TextureBuffer>Context.getContextComponent<ResourceManager>(ContextComponents.ResourceManager).createTexture("jthree.pmx.bonetransform" + model.id, 4, this._bones.length, WebGLRenderingContext.RGBA, WebGLRenderingContext.FLOAT);
  }

  public get MatrixTexture() {
    return this._matrixTexture;
  }

  public get BoneCount() {
    return this._bones.length;
  }

  public getBoneByName(name: string): PMXBone {
    return this._boneDictionary[name];
  }

  public getBoneByIndex(index: number): PMXBone {
    return this._bones[index];
  }

  public updateMatricies(): void {
    // this.updateBoneTransforms();
    for (let i = 0; i < this._bones.length; i++) {
      this._bones[i].applyMatrixToBuffer(this._matricies);
    }
    this._matrixTexture.updateTexture(this._matricies);
  }

  public updateBoneTransforms(): void {
    // this.rootBones.forEach(v=>v.callRecursive(l=>{
    // 	if(l["updateBoneTransform"])(<PMXBone>l).updateBoneTransform();
    // }));
    this._bonesInTransformOrder.forEach(v => (v.updateBoneTransform()));
  }

  public structureToString(): string {
    let result = "";
    this._rootBones.forEach(v => result += v.structureToString(0));
    return result;
  }
}

export default PMXSkeleton;
