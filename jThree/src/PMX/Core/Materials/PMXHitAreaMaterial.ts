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
class PMXHitAreaMaterial extends Material
{
    protected program: Program;

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
        super();
        this.associatedMaterial = material;
        var vs = require('../../Shader/PMXHitAreaVertex.glsl');
        var fs = require('../../Shader/PMXHitAreaFragment.glsl');
        this.program = this.loadProgram("jthree.shaders.vertex.pmx.hitarea", "jthree.shaders.fragment.pmx.hitarea", "jthree.programs.pmx.hitarea", vs, fs);
        this.setLoaded();
    }

    public configureMaterial(matArg:IMaterialConfigureArgument): void {
        if (!this.program||this.associatedMaterial.Diffuse.A<1.0E-3) return;
        //super.configureMaterial(scene, renderStage, object, texs,techniqueIndex,passIndex);
        var r = 0xFF00 & (matArg.renderStage as any).___objectIndex;
        var g = 0x00FF & (matArg.renderStage as any).___objectIndex;
        var b = this.associatedMaterial.materialIndex;
        var renderer = matArg.renderStage.Renderer;
        const object = matArg.object;
        var geometry = <PMXGeometry>object.Geometry;
        var light = matArg.scene.LightRegister.shadowDroppableLights[matArg.techniqueIndex];
        var programWrapper = this.program.getForContext(renderer.ContextManager);
        programWrapper.register({
            attributes: {
                position: geometry.PositionBuffer,
                boneWeights: geometry.boneWeightBuffer,
                boneIndicies: geometry.boneIndexBuffer,
            },
            uniforms: {
                boneMatricies: { type: "texture", value: this.associatedMaterial.ParentModel.skeleton.MatrixTexture, register: 0 },
                matVP:{type:"matrix",value:renderer.Camera.viewProjectionMatrix},
                boneCount: { type: "float", value: this.associatedMaterial.ParentModel.skeleton.BoneCount },
                areaIndex:{type:"vector",value: new Vector4(r /0xFF,  g/0xFF, b / 0xFF, 1)}
            }
        });
        object.Geometry.bindIndexBuffer(renderer.ContextManager);
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

    public get MaterialGroup(): string
    {
        return "jthree.materials.hitarea";
    }
}

export =PMXHitAreaMaterial;
