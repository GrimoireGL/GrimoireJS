import Material = require("./Material");
import Program = require("../Resources/Program/Program");
import RendererBase = require("../Renderers/RendererBase");
import SceneObject = require("../SceneObject");
import Matrix = require("../../Math/Matrix");
import TextureBase = require('../Resources/Texture/TextureBase');
import Scene = require('../Scene');
import ResolvedChainInfo = require('../Renderers/ResolvedChainInfo');
declare function require(string): string;

class SpriteMaterial extends Material {
  private texture: TextureBase;

    public get Texture(): TextureBase {
    return this.texture;
  }

    public set Texture(tex: TextureBase) {
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
    this.program = this.loadProgram("jthree.shaders.vertex.basic", "jthree.shaders.fragment.sprite", "jthree.programs.sprite", vs, fs);
    this.setLoaded();
  }

    public configureMaterial(scene: Scene, renderer: RendererBase, object: SceneObject, texs: ResolvedChainInfo): void {
    super.configureMaterial(scene, renderer, object, texs);
    var geometry = object.Geometry;
    var programWrapper = this.program.getForContext(renderer.ContextManager);
    programWrapper.useProgram();
    var v = object.Transformer.calculateMVPMatrix(renderer);
    programWrapper.registerTexture(renderer,this.Texture,0,"u_sampler");
    programWrapper.setAttributeVerticies("position", geometry.PositionBuffer.getForRenderer(renderer.ContextManager));
    programWrapper.setAttributeVerticies("normal", geometry.NormalBuffer.getForRenderer(renderer.ContextManager));
    programWrapper.setAttributeVerticies("uv", geometry.UVBuffer.getForRenderer(renderer.ContextManager));
    programWrapper.setUniformMatrix("matMVP", v);
    programWrapper.setUniformMatrix("matV", renderer.Camera.ViewMatrix);
    programWrapper.setUniformMatrix("matMV", Matrix.multiply(renderer.Camera.ViewMatrix, object.Transformer.LocalToGlobal));
    geometry.IndexBuffer.getForRenderer(renderer.ContextManager).bindBuffer();
    //gen ct matrix
    var ctM: Matrix = Matrix.zero();
    if (this.CTR < 4) ctM.setAt(this.CTR, 0, 1);
    if (this.CTG < 4) ctM.setAt(this.CTG, 1, 1);
    if (this.CTB < 4) ctM.setAt(this.CTB, 2, 1);
    if (this.CTA < 4) ctM.setAt(this.CTA, 3, 1);
    if (this.CTA < 4) {
      programWrapper.setUniform1i("additionA", 0);
    } else {
      programWrapper.setUniform1i("additionA", 1);
    }
    programWrapper.setUniformMatrix("ctM", ctM);
  }
}

export =SpriteMaterial;
