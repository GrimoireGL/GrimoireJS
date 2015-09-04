 import Material = require("./Material");
import Program = require("../Resources/Program/Program");
import RendererBase = require("../Renderers/RendererBase");
import SceneObject = require("../SceneObject");
import Vector3 = require("../../Math/Vector3");
 import Vector4 = require("../../Math/Vector4");
import Matrix = require("../../Math/Matrix");
import Scene = require('../Scene');
import ResolvedChainInfo = require('../Renderers/ResolvedChainInfo');
import GlFeatureType = require("../../Wrapper/GLFeatureType");
 import TextureBase = require("../Resources/Texture/TextureBase");
 import PhongMaterial = require("./PhongMaterial");

 declare function require(string): string;

class DiffuseAlbedoMaterial extends Material {
    public get MaterialGroup(): string {
    return "jthree.materials.albedo";
    }

    public Albedo: Vector4=new Vector4(0.5,0,1,1);

    public Texture: TextureBase=null;

  
  protected program: Program;
  constructor() {
    super();
    var vs = require('../Shaders/VertexShaders/BasicGeometries.glsl');
    var fs = require('../Shaders/Deffered/Albedo.glsl');
    this.program = this.loadProgram("jthree.shaders.vertex.basic", "jthree.shaders.fragment.albedo", "jthree.programs.albedo", vs, fs);
    this.setLoaded();
  }

    public configureMaterial(scene: Scene, renderer: RendererBase, object: SceneObject, texs: ResolvedChainInfo): void {
    super.configureMaterial(scene, renderer, object, texs);
    var geometry = object.Geometry;
    renderer.GLContext.Disable(GlFeatureType.Blend);
    var programWrapper = this.program.getForContext(renderer.ContextManager);
    var fm = <PhongMaterial>object.getMaterial("jthree.materials.forematerial");
    var albedo;
    if (fm && fm.Diffuse) {
        albedo = fm.Diffuse.toVector();
    } else {
        albedo = this.Albedo;
    }
    var v = object.Transformer.calculateMVPMatrix(renderer);
        programWrapper.register({
            attributes: {
                position: geometry.PositionBuffer,
                normal: geometry.NormalBuffer,
                uv: geometry.UVBuffer
            },
            uniforms: {
                matMVP: {
                    type: "matrix",
                    value: v
                },
                matMV: {
                    type: "matrix",
                    value: Matrix.multiply(renderer.Camera.ViewMatrix, object.Transformer.LocalToGlobal)
                },
                albedo: {
                    type: "vector",
                    value:albedo
                },
                texture: {
                    type: "texture",
                    value: fm.Texture,
                    register: 0
                },
                textureUsed: {
                    type: "integer",
                    value: (fm.Texture ? 1 : 0)
    }
            }
        });
    geometry.IndexBuffer.getForContext(renderer.ContextManager).bindBuffer();
  }
}

export =DiffuseAlbedoMaterial;
