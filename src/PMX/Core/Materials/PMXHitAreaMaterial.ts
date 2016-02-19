import BasicMaterial from "../../../Core/Materials/Base/BasicMaterial";
import IApplyMaterialArgument from "../../../Core/Materials/Base/IApplyMaterialArgument";
import Geometry from "../../../Core/Geometries/Base/Geometry";
import PMXMaterial from "./PMXMaterial";
import Vector4 from "../../../Math/Vector4";
/**
 * the materials for PMX.
 */
class PMXHitAreaMaterial extends BasicMaterial {
  protected associatedMaterial: PMXMaterial;

  /**
   * Count of verticies
   */
  public get VerticiesCount() {
    return this.associatedMaterial.VerticiesCount;
  }

  /**
   * Offset of verticies in index buffer
   */
  public get VerticiesOffset() {
    return this.associatedMaterial.VerticiesOffset;
  }

  constructor(material: PMXMaterial) {
    super(require("../../Materials/HitAreaTest.html"));
    this.associatedMaterial = material;
  }

  public apply(matArg: IApplyMaterialArgument): void {
    const r = 0xFF00 & (matArg.renderStage as any).___objectIndex;
    const g = 0x00FF & (matArg.renderStage as any).___objectIndex;
    const b = 0xFF & this.associatedMaterial.materialIndex;
    const skeleton = this.associatedMaterial.ParentModel.skeleton;
    this.materialVariables = {
      boneCount: skeleton.BoneCount,
      boneMatriciesTexture: skeleton.MatrixTexture,
      indexColor: new Vector4(r / 0xFF, g / 0xFF, b / 0xFF, 1)
    };
    super.apply(matArg);
  }

  public getDrawGeometryLength(geo: Geometry): number {
    return this.associatedMaterial.Diffuse.A > 0 ? this.VerticiesCount : 0;
  }

  public getDrawGeometryOffset(geo: Geometry): number {
    return this.VerticiesOffset * 4;
  }
}

export default PMXHitAreaMaterial;
