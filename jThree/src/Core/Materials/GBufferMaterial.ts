import Material = require("./Material");
import Program = require("../Resources/Program/Program");
import JThreeContextProxy = require("../JThreeContextProxy");
import JThreeContext = require("../JThreeContext");
import RendererBase = require("../Renderers/RendererBase");
import SceneObject = require("../SceneObject");
import Vector3 = require("../../Math/Vector3");
import Matrix = require("../../Math/Matrix");
import Color4 = require("../../Base/Color/Color4");
import Color3 = require('../../Base/Color/Color3');
import TextureBase = require('../Resources/Texture/TextureBase');
import Scene = require('../Scene');
import ResolvedChainInfo = require('../Renderers/ResolvedChainInfo');
import Vector4 = require("../../Math/Vector4");
import PhongMaterial = require("./PhongMaterial");
import IMaterialConfig = require("./IMaterialConfig");
declare function require(string): string;
/**
 * Provides how to write g-buffers.
 * This material have 3 pass for darawing g-buffers.
 * 1-st pass Normal.XY Depth Shiningness
 * 2-nd pass Diffuse.RGBA
 * 3-rd pass Specular.RGB
 */
class GBufferMaterial extends Material
{
    public get MaterialGroup(): string
    {
        return "jthree.materials.gbuffer";
    }

    private primaryProgram: Program;

    private secoundaryProgram: Program;

    private thirdProgram:Program;

    constructor()
    {
        super();
        var vs = require('../Shaders/GBuffer/Vertex.glsl');
        var fs = require('../Shaders/GBuffer/PrimaryFragment.glsl');
        this.primaryProgram = this.loadProgram("jthree.shaders.gbuffer.primary.vs", "jthree.shaders.gbuffer.primary.fs", "jthree.programs.gbuffer.primary", vs, fs);
        var fs = require('../Shaders/GBuffer/SecoundaryFragment.glsl');
        this.secoundaryProgram = this.loadProgram("jthree.shaders.gbuffer.secoundary.vs", "jthree.shaders.gbuffer.secoundary.fs", "jthree.programs.gbuffer.secoundary", vs, fs);
        var fs = require('../Shaders/GBuffer/ThirdFragment.glsl');
        this.thirdProgram = this.loadProgram("jthree.shaders.gbuffer.third.vs", "jthree.shaders.gbuffer.third.fs", "jthree.programs.gbuffer.third", vs, fs);
        this.setLoaded();
    }

    public configureMaterial(scene: Scene, renderer: RendererBase, object: SceneObject, texs: ResolvedChainInfo,techniqueIndex:number,passIndex): void
    {
        if (!this.primaryProgram) return;
        super.configureMaterial(scene, renderer, object, texs,techniqueIndex,passIndex);
        switch (techniqueIndex)
        {
            case 0:
                this.configurePrimaryBuffer(scene, renderer, object, texs);
                break;
            case 1:
                this.configureSecoundaryBuffer(scene, renderer, object, texs);
                break;
            case 2:
                this.configureThirdBuffer(scene, renderer, object, texs);
                break;
        }
        object.Geometry.IndexBuffer.getForContext(renderer.ContextManager).bindBuffer();
    }
    /**
     * Configure shader for 1-st pass.
     * @return {[type]}                     [description]
     */
    private configurePrimaryBuffer(scene: Scene, renderer: RendererBase, object: SceneObject, texs: ResolvedChainInfo) {
        var geometry = object.Geometry;
        var pw = this.primaryProgram.getForContext(renderer.ContextManager);
        var v = object.Transformer.calculateMVPMatrix(renderer);
        var fm = <PhongMaterial>object.getMaterial("jthree.materials.forematerial");//shiningness
        var coefficient = 0;
        if(fm.specularCoefficient)coefficient = fm.specularCoefficient;
        pw.register({
            attributes: {
                position: geometry.PositionBuffer,
                normal: geometry.NormalBuffer,
                uv:geometry.UVBuffer
            },
            uniforms: {
                matMVP: { type: "matrix", value: v },
                matMV: { type: "matrix", value: Matrix.multiply(renderer.Camera.viewMatrix, object.Transformer.LocalToGlobal) },
                specularCoefficient: {
                    type: "float",
                    value: coefficient
                }
            }
        });

    }
    /**
     * Configure shader for 2nd pass.
     * @return {[type]}                     [description]
     */
    private configureSecoundaryBuffer(scene: Scene, renderer: RendererBase, object: SceneObject, texs: ResolvedChainInfo) {
        var geometry = object.Geometry;
        var programWrapper = this.secoundaryProgram.getForContext(renderer.ContextManager);
        var fm = <PhongMaterial>object.getMaterial("jthree.materials.forematerial");
        var albedo;
        if (fm && fm.diffuse) {//TODO there should be good implementation
            albedo = fm.diffuse.toVector();
        } else {
            albedo = new Vector4(1, 0, 0, 1);
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
                    value: Matrix.multiply(renderer.Camera.viewMatrix, object.Transformer.LocalToGlobal)
                },
                albedo: {
                    type: "vector",
                    value: albedo
                },
                texture: {
                    type: "texture",
                    value: fm.texture,
                    register: 0
                },
                textureUsed: {
                    type: "integer",
                    value: (fm.texture ? 1 : 0)
                }
            }
        });
    }

    /**
     * Configure shader for 3rd pass.
     * @return {[type]}                     [description]
     */
    private configureThirdBuffer(scene: Scene, renderer: RendererBase, object: SceneObject, texs: ResolvedChainInfo)
    {
        var geometry = object.Geometry;
        var programWrapper = this.thirdProgram.getForContext(renderer.ContextManager);
        var fm = <PhongMaterial>object.getMaterial("jthree.materials.forematerial");
        var specular;
        if (fm && fm.diffuse) {
            specular = fm.specular.toVector();
        } else
        {
            specular = new Vector3(1, 0, 0);
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
                    value: Matrix.multiply(renderer.Camera.viewMatrix, object.Transformer.LocalToGlobal)
                },
                specular: {
                    type: "vector",
                    value: specular
                },
            }
        });
    }

    public  getMaterialConfig(pass:number,technique:number):IMaterialConfig
    {
      if(technique == 0)
      {
        return {
          blend:false,
          cull:"ccw"
        }
      }
      if(technique == 1)
      {
        return {
          cull:"ccw",
          blend:true
        }
      }else
      {
        return {
          cull:"ccw",
          blend:false
        }
      }
    }
}

export =GBufferMaterial;
