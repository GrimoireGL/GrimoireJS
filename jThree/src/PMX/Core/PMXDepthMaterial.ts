import Material = require('../../Core/Materials/Material');
import Program = require("../../Core/Resources/Program/Program");
import JThreeContextProxy = require("../../Core/JThreeContextProxy");
import JThreeContext = require("../../Core/JThreeContext");
import Shader = require("../../Core/Resources/Shader/Shader");
import ShaderType = require("../../Wrapper/ShaderType");
import RendererBase = require("../../Core/Renderers/RendererBase");
import Geometry = require("../../Core/Geometries/Geometry");
import SceneObject = require("../../Core/SceneObject");
import Vector3 = require("../../Math/Vector3");
import Vector4 = require('../../Math/Vector4');
import Matrix = require("../../Math/Matrix");
import PrimitiveTopology = require("../../Wrapper/PrimitiveTopology");
import Quaternion = require("../../Math/Quaternion");
import Color4 = require("../../Base/Color/Color4");
import Color3 = require('../../Base/Color/Color3');
import GLCullMode = require("../../Wrapper/GLCullMode");
import GLFeatureType = require("../../Wrapper/GLFeatureType");
import TextureRegister = require('../../Wrapper/Texture/TextureRegister');
import TextureBase = require('../../Core/Resources/Texture/TextureBase');
import Scene = require('../../Core/Scene');
import TargetTextureType = require('../../Wrapper/TargetTextureType');
import PMXMaterial = require('./PMXMaterial');
import ResolvedChainInfo = require('../../Core/Renderers/ResolvedChainInfo');
import PMXMaterialData = require('../PMXMaterial');
import PMX = require('../PMXLoader');
import Texture = require('../../Core/Resources/Texture/Texture');
import BlendFuncParamType = require("../../Wrapper/BlendFuncParamType");
import PMXGeometry = require('./PMXGeometry');
import PMXModel = require('./PMXModel');
import Delegates = require('../../Base/Delegates');
declare function require(string): string;
/**
 * the materials for PMX.
 */
class PMXDepthMaterial extends Material {
    protected program: Program;

    protected associatedMaterial:PMXMaterial;
    
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


    public get PassCount(): number {
        return 1;
    }

    constructor(material:PMXMaterial) {
        super();
        this.associatedMaterial=material;
        var vs = require('../Shader/PMXDepthVertex.glsl');
        var fs = require('../Shader/PMXDepthFragment.glsl');
        this.program = this.loadProgram("jthree.shaders.vertex.pmx.depth", "jthree.shaders.fragment.pmx.depth", "jthree.programs.pmx.depth", vs, fs);
        this.setLoaded();
    }

    configureMaterial(scene: Scene, renderer: RendererBase, object: SceneObject, texs: ResolvedChainInfo, pass?: number): void {
        if (!this.program) return;
        super.configureMaterial(scene, renderer, object, texs);
        renderer.GLContext.Disable(GLFeatureType.Blend);
        var id = renderer.ID;
        var geometry = <PMXGeometry>object.Geometry;
        var programWrapper = this.program.getForContext(renderer.ContextManager);
        programWrapper.useProgram();
        var v = object.Transformer.calculateMVPMatrix(renderer);
        programWrapper.registerTexture(renderer, this.associatedMaterial.ParentModel.Skeleton.MatrixTexture, 4, "u_boneMatricies");
        programWrapper.setAttributeVerticies("position", geometry.PositionBuffer.getForRenderer(renderer.ContextManager));
        programWrapper.setAttributeVerticies("boneWeights", geometry.boneWeightBuffer.getForRenderer(renderer.ContextManager));
        programWrapper.setAttributeVerticies("boneIndicies", geometry.boneIndexBuffer.getForRenderer(renderer.ContextManager));
       // programWrapper.setUniformMatrix("matMVP", v);
        programWrapper.setUniformMatrix("matVP", Matrix.multiply(renderer.Camera.ProjectionMatrix, renderer.Camera.ViewMatrix));
        programWrapper.setUniform1f("u_boneCount", this.associatedMaterial.ParentModel.Skeleton.BoneCount);
        geometry.bindIndexBuffer(renderer.ContextManager);
    }

    public get Priorty(): number {
        return 100;
    }

    public getDrawGeometryLength(geo: Geometry): number {
        return this.VerticiesCount;
    }

    public getDrawGeometryOffset(geo: Geometry): number {
        return this.VerticiesOffset*4;
    }
    
      get MaterialGroup(): string {
    return "jthree.materials.depth";
  }
}

export =PMXDepthMaterial;