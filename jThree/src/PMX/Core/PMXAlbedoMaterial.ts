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
import PmxMaterialMorphParamContainer = require("./PMXMaterialMorphParamContainer");
import Vector4 = require("../../Math/Vector4");

declare function require(string): string;
/**
 * the materials for PMX.
 */
class PMXAlbedoMaterial extends Material
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
        var vs = require('../Shader/PMXVertex.glsl');
        var fs = require('../Shader/PMXAlbedoFragment.glsl');
        this.program = this.loadProgram("jthree.shaders.vertex.pmx.basic", "jthree.shaders.fragment.albedo", "jthree.programs.pmx.albedo", vs, fs);
        this.setLoaded();
    }

    public configureMaterial(scene: Scene, renderer: RendererBase, object: SceneObject, texs: ResolvedChainInfo, pass?: number): void
    {
        if (!this.program) return;
        super.configureMaterial(scene, renderer, object, texs);
        renderer.GLContext.Disable(GLFeatureType.Blend);
        var geometry = <PMXGeometry>object.Geometry;
        var programWrapper = this.program.getForContext(renderer.ContextManager);
        var v = object.Transformer.calculateMVPMatrix(renderer);

        programWrapper.register({
            attributes: {
                position: geometry.PositionBuffer,
                normal: geometry.NormalBuffer,
                uv: geometry.UVBuffer,
                boneWeights: geometry.boneWeightBuffer,
                boneIndicies: geometry.boneIndexBuffer
            },
            uniforms: {
                u_boneMatricies: { type: "texture", value: this.associatedMaterial.ParentModel.Skeleton.MatrixTexture, register: 0 },
                matMVP: { type: "matrix", value: v },
                matVP: { type: "matrix", value: Matrix.multiply(renderer.Camera.ProjectionMatrix, renderer.Camera.ViewMatrix) },
                u_boneCount: { type: "float", value: this.associatedMaterial.ParentModel.Skeleton.BoneCount },
                matV: { type: "matrix", value: renderer.Camera.ViewMatrix },
                u_diffuse: {
                    type: "vector",
                    value: PmxMaterialMorphParamContainer.calcMorphedVectorValue(this.associatedMaterial.Diffuse.toVector(), this.associatedMaterial.addMorphParam, this.associatedMaterial.mulMorphParam, (t) => t.diffuse, 4)
                },
                u_texture: {
                    type: "texture",
                    value: this.associatedMaterial.Texture,
                    register: 1
                },
                u_sphere: {
                    type: "texture",
                    value: this.associatedMaterial.Sphere,
                    register: 2
                },
                u_textureUsed: {
                    type: "integer",
                    value: this.associatedMaterial.Texture == null || this.associatedMaterial.Texture.ImageSource == null ? 0 : 1
                },
                u_sphereMode: {
                    type: "integer",
                    value: this.associatedMaterial.Sphere == null || this.associatedMaterial.Sphere.ImageSource == null ? 0 : this.associatedMaterial.SphereMode
    },
                u_addTexCoeff: { type: "vector", value: new Vector4(this.associatedMaterial.addMorphParam.textureCoeff) },
                u_mulTexCoeff: { type: "vector", value: new Vector4(this.associatedMaterial.mulMorphParam.textureCoeff) },
                u_addSphereCoeff: { type: "vector", value: new Vector4(this.associatedMaterial.addMorphParam.sphereCoeff) },
                u_mulSphereCoeff: { type: "vector", value: new Vector4(this.associatedMaterial.mulMorphParam.sphereCoeff) }
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
        return "jthree.materials.albedo";
    }
}

export =PMXAlbedoMaterial;