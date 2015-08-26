import Material = require("./Material");
import Program = require("../Resources/Program/Program");
import JThreeContextProxy = require("../JThreeContextProxy");
import JThreeContext = require("../JThreeContext");
import RendererBase = require("../Renderers/RendererBase");
import SceneObject = require("../SceneObject");
import Vector3 = require("../../Math/Vector3");
import Matrix = require("../../Math/Matrix");
import Color4 = require("../../Base/Color/Color4");
import Color3 = require('../../Base/Color/Color3');
import TextureBase = require('../Resources/Texture/TextureBase');
import Scene = require('../Scene');
import ResolvedChainInfo = require('../Renderers/ResolvedChainInfo');
declare function require(string): string;

class PhongMaterial extends Material {
  private diffuse = Color4.parseColor('#F0F');

    public get Diffuse(): Color4 {
    return this.diffuse;
  }

    public set Diffuse(col: Color4) {
    this.diffuse = col;
  }

  private ambient = Color4.parseColor('#F0F');

    public get Ambient(): Color4 {
    return this.ambient;
  }

    public set Ambient(col: Color4) {
    this.ambient = col;
  }

  private specular = Color3.parseColor('#F0F');

    public get Specular(): Color3 {
    return this.specular;
  }

    public set Specular(col: Color3) {
    this.specular = col;
  }

  private specularCoefficient = 10;

    public get SpecularCoefficient(): number {
    return this.specularCoefficient;
  }

    public set SpecularCoefficient(val: number) {
    this.specularCoefficient = val;
  }

  private texture: TextureBase=null;

    public get Texture(): TextureBase {
    return this.texture;
  }

    public set Texture(tex: TextureBase) {
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

    public configureMaterial(scene: Scene, renderer: RendererBase, object: SceneObject,texs:ResolvedChainInfo): void {
    if (!this.program) return;
    super.configureMaterial(scene, renderer, object,texs);
    var geometry = object.Geometry;
    var pw = this.program.getForContext(renderer.ContextManager);
    var v = object.Transformer.calculateMVPMatrix(renderer);
        pw.register({
            attributes: {
                position: geometry.PositionBuffer,
                normal: geometry.NormalBuffer,
                uv:geometry.UVBuffer
            },
            uniforms: {
                matMVP: { type: "matrix", value: v },
                matV: { type: "matrix", value: renderer.Camera.ViewMatrix },
                matMV: { type: "matrix", value: Matrix.multiply(renderer.Camera.ViewMatrix, object.Transformer.LocalToGlobal) },
                u_texture: { type: "texture", register: 1, value: this.Texture },
                u_light: { type: "texture", register: 0, value: texs["LIGHT"] },
                u_ambient: { type: "vector", value: this.Ambient.toVector() },
                u_diffuse: { type: "vector", value: this.Diffuse.toVector() },
                u_specular: { type: "vector", value: this.Specular.toVector4(this.SpecularCoefficient) },
                u_textureUsed: { type: "integer", value: (this.Texture != null) ? 1 : 0 }
            }
        });
    geometry.IndexBuffer.getForRenderer(renderer.ContextManager).bindBuffer();
  }
}

export =PhongMaterial;
