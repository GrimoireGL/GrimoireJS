import BasicMaterial from "../../../Core/Materials/BasicMaterial";
import IApplyMaterialArgument from "../../../Core/Materials/IApplyMaterialArgument";
import Geometry from "../../../Core/Geometries/Base/Geometry";
import PMXMaterial from "./PMXMaterial";
/**
 * the materials for PMX.
 */
class PMXShadowMapMaterial extends BasicMaterial {
  protected __associatedMaterial: PMXMaterial;

  constructor(material: PMXMaterial) {
    super(require("../../Materials/ShadowMap.xmml"), "pmx.shadowmap");
    this.__associatedMaterial = material;
    this.__setLoaded();
  }

  /**
   * Count of verticies
   */
  public get VerticiesCount() {
    return this.__associatedMaterial.VerticiesCount;
  }

  /**
   * Offset of verticies in index buffer
   */
  public get VerticiesOffset() {
    return this.__associatedMaterial.VerticiesOffset;
  }

  public apply(matArg: IApplyMaterialArgument): void {
    if (this.__associatedMaterial.Diffuse.A < 1.0E-3) {
      return;
    }
    // var light = matArg.scene.LightRegister.shadowDroppableLights[matArg.techniqueIndex];
    // const skeleton = this.associatedMaterial.ParentModel.skeleton;
    // this.shaderVariables = {
    //    matL:light.matLightViewProjection,
    //    boneMatriciesTexture:skeleton.MatrixTexture,
    //    boneCount:skeleton.BoneCount
    // };
    super.apply(matArg);
  }


  public get Priorty(): number {
    return 100;
  }

  public getDrawGeometryLength(geo: Geometry): number {
    return this.__associatedMaterial.Diffuse.A > 0 ? this.VerticiesCount : 0;
  }

  public getDrawGeometryOffset(geo: Geometry): number {
    return this.VerticiesOffset * 4;
  }
}

export default PMXShadowMapMaterial;
