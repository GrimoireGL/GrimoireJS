import Geometry from "../../../Core/Geometries/Base/Geometry";
import PMXMaterial from "./PMXMaterial";
import IApplyMaterialArgument from "../../../Core/Materials/IApplyMaterialArgument";
import BasicMaterial from "../../../Core/Materials/BasicMaterial";
class PMXPrimaryBufferMaterial extends BasicMaterial {
  private _associatedMaterial: PMXMaterial;

  constructor(material: PMXMaterial) {
    super(require("../../Materials/PrimaryBuffer.xmml"));
    this._associatedMaterial = material;
  }

  public apply(matArg: IApplyMaterialArgument): void {
    if (this._associatedMaterial.Diffuse.A < 1.0E-3) {
      return;
    }
    const skeleton = this._associatedMaterial.ParentModel.skeleton;
    this.shaderVariables = {
      boneMatriciesTexture: skeleton.MatrixTexture,
      brightness: this._associatedMaterial.Specular.W,
      boneCount: skeleton.BoneCount
    };
    super.apply(matArg);
  }

  /**
   * Count of verticies
   */
  public get VerticiesCount() {
    return this._associatedMaterial.VerticiesCount;
  }

  /**
   * Offset of verticies in index buffer
   */
  public get VerticiesOffset() {
    return this._associatedMaterial.VerticiesOffset;
  }

  public getDrawGeometryLength(geo: Geometry): number {
    return this._associatedMaterial.Diffuse.A > 0 ? this.VerticiesCount : 0;
  }

  public getDrawGeometryOffset(geo: Geometry): number {
    return this.VerticiesOffset * 4;
  }

}
export default PMXPrimaryBufferMaterial;
