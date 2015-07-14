import Material = require("./../Material");
import Program = require("../../Resources/Program/Program");
import JThreeContextProxy = require("../../JThreeContextProxy");
import JThreeContext = require("../../JThreeContext");
import Shader = require("../../Resources/Shader/Shader");
import ShaderType = require("../../../Wrapper/ShaderType");
import RendererBase = require("../../Renderers/RendererBase");
import Geometry = require("../../Geometries/Geometry");
import SceneObject = require("../../SceneObject");
import Vector3 = require("../../../Math/Vector3");
import Vector4 = require('../../../Math/Vector4');
import Matrix = require("../../../Math/Matrix");
import PrimitiveTopology = require("../../../Wrapper/PrimitiveTopology");
import Quaternion = require("../../../Math/Quaternion");
import Color4 = require("../../../Base/Color/Color4");
import Color3 = require('../../../Base/Color/Color3');
import GLCullMode = require("../../../Wrapper/GLCullMode");
import GLFeatureType = require("../../../Wrapper/GLFeatureType");
import TextureRegister = require('../../../Wrapper/Texture/TextureRegister');
import TextureBase = require('../../Resources/Texture/TextureBase');
import TargetTextureType = require('../../../Wrapper/TargetTextureType');
import Scene = require('../../Scene');
import ResolvedChainInfo = require('../../Renderers/ResolvedChainInfo');
declare function require(string): string;

class DepthStageMaterial extends Material {

  get MaterialAlias(): string {
    return "jthree.materials.depth";
  }
  protected program: Program;
  constructor() {
    super();
    var vs = require('../Shaders/VertexShaders/BasicGeometries.glsl');
    var fs = require('../Shaders/Sprite.glsl');
    this.program = this.loadProgram("jthree.shaders.vertex.basic", "jthree.shaders.fragment.sprite", "jthree.programs.sprite", vs, fs);
    this.setLoaded();
  }

  configureMaterial(scene: Scene, renderer: RendererBase, object: SceneObject, texs: ResolvedChainInfo): void {
    super.configureMaterial(scene, renderer, object, texs);
    var geometry = object.Geometry;
    var programWrapper = this.program.getForContext(renderer.ContextManager);
    programWrapper.useProgram();
    var v = object.Transformer.calculateMVPMatrix(renderer);
    programWrapper.registerTexture(renderer, this.Texture, 0, "u_sampler");
    programWrapper.setAttributeVerticies("position", geometry.PositionBuffer.getForRenderer(renderer.ContextManager));
    programWrapper.setAttributeVerticies("normal", geometry.NormalBuffer.getForRenderer(renderer.ContextManager));
    programWrapper.setAttributeVerticies("uv", geometry.UVBuffer.getForRenderer(renderer.ContextManager));
    programWrapper.setUniformMatrix("matMVP", v);
    programWrapper.setUniformMatrix("matV", renderer.Camera.ViewMatrix);
    programWrapper.setUniformMatrix("matMV", Matrix.multiply(renderer.Camera.ViewMatrix, object.Transformer.LocalToGlobal));
    geometry.IndexBuffer.getForRenderer(renderer.ContextManager).bindBuffer();
  }
}

export =DepthStageMaterial;
