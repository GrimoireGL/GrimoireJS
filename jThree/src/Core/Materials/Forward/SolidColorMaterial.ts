import Material = require("./../Material");
import Program = require("../../Resources/Program/Program");
import BasicRenderer = require("../../Renderers/BasicRenderer");
import SceneObject = require("../../SceneObject");
import Matrix = require("../../../Math/Matrix");
import Color4 = require("../../../Base/Color/Color4");
import Scene = require('../../Scene');
import ResolvedChainInfo = require('../../Renderers/ResolvedChainInfo');
import RenderStageBase = require("../../Renderers/RenderStages/RenderStageBase");

class SolidColorMaterial extends Material {
  private color: Color4 = Color4.parseColor('#F0F');

    public get Color(): Color4 {
    return this.color;
  }

    public set Color(col: Color4) {
    this.color = col;
  }
  protected program: Program;
  constructor() {
    super();
    var vs = require('../../Shaders/VertexShaders/BasicGeometries.glsl');
    var fs = require('../../Shaders/SolidColor.glsl');
    this.program = this.loadProgram("jthree.shaders.vertex.basic", "jthree.shaders.fragment.solidcolor", "jthree.programs.solidcolor", vs, fs);
    this.setLoaded();
  }

    public configureMaterial(scene: Scene, renderStage: RenderStageBase, object: SceneObject, texs: ResolvedChainInfo,techniqueIndex:number,passIndex:number): void {
    var renderer = renderStage.Renderer;
    super.configureMaterial(scene, renderStage, object, texs,techniqueIndex,passIndex);
    var geometry = object.Geometry;
    var programWrapper = this.program.getForContext(renderer.ContextManager);
    var v = object.Transformer.calculateMVPMatrix(renderer);
        programWrapper.register({
            attributes: {
                position: geometry.PositionBuffer,
                normal: geometry.NormalBuffer
            },
            uniforms: {
                matMVP: { type: "matrix", value: v },
                matMV: { type: "matrix", value: Matrix.multiply(renderer.Camera.viewMatrix, object.Transformer.LocalToGlobal) },
                u_color:{type:"vector",value:this.Color.toVector()}
            }
        });
    geometry.IndexBuffer.getForContext(renderer.ContextManager).bindBuffer();
  }
}

export =SolidColorMaterial;
