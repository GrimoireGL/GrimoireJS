import RendererBase = require('../RendererBase');
import SceneObject = require('../../SceneObject');
import Material = require('../../Materials/Material');
import RenderStageBase = require('./RenderStageBase');
import TextureBase = require('./../../Resources/Texture/TextureBase');
import FBO = require('./../../Resources/FBO/FBO');
import JThreeContextProxy = require('../../JThreeContextProxy');
import FrameBufferAttachmentType = require('../../../Wrapper/FrameBufferAttachmentType');
import ClearTargetType = require("../../../Wrapper/ClearTargetType");
import TextureFormat = require('../../../Wrapper/TextureInternalFormatType');
import ElementFormat = require('../../../Wrapper/TextureType');
import TextureMinFilterType = require('../../../Wrapper/Texture/TextureMinFilterType');
import Scene = require('../../Scene');
import Program = require('../../Resources/Program/Program');
import QuadGeometry = require('../../Geometries/QuadGeometry');
import Mesh = require('../../../Shapes/Mesh');
import RBO = require('../../Resources/RBO/RBO');
import Matrix = require('../../../Math/Matrix');
import Vector3 = require('../../../Math/Vector3');
import Vector2 = require('../../../Math/Vector2');
import ResolvedChainInfo = require('../ResolvedChainInfo');
import PointLight = require('../../Light/PointLight');
import DirectionalLight = require('../../Light/DirectionalLight');
import agent = require('superagent');
import GLFeatureType = require("../../../Wrapper/GLFeatureType");
class LitghtAccumulationStage extends RenderStageBase {

  private program: Program;
  constructor(renderer: RendererBase) {
    super(renderer);
    var vs = require('../../Shaders/VertexShaders/PostEffectGeometries.glsl');
    var fs = require('../../Shaders/Deffered/LightAccumulation.glsl')
    this.program = this.loadProgram("jthree.shaders.vertex.post", "jthree.shaders.fragment.deffered.lightaccum", "jthree.programs.deffered.light", vs, fs);
  }


  public preBeginStage(scene: Scene, passCount: number, texs: ResolvedChainInfo) {
    this.bindAsOutBuffer(this.DefaultFBO, [
      { texture: texs["OUT"], target: 0 },
      { texture: this.DefaultRBO, type: "rbo", target: "depth", isOptional: true }
    ], () => {
      this.GLContext.ClearColor(0, 0, 0, 0);
      this.GLContext.Clear(ClearTargetType.ColorBits);
    });
  }

  public render(scene: Scene, object: SceneObject, passCount: number, texs: ResolvedChainInfo) {
    var geometry = object.Geometry;
    if (!geometry || !this.program) return;
    this.configureMaterial(scene, this.Renderer, new Mesh(geometry, null), texs);
    geometry.drawElements(this.Renderer.ContextManager, null);
    //this.rbLightFBO.getForContext(this.Renderer.ContextManager).unbind();
  }

  configureMaterial(scene: Scene, renderer: RendererBase, object: SceneObject, texs: ResolvedChainInfo): void {
    var geometry = object.Geometry;
    var programWrapper = this.program.getForContext(renderer.ContextManager);
    programWrapper.useProgram();
    var ip = Matrix.inverse(renderer.Camera.ProjectionMatrix);
    programWrapper.setAttributeVerticies("position", geometry.PositionBuffer.getForRenderer(renderer.ContextManager));
    programWrapper.setAttributeVerticies("uv", geometry.UVBuffer.getForRenderer(renderer.ContextManager));
    programWrapper.setUniformVector("c_pos", renderer.Camera.Position);
    programWrapper.setUniformVector("c_dir", renderer.Camera.LookAt.subtractWith(renderer.Camera.Position).normalizeThis());
    programWrapper.registerTexture(renderer, texs["RB1"], 0, "rb1");
    programWrapper.registerTexture(renderer, texs["RB2"], 1, "rb2");
    programWrapper.registerTexture(renderer, texs["DEPTH"], 2, "depth");
    //pass variables related to point lights
    var plights = scene.getLights("jthree.lights.pointlight");
    var lpos = new Array(plights.length);
    var lcol = new Array(plights.length);
    var lcoef = new Array(plights.length);
    for (var i = 0; i < plights.length; i++) {
      var pl = <PointLight>plights[i];
      lpos[i] = Matrix.transformPoint(renderer.Camera.ViewMatrix, plights[i].Position);
      lcol[i] = plights[i].Color.toVector().multiplyWith(pl.Intensity);
      lcoef[i] = new Vector2(pl.Decay, pl.Distance);
    }
    programWrapper.setUniformVectorArray("pl_pos", lpos);
    programWrapper.setUniformVectorArray("pl_col", lcol);
    programWrapper.setUniformVectorArray("pl_coef", lcoef);
    programWrapper.setUniform1i("pl_count", plights.length);
    //pass variables related to directional lights
    var dlights = <DirectionalLight[]> scene.getLights("jthree.lights.directionallight");
    var ddir = new Array(dlights.length);
    var dcol = new Array(dlights.length);
    for (var i = 0; i < dlights.length; i++) {
      var dl = <DirectionalLight>dlights[i];
      ddir[i] = Matrix.transformNormal(renderer.Camera.ViewMatrix, dlights[i].Transformer.Foward);
      dcol[i] = dl.Color.toVector().multiplyWith(dl.Intensity);
    }
    programWrapper.setUniformVectorArray("dl_dir", ddir);
    programWrapper.setUniformVectorArray("dl_col", dcol);
    programWrapper.setUniform1i("dl_count", dlights.length);
    programWrapper.setUniform1f("c_near", renderer.Camera.Near);
    programWrapper.setUniform1f("c_far", renderer.Camera.Far);
    programWrapper.setUniformMatrix("matIP", ip);
    programWrapper.setUniformMatrix("matTV", Matrix.inverse(renderer.Camera.ViewMatrix));
    programWrapper.setUniformMatrix("matLV", dlights[0] ? dlights[0].VP : Matrix.identity());
    programWrapper.setUniform1f("xtest",(<HTMLInputElement>document.getElementById("x")).valueAsNumber);
    programWrapper.setUniform1f("ytest",(<HTMLInputElement>document.getElementById("y")).valueAsNumber);
    programWrapper.setUniform1f("ztest",(<HTMLInputElement>document.getElementById("z")).valueAsNumber);
    programWrapper.registerTexture(renderer, texs["DIR"], 3, "u_ldepth");
    programWrapper.setUniformVector("posL", Matrix.transformPoint(renderer.Camera.ViewMatrix, new Vector3(1, 2, -3)));
    programWrapper.setUniform1f("time", (new Date()).getMilliseconds() + 1000 * (new Date().getSeconds()));
    geometry.IndexBuffer.getForRenderer(renderer.ContextManager).bindBuffer();
  }

  public needRender(scene: Scene, object: SceneObject, passCount: number): boolean {
    return typeof object.Geometry != "undefined" && object.Geometry != null;
  }

		public getPassCount(scene: Scene) {
    return 1;
  }


		public get TargetGeometry(): string {
    return "quad";
  }

  public get RenderStageConfig() {
    return {
      depthTest: false,
      cullFace:false
    };
  }
}
export = LitghtAccumulationStage;
