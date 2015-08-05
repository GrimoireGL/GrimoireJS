import Material = require("./../Material");
import Program = require("../../Resources/Program/Program");
import RendererBase = require("../../Renderers/RendererBase");
import SceneObject = require("../../SceneObject");
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
    geometry.IndexBuffer.getForRenderer(renderer.ContextManager).bindBuffer();
  }
}

export =DepthStageMaterial;
