import Material = require("./Material");
import Program = require("../Resources/Program/Program");
import JThreeContextProxy = require("../JThreeContextProxy");
import JThreeContext = require("../JThreeContext");
import Shader = require("../Resources/Shader/Shader");
import ShaderType = require("../../Wrapper/ShaderType");
import RendererBase = require("../Renderers/RendererBase");
import Geometry = require("../Geometries/Geometry");
import SceneObject = require("../SceneObject");
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
import TextureBase = require('../Resources/Texture/TextureBase');
import TargetTextureType = require('../../Wrapper/TargetTextureType');
import Scene=require('../Scene');
import agent = require('superagent');
declare function require(string): string;

class LightaccumulationMaterial extends Material {

  private program: Program;

  private rb1: TextureBase;

  private rb2: TextureBase;

  private depth: TextureBase;
  
  private time:number;

  constructor(rb1: TextureBase, rb2: TextureBase, depth: TextureBase) {
    super();
    this.rb1 = rb1;
    this.rb2 = rb2;
    this.depth = depth;
    var vs = require('../Shaders/VertexShaders/PostEffectGeometries.glsl');
    agent.get("http://localhost:8080/LightAccumulation.glsl").end((err,res:agent.Response)=>
      {
     this.program = this.loadProgram("jthree.shaders.vertex.post", "jthree.shaders.fragment.deffered.lightaccum", "jthree.programs.deffered.light", vs, res.text);       
      });

  }
  

  registerTexture(renderer: RendererBase, tex: TextureBase, texNumber: number, samplerName: string) {
    renderer.ContextManager.Context.ActiveTexture(TextureRegister.Texture0 + texNumber);
    tex.getForContext(renderer.ContextManager).bind();
    this.program.getForContext(renderer.ContextManager).setUniform1i(samplerName, texNumber);
  }

  configureMaterial(scene:Scene,renderer: RendererBase, object: SceneObject): void {
    if(!this.program)return;
    super.configureMaterial(scene,renderer, object);
    var geometry = object.Geometry;
    var programWrapper = this.program.getForContext(renderer.ContextManager);
    programWrapper.useProgram();
    var jThreeContext: JThreeContext = JThreeContextProxy.getJThreeContext();
    var resourceManager = jThreeContext.ResourceManager;
    var ip=Matrix.inverse(renderer.Camera.ProjectionMatrix);
    programWrapper.setAttributeVerticies("position", geometry.PositionBuffer.getForRenderer(renderer.ContextManager));
    programWrapper.setAttributeVerticies("uv", geometry.UVBuffer.getForRenderer(renderer.ContextManager));
    programWrapper.setUniformVector("c_pos", renderer.Camera.Position);
    programWrapper.setUniformVector("c_dir", renderer.Camera.LookAt.subtractWith(renderer.Camera.Position).normalizeThis());
    this.registerTexture(renderer, this.rb1, 0, "rb1");
    this.registerTexture(renderer, this.rb2, 1, "rb2");
    this.registerTexture(renderer, this.depth, 2, "depth");
    var lpos=new Array(scene.PointLights.length);
    var lcol=new Array(scene.PointLights.length);
    for(var i =0; i<scene.PointLights.length;i++){
      lpos[i]=Matrix.transformPoint(renderer.Camera.ViewMatrix,scene.PointLights[i].Position);
      lcol[i]=scene.PointLights[i].Color.toVector();
    }
    programWrapper.setUniformVectorArray("l_pos",lpos);
    programWrapper.setUniformVectorArray("l_col",lcol);
    programWrapper.setUniformMatrix("matIP",ip);
    programWrapper.setUniform1f("time",(new Date()).getMilliseconds()+1000*(new Date().getSeconds()));
    geometry.IndexBuffer.getForRenderer(renderer.ContextManager).bindBuffer();

  }
}

export =LightaccumulationMaterial;
