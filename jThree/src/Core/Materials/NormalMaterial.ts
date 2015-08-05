import Material = require("./Material");
import Program = require("../Resources/Program/Program");
import RendererBase = require("../Renderers/RendererBase");
import SceneObject = require("../SceneObject");
import Vector3 = require("../../Math/Vector3");
import Matrix = require("../../Math/Matrix");
import Scene = require('../Scene');
import ResolvedChainInfo = require('../Renderers/ResolvedChainInfo');
declare function require(string): string;

class NormalMaterial extends Material {

  get MaterialGroup(): string {
    return "jthree.materials.normal";
  }
  
  protected program: Program;
  constructor() {
    super();
    var vs = require('../Shaders/VertexShaders/BasicGeometries.glsl');
    var fs = require('../Shaders/Deffered/NormalBuffer.glsl');
    this.program = this.loadProgram("jthree.shaders.vertex.basic", "jthree.shaders.fragment.normal", "jthree.programs.normal", vs, fs);
    this.setLoaded();
  }

  configureMaterial(scene: Scene, renderer: RendererBase, object: SceneObject, texs: ResolvedChainInfo): void {
    super.configureMaterial(scene, renderer, object, texs);
    var geometry = object.Geometry;
    var programWrapper = this.program.getForContext(renderer.ContextManager);
    programWrapper.useProgram();
    var v = object.Transformer.calculateMVPMatrix(renderer);
    programWrapper.setAttributeVerticies("position", geometry.PositionBuffer.getForRenderer(renderer.ContextManager));
    programWrapper.setAttributeVerticies("normal", geometry.NormalBuffer.getForRenderer(renderer.ContextManager));
    programWrapper.setAttributeVerticies("uv", geometry.UVBuffer.getForRenderer(renderer.ContextManager));
    programWrapper.setUniformMatrix("matMVP", v);
    programWrapper.setUniformMatrix("matV", renderer.Camera.ViewMatrix);
    programWrapper.setUniformMatrix("matMV", Matrix.multiply(renderer.Camera.ViewMatrix, object.Transformer.LocalToGlobal));
    programWrapper.setUniformVector("u_DirectionalLight", new Vector3(0, 0, -1));
    geometry.IndexBuffer.getForRenderer(renderer.ContextManager).bindBuffer();
  }
}

export =NormalMaterial;
