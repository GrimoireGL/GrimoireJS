import BasicMaterial = require("../../../Core/Materials/Base/BasicMaterial");
import IMaterialConfigureArgument = require("../../../Core/Materials/Base/IMaterialConfigureArgument");
import Material = require('../../../Core/Materials/Material');
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
import RenderStageBase = require("../../../Core/Renderers/RenderStages/RenderStageBase");
/**
 * the materials for PMX.
 */
class PMXShadowMapMaterial extends BasicMaterial
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

    constructor(material: PMXMaterial)
    {
        super(require("../../Materials/ShadowMap.html"));
        this.associatedMaterial = material;
        this.setLoaded();
    }

    public configureMaterial(matArg:IMaterialConfigureArgument): void {
        if (this.associatedMaterial.Diffuse.A<1.0E-3) return;
        var light = matArg.scene.LightRegister.shadowDroppableLights[matArg.techniqueIndex];
        const skeleton = this.associatedMaterial.ParentModel.skeleton;
        this.materialVariables = {
           matL:light.matLightViewProjection,
           boneMatriciesTexture:skeleton.MatrixTexture,
           boneCount:skeleton.BoneCount
        };
        super.configureMaterial(matArg);
    }


    public get Priorty(): number
    {
        return 100;
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

export =PMXShadowMapMaterial;
