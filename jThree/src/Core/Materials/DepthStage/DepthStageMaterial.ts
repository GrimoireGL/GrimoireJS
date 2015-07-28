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

  get MaterialGroup(): string {
    return "jthree.materials.depth";
  }
  
  protected program: Program;
  constructor() {
    super();
    var vs = require('../../Shaders/VertexShaders/DepthGeometries.glsl');
    var fs = require('../../Shaders/Depth/Depth.glsl');
    this.program = this.loadProgram("jthree.shaders.vertex.depth", "jthree.shaders.fragment.depth", "jthree.programs.depth", vs, fs);
    this.setLoaded();
  }

  configureMaterial(scene: Scene, renderer: RendererBase, object: SceneObject, texs: ResolvedChainInfo): void {
    super.configureMaterial(scene, renderer, object, texs);
    var geometry = object.Geometry;
    var programWrapper = this.program.getForContext(renderer.ContextManager);
    programWrapper.useProgram();
    var v = object.Transformer.calculateMVPMatrix(renderer);
    programWrapper.setAttributeVerticies("position", geometry.PositionBuffer.getForRenderer(renderer.ContextManager));
    programWrapper.setUniformMatrix("matMVP", v);
    console.log("model"+object.Transformer.LocalToGlobal.toMathematicaString());
        geometry.IndexBuffer.getForRenderer(renderer.ContextManager).bindBuffer();
  }
}

export =DepthStageMaterial;
