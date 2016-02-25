import IApplyMaterialArgument from "../../../Core/Materials/Base/IApplyMaterialArgument";
import BasicMaterial from "../../../Core/Materials/Base/BasicMaterial";
﻿import Material from "../../../Core/Materials/Material";
import Geometry from "../../../Core/Geometries/Base/Geometry";
import PMXMaterial from "./PMXMaterial";
import Vector4 from "../../../Math/Vector4";
import PMXMaterialParamContainer from "./../PMXMaterialMorphParamContainer";
/**
 * the materials for PMX.
 */
class PMXGBufferMaterial extends Material {

  protected __primaryMaterial: BasicMaterial;

  protected __secoundaryMaterial: BasicMaterial;

  protected __thirdMaterial: BasicMaterial;

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
    super();
    this.associatedMaterial = material;
    this.__primaryMaterial = new BasicMaterial(require("../../Materials/PrimaryBuffer.html"));
    this.__secoundaryMaterial = new BasicMaterial(require("../../Materials/SecoundaryBuffer.html"));
    this.__thirdMaterial = new BasicMaterial(require("../../Materials/ThirdBuffer.html"));
    this.__setLoaded();
  }

  public apply(matArg: IApplyMaterialArgument): void {
    if (this.associatedMaterial.Diffuse.A < 1.0E-3) {
      return;
    }
    const skeleton = this.associatedMaterial.ParentModel.skeleton;
    switch (matArg.techniqueIndex) {
      case 0:
        this.__primaryMaterial.materialVariables = {
          boneMatriciesTexture: skeleton.MatrixTexture,
          brightness: this.associatedMaterial.Specular.W,
          boneCount: skeleton.BoneCount
        };
        this.__primaryMaterial.apply(matArg);
        break;
      case 1:
        this.__secoundaryMaterial.materialVariables = {
          boneMatriciesTexture: skeleton.MatrixTexture,
          boneCount: skeleton.BoneCount,
          diffuse: PMXMaterialParamContainer.calcMorphedVectorValue(this.associatedMaterial.Diffuse.toVector(), this.associatedMaterial.addMorphParam, this.associatedMaterial.mulMorphParam, (t) => t.diffuse, 4),
          texture: this.associatedMaterial.Texture,
          sphere: this.associatedMaterial.Sphere,
          textureUsed: this.associatedMaterial.Texture ? 1 : 0,
          sphereMode: this.associatedMaterial.Sphere ? this.associatedMaterial.SphereMode : 0,
          addTextureCoefficient: new Vector4(this.associatedMaterial.addMorphParam.textureCoeff),
          mulTextureCoefficient: new Vector4(this.associatedMaterial.mulMorphParam.textureCoeff),
          addSphereCoefficient: new Vector4(this.associatedMaterial.addMorphParam.sphereCoeff),
          mulSphereCoefficient: new Vector4(this.associatedMaterial.mulMorphParam.sphereCoeff)
        };
        this.__secoundaryMaterial.apply(matArg);
        break;
      case 2:
        this.__thirdMaterial.materialVariables = {
          boneMatriciesTexture: skeleton.MatrixTexture,
          boneCount: skeleton.BoneCount,
          specular: PMXMaterialParamContainer.calcMorphedVectorValue(this.associatedMaterial.Specular, this.associatedMaterial.addMorphParam, this.associatedMaterial.mulMorphParam, (t) => t.specular, 3)
        };
        this.__thirdMaterial.apply(matArg);
        break;
    }
  }


  public get Priorty(): number {
    return 100;
  }

  public getDrawGeometryLength(geo: Geometry): number {
    return this.associatedMaterial.Diffuse.A > 0 ? this.VerticiesCount : 0;
  }

  public getDrawGeometryOffset(geo: Geometry): number {
    return this.VerticiesOffset * 4;
  }

  public get MaterialGroup(): string {
    return "jthree.materials.gbuffer";
  }
}

export default PMXGBufferMaterial;
