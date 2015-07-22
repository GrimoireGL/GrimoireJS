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
import Scene = require('../Scene');
import TargetTextureType = require('../../Wrapper/TargetTextureType');
import agent = require('superagent');
import ResolvedChainInfo = require('../Renderers/ResolvedChainInfo');
declare function require(string): string;

class PhongMaterial extends Material {
  private diffuse = Color4.parseColor('#F0F');

  get Diffuse(): Color4 {
    return this.diffuse;
  }

  set Diffuse(col: Color4) {
    this.diffuse = col;
  }

  private ambient = Color4.parseColor('#F0F');

  get Ambient(): Color4 {
    return this.ambient;
  }

  set Ambient(col: Color4) {
    this.ambient = col;
  }

  private specular = Color3.parseColor('#F0F');
  get Specular(): Color3 {
    return this.specular;
  }

  set Specular(col: Color3) {
    this.specular = col;
  }

  private specularCoefficient = 10;

  get SpecularCoefficient(): number {
    return this.specularCoefficient;
  }

  set SpecularCoefficient(val: number) {
    this.specularCoefficient = val;
  }

  private texture: TextureBase=null;

  get Texture(): TextureBase {
    return this.texture;
  }

  set Texture(tex: TextureBase) {
    this.texture = tex;
  }

  protected program: Program;
  constructor() {
    super();
    var jThreeContext: JThreeContext = JThreeContextProxy.getJThreeContext();
    var vs = require('../Shaders/VertexShaders/BasicGeometries.glsl');
    var fs = require('../Shaders/Phong.glsl');
    this.program = this.loadProgram("jthree.shaders.vertex.basic", "jthree.shaders.fragment.phong", "jthree.programs.phong", vs, fs);
    this.setLoaded();
  }

  configureMaterial(scene: Scene, renderer: RendererBase, object: SceneObject,texs:ResolvedChainInfo): void {
    if (!this.program) return;
    super.configureMaterial(scene, renderer, object,texs);
    var geometry = object.Geometry;
    var pw = this.program.getForContext(renderer.ContextManager);
    pw.useProgram();
    var v = object.Transformer.calculateMVPMatrix(renderer);
    pw.registerTexture(renderer,this.Texture,0,"u_texture");
    pw.registerTexture(renderer, texs["LIGHT"], 1, "u_sampler");
    pw.setUniform1i("u_textureUsed",<number>this.Texture!=null);
    pw.setAttributeVerticies("position", geometry.PositionBuffer.getForRenderer(renderer.ContextManager));
    pw.setAttributeVerticies("normal", geometry.NormalBuffer.getForRenderer(renderer.ContextManager));
    pw.setAttributeVerticies("uv", geometry.UVBuffer.getForRenderer(renderer.ContextManager));
    pw.setUniformMatrix("matMVP", v);
    pw.setUniformMatrix("matV", renderer.Camera.ViewMatrix);
    pw.setUniformMatrix("matMV", Matrix.multiply(renderer.Camera.ViewMatrix, object.Transformer.LocalToGlobal));
    pw.setUniformVector("u_ambient", this.Ambient.toVector());
    pw.setUniformVector("u_diffuse", this.Diffuse.toVector());
    pw.setUniformVector("u_specular",this.Specular.toVector4(this.specularCoefficient));
    pw.setUniformVector("u_DirectionalLight", new Vector3(0, 0, -1));
    geometry.IndexBuffer.getForRenderer(renderer.ContextManager).bindBuffer();
  }
}

export =PhongMaterial;
