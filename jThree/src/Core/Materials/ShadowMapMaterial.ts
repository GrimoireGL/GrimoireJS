import Material = require("./Material");
import Program = require("../Resources/Program/Program");
import RendererBase = require("../Renderers/RendererBase");
import SceneObject = require("../SceneObject");
import Matrix = require("../../Math/Matrix");
import TextureBase = require('../Resources/Texture/TextureBase');
import Scene = require('../Scene');
import ResolvedChainInfo = require('../Renderers/ResolvedChainInfo');
import IMaterialConfig = require("./IMaterialConfig");
declare function require(string): string;
/**
 * Provides shadow map rendering materials.
 * By this material, default meshes will be rendered as shadow map.
 * These shadow map will be used in lighting stage to drop shadow.
 */
class ShadowMapMaterial extends Material
{
  public get MaterialGroup(): string
  {
      return "jthree.materials.shadowmap";
  }

    protected program: Program;

    constructor()
    {
        super();
        var vs = require('../Shaders/Shadow/ShadowMapVertex.glsl');
        var fs = require('../Shaders/Shadow/ShadowMapFragment.glsl');
        this.program = this.loadProgram("jthree.shaders.vertex.shadowmap", "jthree.shaders.fragment.shadowmap", "jthree.programs.shadowmap", vs, fs);
        this.setLoaded();
    }

    public configureMaterial(scene: Scene, renderer: RendererBase, object: SceneObject, texs: ResolvedChainInfo,techniqueIndex:number,passIndex:number): void
    {
        super.configureMaterial(scene, renderer, object, texs,techniqueIndex,passIndex);
        var light = scene.LightRegister.shadowDroppableLights[techniqueIndex];
        var geometry = object.Geometry;
        var matPLW = Matrix.multiply(light.matLightViewProjection,object.Transformer.LocalToGlobal);
        this.program.getForContext(renderer.ContextManager).register({
          attributes:
          {
            position:geometry.PositionBuffer
          },
          uniforms:
          {
            matPLW:{type:"matrix",value:matPLW},
            matLV:{type:"matrix",value:light.matLightView}
          }
        });
        geometry.bindIndexBuffer(renderer.ContextManager);
    }

    public getMaterialConfig(pass:number,technique:number):IMaterialConfig
    {
      return {
        cull:"ccw",
        blend:false
      }
    }
}

export =ShadowMapMaterial;
