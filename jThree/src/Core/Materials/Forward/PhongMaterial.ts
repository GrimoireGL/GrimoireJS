import BasicMaterial = require("../Base/BasicMaterial");
import IMaterialConfigureArgument = require("../Base/IMaterialConfigureArgument");
import Material = require("./../Material");
import Program = require("../../Resources/Program/Program");
import BasicRenderer = require("../../Renderers/BasicRenderer");
import SceneObject = require("../../SceneObject");
import Vector3 = require("../../../Math/Vector3");
import Matrix = require("../../../Math/Matrix");
import Color4 = require("../../../Base/Color/Color4");
import Color3 = require('../../../Base/Color/Color3');
import TextureBase = require('../../Resources/Texture/TextureBase');
import Scene = require('../../Scene');
import ResolvedChainInfo = require('../../Renderers/ResolvedChainInfo');
import RenderStageBase = require("../../Renderers/RenderStages/RenderStageBase");

class PhongMaterial extends BasicMaterial {
  public diffuse = Color4.parseColor('#F0F');

  public ambient = Color4.parseColor('#F0F');

  public specular = Color3.parseColor('#F0F');

  public specularCoefficient = 10;

  public texture: TextureBase=null;

  protected program: Program;
  constructor() {
    super(require("../BuiltIn/Materials/Phong.html"));
    // var vs = require('../../Shaders/VertexShaders/BasicGeometries.glsl');
    // var fs = require('../../Shaders/Phong.glsl');
    // this.program = this.loadProgram("jthree.shaders.vertex.basic", "jthree.shaders.fragment.phong", "jthree.programs.phong", vs, fs);
    this.setLoaded();
  }

    public configureMaterial(matArg:IMaterialConfigureArgument): void {
    //super.configureMaterial(scene, renderStage, object,texs,techniqueIndex,passIndex);
    super.configureMaterial(matArg);
    // var v = object.Transformer.calculateMVPMatrix(renderer);
    //     pw.register({
    //         attributes: {
    //             position: geometry.PositionBuffer,
    //             normal: geometry.NormalBuffer,
    //             uv:geometry.UVBuffer
    //         },
    //         uniforms: {
    //             matMVP: { type: "matrix", value: v },
    //             matV: { type: "matrix", value: renderer.Camera.viewMatrix },
    //             matMV: { type: "matrix", value: Matrix.multiply(renderer.Camera.viewMatrix, object.Transformer.LocalToGlobal) },
    //             texture: { type: "texture", register: 0, value: this.texture },
    //             dlight: { type: "texture", register: 1, value: matArg.textureResource["DLIGHT"] },
    //             slight: { type: "texture", register: 2, value: matArg.textureResource["SLIGHT"] },
    //             ambient: { type: "vector", value: this.ambient.toVector() },
    //             diffuse: { type: "vector", value: this.diffuse.toVector() },
    //             specular: { type: "vector", value: this.specular.toVector4(this.specularCoefficient) },
    //             textureUsed: { type: "integer", value: (this.texture != null) ? 1 : 0 },
    //             ambientCoefficient:{type:"vector",value:matArg.scene.sceneAmbient.toVector()}
    //         }
    //     });
    // geometry.IndexBuffer.getForContext(renderer.ContextManager).bindBuffer();
  }
}

export =PhongMaterial;
