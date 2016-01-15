import BasicMaterial = require("../../../Core/Materials/Base/BasicMaterial");
import IMaterialConfigureArgument = require("../../../Core/Materials/Base/IMaterialConfigureArgument");
import Material = require('../../../Core/Materials/Material');
import Program = require("../../../Core/Resources/Program/Program");
import BasicRenderer = require("../../../Core/Renderers/BasicRenderer");
import Geometry = require("../../../Core/Geometries/Base/Geometry");
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
import RenderStageBase = require("../../../Core/Renderers/RenderStages/RenderStageBase");
/**
 * the materials for PMX.
 */
class PMXHitAreaMaterial extends BasicMaterial
{
    protected associatedMaterial: PMXMaterial;

    /**
     * Count of verticies
     */
    public get VerticiesCount()
    {
        return this.associatedMaterial.VerticiesCount;
    }

    /**
     * Offset of verticies in index buffer
     */
    public get VerticiesOffset()
    {
        return this.associatedMaterial.VerticiesOffset;
    }

    public getMaterialConfig(pass:number,technique:number):IMaterialConfig
    {
      return {
        blend:false,
        cull:this.associatedMaterial.cullEnabled ? "ccw":undefined
      }
    }

    constructor(material: PMXMaterial)
    {
        super(require("../../Materials/HitAreaTest.html"));
        this.associatedMaterial = material;
        this.setLoaded();
    }

    public configureMaterial(matArg:IMaterialConfigureArgument): void {
        var r = 0xFF00 & (matArg.renderStage as any).___objectIndex;
        var g = 0x00FF & (matArg.renderStage as any).___objectIndex;
        var b = 0xFF & this.associatedMaterial.materialIndex;
        const skeleton = this.associatedMaterial.ParentModel.skeleton;
        this.materialVariables={
          boneCount:skeleton.BoneCount,
          boneMatriciesTexture:skeleton.MatrixTexture,
          indexColor:new Vector4(r /0xFF,  g/0xFF, b / 0xFF, 1)
        };
        super.configureMaterial(matArg);
    }

    public getDrawGeometryLength(geo: Geometry): number
    {
        return this.associatedMaterial.Diffuse.A > 0 ? this.VerticiesCount : 0;
    }

    public getDrawGeometryOffset(geo: Geometry): number
    {
        return this.VerticiesOffset * 4;
    }
}

export =PMXHitAreaMaterial;
