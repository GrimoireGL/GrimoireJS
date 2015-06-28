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
import Vector2 = require('../../Math/Vector2');
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
import PointLight = require('../Light/PointLight');
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
    this.registerTexture(this.program,renderer, this.rb1, 0, "rb1");
    this.registerTexture(this.program,renderer, this.rb2, 1, "rb2");
    this.registerTexture(this.program,renderer, this.depth, 2, "depth");
    var plights=scene.getLights("jthree.lights.pointlight");
    var lpos=new Array(plights.length);
    var lcol=new Array(plights.length);
    var lcoef=new Array(plights.length);
    for(var i =0; i<plights.length;i++){
      var pl=<PointLight>plights[i];
      lpos[i]=Matrix.transformPoint(renderer.Camera.ViewMatrix,plights[i].Position);
      lcol[i]=plights[i].Color.toVector().multiplyWith(pl.Intensity);
      lcoef[i]=new Vector2(pl.Decay,pl.Distance);
      debugger;
    }
    programWrapper.setUniform1f("c_near",0.1);
    programWrapper.setUniform1f("c_far",5);
    programWrapper.setUniformVectorArray("pl_pos",lpos);
    programWrapper.setUniformVectorArray("pl_col",lcol);
    programWrapper.setUniformVectorArray("pl_coef",lcoef);
    programWrapper.setUniform1i("pl_count",plights.length);
    programWrapper.setUniformMatrix("matIP",ip);
    programWrapper.setUniform1f("time",(new Date()).getMilliseconds()+1000*(new Date().getSeconds()));
    programWrapper.setUniform1f("xtest",<number>new Number((<HTMLInputElement>document.getElementsByName("x").item(0)).value));
    programWrapper.setUniform1f("ztest",<number>new Number((<HTMLInputElement>document.getElementsByName("z").item(0)).value));
    geometry.IndexBuffer.getForRenderer(renderer.ContextManager).bindBuffer();

  }
}

export =LightaccumulationMaterial;
