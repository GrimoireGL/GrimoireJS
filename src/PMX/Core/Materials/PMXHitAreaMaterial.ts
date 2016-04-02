import BasicMaterial from "../../../Core/Materials/BasicMaterial";
import IApplyMaterialArgument from "../../../Core/Materials/IApplyMaterialArgument";
import Geometry from "../../../Core/Geometries/Base/Geometry";
import PMXMaterial from "./PMXMaterial";
import Vector4 from "../../../Math/Vector4";
/**
 * the materials for PMX.
 */
class PMXHitAreaMaterial extends BasicMaterial {
  protected __associatedMaterial: PMXMaterial;

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

  constructor(material: PMXMaterial) {
    super(require("../../Materials/HitAreaTest.xmml"), "pmx.hitarea");
    this.__associatedMaterial = material;
  }

  public apply(matArg: IApplyMaterialArgument): void {
    const r = 0xFF00 & (matArg.renderStage as any).objectIndex;
    const g = 0x00FF & (matArg.renderStage as any).objectIndex;
    const b = 0xFF & this.__associatedMaterial.materialIndex;
    const skeleton = this.__associatedMaterial.ParentModel.skeleton;
    this.shaderVariables = {
      boneCount: skeleton.BoneCount,
      boneMatriciesTexture: skeleton.MatrixTexture,
      indexColor: new Vector4(r / 0xFF, g / 0xFF, b / 0xFF, 1)
    };
    super.apply(matArg);
  }

  public getDrawGeometryLength(geo: Geometry): number {
    return this.__associatedMaterial.Diffuse.A > 0 ? this.VerticiesCount : 0;
  }

  public getDrawGeometryOffset(geo: Geometry): number {
    return this.VerticiesOffset * 4;
  }
}

export default PMXHitAreaMaterial;
