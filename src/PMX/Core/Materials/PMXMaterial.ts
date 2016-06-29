import TextureBase from "../../../Core/Resources/Texture/TextureBase";
import IConfigureEventArgs from "../../../Core/IConfigureEventArgs";
import IApplyMaterialArgument from "../../../Core/Materials/IApplyMaterialArgument";
import BasicMaterial from "../../../Core/Materials/BasicMaterial";
import Material from "../../../Core/Materials/Material";
import Geometry from "../../../Core/Geometries/Base/Geometry";
import Vector4 from "../../../Math/Vector4";
import Color4 from "../../../Math/Color4";
import Color3 from "../../../Math/Color3";
import PMX from "../../PMXData";
import Texture from "../../../Core/Resources/Texture/Texture";
import PMXModel from "./../PMXModel";
import PmxMaterialMorphParamContainer from "./../PMXMaterialMorphParamContainer";
import ResourceManager from "../../../Core/ResourceManager";

/**
 * the materials for PMX.
 */
class PMXMaterial extends Material {

  public edgeColor: Color4 = null;

  public materialIndex: number;

  public cullEnabled: boolean;

  public name: string;

  public addMorphParam: PmxMaterialMorphParamContainer;

  public mulMorphParam: PmxMaterialMorphParamContainer;

  protected __innerMaterial: BasicMaterial;

  private _verticiesCount: number;

  private _verticiesOffset: number;

  private _ambient: Color3;

  private _diffuse: Color4;

  private _edgeSize: number;

  private _sphere: TextureBase = null;

  private _texture: TextureBase = null;

  private _toon: TextureBase = null;

  private _pmxData: PMX;

  private _parentModel: PMXModel;

  private _sphereMode: number;

  private _specular: Vector4;

  constructor(pmx: PMXModel, index: number, offset: number) {
    super();
    this.addMorphParam = new PmxMaterialMorphParamContainer(1);
    this.mulMorphParam = new PmxMaterialMorphParamContainer(0);
    this._parentModel = pmx;
    this._pmxData = pmx.ModelData;
    this.materialIndex = index;
    let materialData = this._pmxData.Materials[index];
    this._verticiesCount = materialData.vertexCount;
    this._verticiesOffset = offset;
    this.name = materialData.materialName;
    this.cullEnabled = !((materialData.drawFlag & 0x01) > 0); // each side draw flag
    this._ambient = new Color3(materialData.ambient[0], materialData.ambient[1], materialData.ambient[2]);
    this._diffuse = new Color4(materialData.diffuse[0], materialData.diffuse[1], materialData.diffuse[2], materialData.diffuse[3]);
    if ((materialData.drawFlag & 0x10) > 0) {
      this.edgeColor = new Color4(materialData.edgeColor[0], materialData.edgeColor[1], materialData.edgeColor[2], materialData.edgeColor[3]);
    }
    this._specular = new Vector4(materialData.specular);
    this._edgeSize = materialData.edgeSize;
    this._sphereMode = materialData.sphereMode;
    this.__innerMaterial = new BasicMaterial(require("../../Materials/Forward.xmml"), "pmx.forward");
    const tm = this._parentModel.pmxTextureManager;
    tm.loadTexture(materialData.sphereTextureIndex).then((texture) => {
      this._sphere = texture;
    });
    tm.loadTexture(materialData.textureIndex).then((texture) => {
      this._texture = texture;
    });
    if (materialData.sharedToonFlag === 0) { // not shared texture
      tm.loadTexture(materialData.targetToonIndex).then((texture) => {
        this._toon = texture;
      });
    } else {
      this._toon = this._loadSharedTexture(materialData.targetToonIndex);
    }
    this.__innerMaterial.on("configure", (v: IConfigureEventArgs) => {
      if (v.passIndex === 0) {
        v.configure.cullOrientation = this.cullEnabled ? "BACK" : "NONE";
      }
    });
    this.__innerMaterial.on("ready", () => {
      this.__setLoaded();
    });
  }

  /**
   * Count of verticies
   */
  public get VerticiesCount() {
    return this._verticiesCount;
  }

  /**
   * Offset of verticies in index buffer
   */
  public get VerticiesOffset() {
    return this._verticiesOffset;
  }

  public get ParentModel() {
    return this._parentModel;
  }

  public get Diffuse(): Color4 {
    return this._diffuse;
  }

  public get Texture() {
    return this._texture;
  }

  public get Sphere() {
    return this._sphere;
  }


  public get SphereMode() {
    return this._sphereMode;
  }

  public get Specular() {
    return this._specular;
  }

  public getPassCount(techniqueIndex: number): number {
    return this.edgeColor == null ? 1 : 2;
  }

  public get SelfShadow(): boolean {
    return (this._pmxData.Materials[this.materialIndex].drawFlag & 0x04) > 0;
  }

  public apply(matArg: IApplyMaterialArgument): void {
    const skeleton = this._parentModel.skeleton;
    if (matArg.passIndex === 1) {
      this.__innerMaterial.shaderVariables = {
        boneCount: skeleton.BoneCount,
        boneMatriciesTexture: skeleton.MatrixTexture,
        edgeSize: PmxMaterialMorphParamContainer.calcMorphedSingleValue(this._edgeSize, this.addMorphParam, this.mulMorphParam, (t) => t.edgeSize),
        edgeColor: PmxMaterialMorphParamContainer.calcMorphedVectorValue(this.edgeColor.toVector(), this.addMorphParam, this.mulMorphParam, (t) => t.edgeColor, 4)
      };
    } else {
      this.__innerMaterial.shaderVariables = {
        boneCount: skeleton.BoneCount,
        boneMatriciesTexture: skeleton.MatrixTexture,
        texture: this._texture,
        toon: this._toon,
        sphere: this._sphere,
        diffuse: this._diffuse.toVector(),
        specular: this._specular,
        ambient: this._ambient.toVector(),
        textureUsed: !this._texture ? 0 : 1,
        sphereMode: !this._sphere ? 0 : this._sphereMode,
        toonFlag: !this._toon ? 0 : 1,
        addTexCoeff: new Vector4(this.addMorphParam.textureCoeff),
        mulTexCoeff: new Vector4(this.mulMorphParam.textureCoeff),
        addSphereCoeff: new Vector4(this.addMorphParam.sphereCoeff),
        mulSphereCoeff: new Vector4(this.mulMorphParam.sphereCoeff),
        addToonCoeff: new Vector4(this.addMorphParam.toonCoeff),
        mulToonCoeff: new Vector4(this.mulMorphParam.toonCoeff),
        ambientCoefficient: matArg.scene.sceneAmbient.toVector()
      };
    }
    this.__innerMaterial.apply(matArg);
  }

  public get Priorty(): number {
    return 100 + this.materialIndex;
  }

  public getDrawGeometryLength(geo: Geometry): number {
    return this._diffuse.A > 0 ? this.VerticiesCount : 0;
  }

  public getDrawGeometryOffset(geo: Geometry): number {
    return this.VerticiesOffset * 4;
  }

  private _loadSharedTexture(index: number): Texture {
    if (index < 0) {
      return null;
    }
    const resName = "jthree.pmx.sharedtoon." + index;
    if (ResourceManager.getTexture(resName)) {
      return <Texture>ResourceManager.getTexture(resName);
    } else {
      const tex = ResourceManager.createTextureWithSource(resName, this._parentModel.pmxTextureManager.generateSharedToonImg(index));
      return tex;
    }
  }
}

export default PMXMaterial;
