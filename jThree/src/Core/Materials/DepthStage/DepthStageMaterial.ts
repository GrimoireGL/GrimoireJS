import Material = require("./../Material");
import Program = require("../../Resources/Program/Program");
import RendererBase = require("../../Renderers/RendererBase");
import SceneObject = require("../../SceneObject");
import Scene = require('../../Scene');
import ResolvedChainInfo = require('../../Renderers/ResolvedChainInfo');
declare function require(string): string;

class DepthStageMaterial extends Material {
    public get MaterialGroup(): string {
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

    public configureMaterial(scene: Scene, renderer: RendererBase, object: SceneObject, texs: ResolvedChainInfo): void {
    super.configureMaterial(scene, renderer, object, texs);
    var geometry = object.Geometry;
    var programWrapper = this.program.getForContext(renderer.ContextManager);
    var v = object.Transformer.calculateMVPMatrix(renderer);
        programWrapper.register({
            attributes: { position: geometry.PositionBuffer },
            uniforms: {
               matMVP:{type:"matrix",value:v} 
            }
        });
    geometry.IndexBuffer.getForContext(renderer.ContextManager).bindBuffer();
  }
}

export =DepthStageMaterial;
