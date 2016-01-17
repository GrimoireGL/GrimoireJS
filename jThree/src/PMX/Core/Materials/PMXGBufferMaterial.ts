import IMaterialConfigureArgument = require("../../../Core/Materials/Base/IMaterialConfigureArgument");
import BasicMaterial = require("../../../Core/Materials/Base/BasicMaterial");
﻿import Material = require('../../../Core/Materials/Material');
import Program = require("../../../Core/Resources/Program/Program");
import BasicRenderer = require("../../../Core/Renderers/BasicRenderer");
import Geometry = require("../../../Core/Geometries/Geometry");
import SceneObject = require("../../../Core/SceneObject");
import Matrix = require("../../../Math/Matrix");
import GLFeatureType = require("../../../Wrapper/GLFeatureType");
import Scene = require('../../../Core/Scene');
import PMXMaterial = require('./PMXMaterial');
import ResolvedChainInfo = require('../../../Core/Renderers/ResolvedChainInfo');
import PMXGeometry = require('./../PMXGeometry');
import Vector4 = require("../../../Math/Vector4");
import PMXMaterialParamContainer = require("./../PMXMaterialMorphParamContainer");
import IMaterialConfig = require("../../../Core/Materials/IMaterialConfig");
import Vector3 = require("../../../Math/Vector3");
import RenderStageBase = require("../../../Core/Renderers/RenderStages/RenderStageBase");
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
        this.setLoaded();
    }

    public configureMaterial(matArg:IMaterialConfigureArgument): void {
        if (this.associatedMaterial.Diffuse.A < 1.0E-3) return;
        const skeleton = this.associatedMaterial.ParentModel.skeleton;
        switch (matArg.techniqueIndex) {
            case 0:
                this.__primaryMaterial.materialVariables = {
                    boneMatriciesTexture: skeleton.MatrixTexture,
                    brightness: this.associatedMaterial.Specular.W,
                    boneCount: skeleton.BoneCount
                };
                this.__primaryMaterial.configureMaterial(matArg);
                break;
            case 1:
                this.__secoundaryMaterial.materialVariables = {
                  boneMatriciesTexture: skeleton.MatrixTexture,
                  boneCount: skeleton.BoneCount,
                  diffuse: PMXMaterialParamContainer.calcMorphedVectorValue(this.associatedMaterial.Diffuse.toVector(), this.associatedMaterial.addMorphParam, this.associatedMaterial.mulMorphParam, (t) => t.diffuse, 4),
                  texture: this.associatedMaterial.Texture,
                  sphere: this.associatedMaterial.Sphere,
                  textureUsed: this.associatedMaterial.Texture == null || this.associatedMaterial.Texture.ImageSource == null ? 0 : 1,
                  sphereMode: this.associatedMaterial.Sphere == null || this.associatedMaterial.Sphere.ImageSource == null ? 0 : this.associatedMaterial.SphereMode,
                  addTextureCoefficient: new Vector4(this.associatedMaterial.addMorphParam.textureCoeff),
                  mulTextureCoefficient: new Vector4(this.associatedMaterial.mulMorphParam.textureCoeff),
                  addSphereCoefficient: new Vector4(this.associatedMaterial.addMorphParam.sphereCoeff),
                  mulSphereCoefficient: new Vector4(this.associatedMaterial.mulMorphParam.sphereCoeff)
                };
                this.__secoundaryMaterial.configureMaterial(matArg);
                break;
            case 2:
                this.__thirdMaterial.materialVariables = {
                    boneMatriciesTexture: skeleton.MatrixTexture,
                    boneCount: skeleton.BoneCount,
                    specular: PMXMaterialParamContainer.calcMorphedVectorValue(this.associatedMaterial.Specular, this.associatedMaterial.addMorphParam, this.associatedMaterial.mulMorphParam, (t) => t.specular, 3)
                };
                this.__thirdMaterial.configureMaterial(matArg);
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

    public getMaterialConfig(pass: number, technique: number): IMaterialConfig {
       if (technique == 0) {
           return {
               blend: false,
               cull: "ccw"
           }
       }
       if (technique == 1) {
           return {
               cull: "ccw",
               blend: true
           }
       } else {
           return {
               cull: "ccw",
               blend: false
           }
       }
   }
}

export =PMXGBufferMaterial;
