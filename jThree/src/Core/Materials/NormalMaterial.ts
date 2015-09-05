import Material = require("./Material");
import Program = require("../Resources/Program/Program");
import RendererBase = require("../Renderers/RendererBase");
import SceneObject = require("../SceneObject");
import Vector3 = require("../../Math/Vector3");
import Matrix = require("../../Math/Matrix");
import Scene = require('../Scene');
import ResolvedChainInfo = require('../Renderers/ResolvedChainInfo');
import GlFeatureType = require("../../Wrapper/GLFeatureType");

declare function require(string): string;

class NormalMaterial extends Material {
    public get MaterialGroup(): string {
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

    public configureMaterial(scene: Scene, renderer: RendererBase, object: SceneObject, texs: ResolvedChainInfo): void {
    super.configureMaterial(scene, renderer, object, texs);
    var geometry = object.Geometry;
    var programWrapper = this.program.getForContext(renderer.ContextManager);
    var v = object.Transformer.calculateMVPMatrix(renderer);
        programWrapper.register({
            attributes: {
                position: geometry.PositionBuffer,
                normal: geometry.NormalBuffer,
                uv:geometry.UVBuffer
            },
            uniforms: {
                matMVP: { type: "matrix", value: v },
                matV: {
                    type: "matrix",
                    value: renderer.Camera.ViewMatrix
                },
                matMV: {
                    type: "matrix",
                    value: Matrix.multiply(renderer.Camera.ViewMatrix, object.Transformer.LocalToGlobal)
                }
            }
        });
    geometry.IndexBuffer.getForContext(renderer.ContextManager).bindBuffer();
  }
}

export =NormalMaterial;
