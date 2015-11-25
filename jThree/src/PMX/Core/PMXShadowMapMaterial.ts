import Material = require('../../Core/Materials/Material');
import Program = require("../../Core/Resources/Program/Program");
import RendererBase = require("../../Core/Renderers/RendererBase");
import Geometry = require("../../Core/Geometries/Geometry");
import SceneObject = require("../../Core/SceneObject");
import Matrix = require("../../Math/Matrix");
import GLFeatureType = require("../../Wrapper/GLFeatureType");
import Scene = require('../../Core/Scene');
import PMXMaterial = require('./PMXMaterial');
import ResolvedChainInfo = require('../../Core/Renderers/ResolvedChainInfo');
import PMXGeometry = require('./PMXGeometry');
import Vector4 = require("../../Math/Vector4");
import PMXMaterialParamContainer = require("./PMXMaterialMorphParamContainer");
import IMaterialConfig = require("../../Core/Materials/IMaterialConfig");
declare function require(string): string;
/**
 * the materials for PMX.
 */
class PMXShadowMapMaterial extends Material
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
        var vs = require('../Shader/PMXShadowMapVertex.glsl');
        var fs = require('../Shader/PMXShadowMapFragment.glsl');
        this.program = this.loadProgram("jthree.shaders.vertex.pmx.shadowmap", "jthree.shaders.fragment.pmx.shadowmap", "jthree.programs.pmx.shadowmap", vs, fs);
        this.setLoaded();
    }

    public configureMaterial(scene: Scene, renderer: RendererBase, object: SceneObject, texs: ResolvedChainInfo,techniqueIndex:number,passIndex:number): void {
        if (!this.program||this.associatedMaterial.Diffuse.A<1.0E-3) return;
        super.configureMaterial(scene, renderer, object, texs,techniqueIndex,passIndex);
        var geometry = <PMXGeometry>object.Geometry;
        var light = scene.LightRegister.shadowDroppableLights[techniqueIndex];
        var programWrapper = this.program.getForContext(renderer.ContextManager);
        programWrapper.register({
            attributes: {
                position: geometry.PositionBuffer,
                boneWeights: geometry.boneWeightBuffer,
                boneIndicies: geometry.boneIndexBuffer,
            },
            uniforms: {
                boneMatricies: { type: "texture", value: this.associatedMaterial.ParentModel.skeleton.MatrixTexture, register: 0 },
                matLVP:{type:"matrix",value:light.matLightViewProjection},
                boneCount: { type: "float", value: this.associatedMaterial.ParentModel.skeleton.BoneCount }
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
        return "jthree.materials.shadowmap";
    }
}

export =PMXShadowMapMaterial;
