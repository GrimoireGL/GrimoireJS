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
declare function require(string): string;

class SpriteMaterial extends Material {
  private texture: TextureBase;

  get Texture(): TextureBase {
    return this.texture;
  }

  set Texture(tex: TextureBase) {
    debugger;
    this.texture = tex;
  }

  private ctR: number = 0;
  private ctG: number = 1;
  private ctB: number = 2;
  private ctA: number = 3;
  public get CTR(): number {
    return this.ctR;
  }

  public set CTR(ctr: number) {
    this.ctR = ctr;
  }

  public get CTG(): number {
    return this.ctG;
  }

  public set CTG(ctg: number) {
    this.ctG = ctg;
  }

  public get CTB(): number {
    return this.ctB;
  }

  public set CTB(ctb: number) {
    this.ctB = ctb;
  }

  public get CTA(): number {
    return this.ctA;
  }

  public set CTA(cta: number) {
    this.ctA = cta;
  }


  protected program: Program;
  constructor() {
    super();
    var vs = require('../Shaders/VertexShaders/BasicGeometries.glsl');
    var fs = require('../Shaders/Sprite.glsl');
    this.program=this.loadProgram("jthree.shaders.vertex.basic","jthree.shaders.fragment.sprite","jthree.programs.sprite",vs,fs);
  }

  configureMaterial(renderer: RendererBase, object: SceneObject): void {
    super.configureMaterial(renderer, object);
    var geometry = object.Geometry;
    var programWrapper = this.program.getForContext(renderer.ContextManager);
    programWrapper.useProgram();
    var v = this.CalculateMVPMatrix(renderer, object);
    var jThreeContext: JThreeContext = JThreeContextProxy.getJThreeContext();
    var resourceManager = jThreeContext.ResourceManager;
    var tex = this.Texture;
    renderer.ContextManager.Context.ActiveTexture(TextureRegister.Texture0);
    if (tex) tex.getForContext(renderer.ContextManager).bind();
    else renderer.GLContext.BindTexture(TargetTextureType.Texture2D, null);
    programWrapper.setAttributeVerticies("position", geometry.PositionBuffer.getForRenderer(renderer.ContextManager));
    programWrapper.setAttributeVerticies("normal", geometry.NormalBuffer.getForRenderer(renderer.ContextManager));
    programWrapper.setAttributeVerticies("uv", geometry.UVBuffer.getForRenderer(renderer.ContextManager));
    programWrapper.setUniformMatrix("matMVP", v);
    programWrapper.setUniformMatrix("matV", renderer.Camera.ViewMatrix);
    programWrapper.setUniformMatrix("matMV", Matrix.multiply(renderer.Camera.ViewMatrix, object.Transformer.LocalToGlobal));
    programWrapper.setUniform1i("u_sampler", 0);
    geometry.IndexBuffer.getForRenderer(renderer.ContextManager).bindBuffer();
    //gen ct matrix
    var ctM:Matrix = Matrix.zero();
    if(this.CTR<4)ctM.setAt(this.CTR,0,1);
    if(this.CTG<4)ctM.setAt(this.CTG,1,1);
    if(this.CTB<4)ctM.setAt(this.CTB,2,1);
    if(this.CTA<4)ctM.setAt(this.CTA,3,1);
    if(this.CTA<4)
    {
      programWrapper.setUniform1i("additionA",0);
    }else
    {
      programWrapper.setUniform1i("additionA",1);
    }
    programWrapper.setUniformMatrix("ctM", ctM);
  }
}

export =SpriteMaterial;
