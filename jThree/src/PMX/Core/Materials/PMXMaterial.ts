import TextureBase = require("../../../Core/Resources/Texture/TextureBase");
import IConfigureEventArgs = require("../../../Core/IConfigureEventArgs");
import IApplyMaterialArgument = require("../../../Core/Materials/Base/IApplyMaterialArgument");
import BasicMaterial = require("../../../Core/Materials/Base/BasicMaterial");
import Material = require("../../../Core/Materials/Material");
import Geometry = require("../../../Core/Geometries/Base/Geometry");
import Vector4 = require("../../../Math/Vector4");
import Color4 = require("../../../Math/Color4");
import Color3 = require("../../../Math/Color3");
import PMX = require("../../PMXLoader");
import Texture = require("../../../Core/Resources/Texture/Texture");
import PMXModel = require("./../PMXModel");
import PmxMaterialMorphParamContainer = require("./../PMXMaterialMorphParamContainer");
import ResourceManager = require("../../../Core/ResourceManager");
import ContextComponents = require("../../../ContextComponents");
import JThreeContext = require("../../../JThreeContext");

/**
 * the materials for PMX.
 */
class PMXMaterial extends Material {
  protected __innerMaterial: BasicMaterial;

  private _verticiesCount;

  private _verticiesOffset;

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
    return this.parentModel;
  }

  public get Diffuse(): Color4 {
    return this.diffuse;
  }

  public get Texture() {
    return this.texture;
  }

  public get Sphere() {
    return this.sphere;
  }


  public get SphereMode() {
    return this.sphereMode;
  }

  public get Specular() {
    return this.specular;
  }

  private ambient: Color3;

  private diffuse: Color4;

  public edgeColor: Color4 = null;

  private edgeSize: number;

  private sphere: TextureBase = null;

  private texture: TextureBase = null;

  private toon: TextureBase = null;

  private pmxData: PMX;

  private parentModel: PMXModel;

  private sphereMode: number;

  public materialIndex: number;

  public cullEnabled: boolean;

  private specular: Vector4;

  public Name: string;

  public addMorphParam: PmxMaterialMorphParamContainer;

  public mulMorphParam: PmxMaterialMorphParamContainer;

  private textureCaches: HTMLImageElement[] = [];

  public getPassCount(techniqueIndex: number): number {
    return this.edgeColor == null ? 1 : 2;
  }

  public get SelfShadow(): boolean {
    return (this.pmxData.Materials[this.materialIndex].drawFlag & 0x04) > 0;
  }

  constructor(pmx: PMXModel, index: number, offset: number) {
    super();
    this.addMorphParam = new PmxMaterialMorphParamContainer(1);
    this.mulMorphParam = new PmxMaterialMorphParamContainer(0);
    this.parentModel = pmx;
    this.pmxData = pmx.ModelData;
    this.materialIndex = index;
    var materialData = this.pmxData.Materials[index];
    this._verticiesCount = materialData.vertexCount;
    this._verticiesOffset = offset;
    this.Name = materialData.materialName;
    this.cullEnabled = !((materialData.drawFlag & 0x01) > 0); // each side draw flag
    this.ambient = new Color3(materialData.ambient[0], materialData.ambient[1], materialData.ambient[2]);
    this.diffuse = new Color4(materialData.diffuse[0], materialData.diffuse[1], materialData.diffuse[2], materialData.diffuse[3]);
    if ((materialData.drawFlag & 0x10) > 0) this.edgeColor = new Color4(materialData.edgeColor[0], materialData.edgeColor[1], materialData.edgeColor[2], materialData.edgeColor[3]);
    this.specular = new Vector4(materialData.specular);
    this.edgeSize = materialData.edgeSize;
    this.sphereMode = materialData.sphereMode;
    this.__innerMaterial = new BasicMaterial(require("../../Materials/Forward.html"));
    const tm = this.parentModel.pmxTextureManager;
    tm.loadTexture(materialData.sphereTextureIndex).then((texture) => {
      this.sphere = texture;
    });
    tm.loadTexture(materialData.textureIndex).then((texture) => {
      this.texture = texture;
    });
    if (materialData.sharedToonFlag === 0) { // not shared texture
      tm.loadTexture(materialData.targetToonIndex).then((texture) => {
        this.toon = texture;
      });
    } else {
      this.toon = this.loadSharedTexture(materialData.targetToonIndex);
    }
    this.setLoaded();
    this.__innerMaterial.on("configure", (v: IConfigureEventArgs) => {
      if (v.passIndex === 0) {
        v.configure.cullOrientation = this.cullEnabled ? "BACK" : "NONE";
      }
    });
  }

  public apply(matArg: IApplyMaterialArgument): void {
    const skeleton = this.parentModel.skeleton;
    if (matArg.passIndex === 1) {
      this.__innerMaterial.materialVariables = {
        boneCount: skeleton.BoneCount,
        boneMatriciesTexture: skeleton.MatrixTexture,
        edgeSize: PmxMaterialMorphParamContainer.calcMorphedSingleValue(this.edgeSize, this.addMorphParam, this.mulMorphParam, (t) => t.edgeSize),
        edgeColor: PmxMaterialMorphParamContainer.calcMorphedVectorValue(this.edgeColor.toVector(), this.addMorphParam, this.mulMorphParam, (t) => t.edgeColor, 4)
      };
    } else {
      this.__innerMaterial.materialVariables = {
        boneCount: skeleton.BoneCount,
        boneMatriciesTexture: skeleton.MatrixTexture,
        texture: this.texture,
        toon: this.toon,
        sphere: this.sphere,
        diffuse: this.diffuse.toVector(),
        specular: this.specular,
        ambient: this.ambient.toVector(),
        textureUsed: !this.texture ? 0 : 1,
        sphereMode: !this.sphere ? 0 : this.sphereMode,
        toonFlag: !this.toon ? 0 : 1,
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

  private loadSharedTexture(index: number): Texture {
    if (index < 0) return null;
    const rm = JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
    const resName = "jthree.pmx.sharedtoon." + index;
    if (rm.getTexture(resName)) {
      return <Texture>rm.getTexture(resName);
    } else {
      const tex = rm.createTextureWithSource(resName, this.parentModel.pmxTextureManager.generateSharedToonImg(index));
      return tex;
    }
  }


  public get Priorty(): number {
    return 100 + this.materialIndex;
  }

  public getDrawGeometryLength(geo: Geometry): number {
    return this.diffuse.A > 0 ? this.VerticiesCount : 0;
  }

  public getDrawGeometryOffset(geo: Geometry): number {
    return this.VerticiesOffset * 4;
  }
}

export = PMXMaterial;
