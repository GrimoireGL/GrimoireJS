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
        var vs = require('../Shader/PMXNormalVertex.glsl');
        var fs = require('../../Core/Shaders/Deffered/NormalBuffer.glsl');
        this.program = this.loadProgram("jthree.shaders.vertex.pmx.normal", "jthree.shaders.fragment.normal", "jthree.programs.pmx.normal", vs, fs);
        this.setLoaded();
    }

    public configureMaterial(scene: Scene, renderer: RendererBase, object: SceneObject, texs: ResolvedChainInfo, pass?: number): void
    {
        if (!this.program) return;
        super.configureMaterial(scene, renderer, object, texs);
        renderer.GLContext.Disable(GLFeatureType.Blend);
        var id = renderer.ID;
        var geometry = <PMXGeometry>object.Geometry;
        var programWrapper = this.program.getForContext(renderer.ContextManager);
        programWrapper.useProgram();
        var v = object.Transformer.calculateMVPMatrix(renderer);
        programWrapper.register({
            attributes: {
                position: geometry.PositionBuffer,
                normal: geometry.NormalBuffer,
                boneWeights: geometry.boneWeightBuffer,
                boneIndicies: geometry.boneIndexBuffer
            },
            uniforms: {
                u_boneMatricies: { type: "texture", value: this.associatedMaterial.ParentModel.Skeleton.MatrixTexture, register: 0 },
                matVP: { type: "matrix", value: Matrix.multiply(renderer.Camera.ProjectionMatrix, renderer.Camera.ViewMatrix) },
                u_boneCount: { type: "float", value: this.associatedMaterial.ParentModel.Skeleton.BoneCount },
                matV: { type: "matrix", value: renderer.Camera.ViewMatrix }
            }
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
        return "jthree.materials.normal";
    }
}

export =PMXDepthMaterial;