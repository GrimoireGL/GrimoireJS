import Material = require("./../Material");
import Program = require("../../Resources/Program/Program");
import RendererBase = require("../../Renderers/RendererBase");
import SceneObject = require("../../SceneObject");
import Vector3 = require("../../../Math/Vector3");
import Matrix = require("../../../Math/Matrix");
import Color4 = require("../../../Base/Color/Color4");
import Color3 = require('../../../Base/Color/Color3');
import TextureBase = require('../../Resources/Texture/TextureBase');
import Scene = require('../../Scene');
import ResolvedChainInfo = require('../../Renderers/ResolvedChainInfo');
import RenderStageBase = require("../../Renderers/RenderStages/RenderStageBase");
declare function require(string): string;

class PhongMaterial extends Material {
  public diffuse = Color4.parseColor('#F0F');

  public ambient = Color4.parseColor('#F0F');

  public specular = Color3.parseColor('#F0F');

  public specularCoefficient = 10;

  public texture: TextureBase=null;

  protected program: Program;
  constructor() {
    super();
    var vs = require('../../Shaders/VertexShaders/BasicGeometries.glsl');
    var fs = require('../../Shaders/Phong.glsl');
    this.program = this.loadProgram("jthree.shaders.vertex.basic", "jthree.shaders.fragment.phong", "jthree.programs.phong", vs, fs);
    this.setLoaded();
  }

    public configureMaterial(scene: Scene, renderStage: RenderStageBase, object: SceneObject,texs:ResolvedChainInfo,techniqueIndex:number,passIndex:number): void {
    if (!this.program) return;
    super.configureMaterial(scene, renderStage, object,texs,techniqueIndex,passIndex);
    var renderer = renderStage.Renderer;
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
                matV: { type: "matrix", value: renderer.Camera.viewMatrix },
                matMV: { type: "matrix", value: Matrix.multiply(renderer.Camera.viewMatrix, object.Transformer.LocalToGlobal) },
                texture: { type: "texture", register: 0, value: this.texture },
                dlight: { type: "texture", register: 1, value: texs["DLIGHT"] },
                slight: { type: "texture", register: 2, value: texs["SLIGHT"] },
                ambient: { type: "vector", value: this.ambient.toVector() },
                diffuse: { type: "vector", value: this.diffuse.toVector() },
                specular: { type: "vector", value: this.specular.toVector4(this.specularCoefficient) },
                textureUsed: { type: "integer", value: (this.texture != null) ? 1 : 0 },
                ambientCoefficient:{type:"vector",value:scene.sceneAmbient.toVector()}
            }
        });
    geometry.IndexBuffer.getForContext(renderer.ContextManager).bindBuffer();
  }
}

export =PhongMaterial;
