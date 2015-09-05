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

declare function require(string): string;
/**
 * the materials for PMX.
 */
class PMXDepthMaterial extends Material
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


    public get PassCount(): number
    {
        return 1;
    }

    constructor(material: PMXMaterial)
    {
        super();
        this.associatedMaterial = material;
        var vs = require('../Shader/PMXGBufferVertex.glsl');
        var fs = require('../../Core/Shaders/GBuffer/PrimaryFragment.glsl');
        this.program = this.loadProgram("jthree.shaders.vertex.pmx.gbuffer", "jthree.shaders.fragment.gbuffer", "jthree.programs.pmx.gbuffer", vs, fs);
        this.setLoaded();
    }

    public configureMaterial(scene: Scene, renderer: RendererBase, object: SceneObject, texs: ResolvedChainInfo, pass?: number): void
    {
        if (!this.program) return;
        super.configureMaterial(scene, renderer, object, texs);
        renderer.GLContext.Disable(GLFeatureType.Blend);
        var geometry = <PMXGeometry>object.Geometry;
        var programWrapper = this.program.getForContext(renderer.ContextManager);
        var v = Matrix.multiply(renderer.Camera.ProjectionMatrix, renderer.Camera.ViewMatrix);
        programWrapper.register({
            attributes: {
                position: geometry.PositionBuffer,
                normal: geometry.NormalBuffer,
                boneWeights: geometry.boneWeightBuffer,
                boneIndicies: geometry.boneIndexBuffer
            },
            uniforms: {
                u_boneMatricies: { type: "texture", value: this.associatedMaterial.ParentModel.Skeleton.MatrixTexture, register: 0 },
                matVP: { type: "matrix", value: v },
                matV: { type: "matrix", value: Matrix.multiply(renderer.Camera.ViewMatrix, object.Transformer.LocalToGlobal) },
                specularCoefficient:{type:"float",value:1.0},//TODO fix this
                u_boneCount: { type: "float", value: this.associatedMaterial.ParentModel.Skeleton.BoneCount }            }
        });
        geometry.bindIndexBuffer(renderer.ContextManager);
    }

    public get Priorty(): number
    {
        return 100;
    }

    public getDrawGeometryLength(geo: Geometry): number
    {
        return this.VerticiesCount;
    }

    public getDrawGeometryOffset(geo: Geometry): number
    {
        return this.VerticiesOffset * 4;
    }

    public get MaterialGroup(): string
    {
        return "jthree.materials.gbuffer";
    }
}

export =PMXDepthMaterial;