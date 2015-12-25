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
import Vector4 = require("../../../Math/Vector4");
import PhongMaterial = require("./../Forward/PhongMaterial");
import IMaterialConfig = require("./../IMaterialConfig");
import RenderStageBase = require("../../Renderers/RenderStages/RenderStageBase");
import BasicMaterial = require("../Base/BasicMaterial");
declare function require(string): string;
/**
 * Provides how to write g-buffers.
 * This material have 3 pass for darawing g-buffers.
 * 1-st technique Normal.XY Depth Shiningness
 * 2-nd technique Diffuse.RGBA
 * 3-rd technique Specular.RGB
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

    private primaryMaterial:BasicMaterial;

    private secoundaryMaterial:BasicMaterial;

    private thirdMaterial:BasicMaterial;

    constructor()
    {
        super();
        this.primaryMaterial = new BasicMaterial(require("../BuiltIn/GBuffer/PrimaryBuffer.html"));
        this.secoundaryMaterial = new BasicMaterial(require("../BuiltIn/GBuffer/SecoundaryBuffer.html"));
        this.thirdMaterial = new BasicMaterial(require("../BuiltIn/GBuffer/ThirdBuffer.html"));
        var vs = require('../../Shaders/GBuffer/Vertex.glsl');
        var fs = require('../../Shaders/GBuffer/PrimaryFragment.glsl');
        this.primaryProgram = this.loadProgram("jthree.shaders.gbuffer.primary.vs", "jthree.shaders.gbuffer.primary.fs", "jthree.programs.gbuffer.primary", vs, fs);
        var fs = require('../../Shaders/GBuffer/SecoundaryFragment.glsl');
        this.secoundaryProgram = this.loadProgram("jthree.shaders.gbuffer.secoundary.vs", "jthree.shaders.gbuffer.secoundary.fs", "jthree.programs.gbuffer.secoundary", vs, fs);
        var fs = require('../../Shaders/GBuffer/ThirdFragment.glsl');
        this.thirdProgram = this.loadProgram("jthree.shaders.gbuffer.third.vs", "jthree.shaders.gbuffer.third.fs", "jthree.programs.gbuffer.third", vs, fs);
        this.setLoaded();
    }

    public configureMaterial(scene: Scene, renderStage: RenderStageBase, object: SceneObject, texs: ResolvedChainInfo,techniqueIndex:number,passIndex): void
    {
        if (!this.primaryProgram) return;
        var renderer = renderStage.Renderer;
        super.configureMaterial(scene, renderStage, object, texs,techniqueIndex,passIndex);
        switch (techniqueIndex)
        {
            case 0:
                this.configurePrimaryBuffer(scene, renderStage, object, texs);
                break;
            case 1:
                this.configureSecoundaryBuffer(scene, renderStage, object, texs);
                break;
            case 2:
                this.configureThirdBuffer(scene, renderStage, object, texs);
                break;
        }
        object.Geometry.IndexBuffer.getForContext(renderer.ContextManager).bindBuffer();
    }
    /**
     * Configure shader for 1-st pass.
     * @return {[type]}                     [description]
     */
    private configurePrimaryBuffer(scene: Scene, renderer: RenderStageBase, object: SceneObject, texs: ResolvedChainInfo) {
        var geometry = object.Geometry;
        var fm = <PhongMaterial>object.getMaterial("jthree.materials.forematerial");//shiningness
        var coefficient = 0;
        if(fm.specularCoefficient)coefficient = fm.specularCoefficient;
        this.primaryMaterial.materialVariables["brightness"] = coefficient;
        this.primaryMaterial.configureMaterial(scene,renderer,object,texs,0,0);
    }
    /**
     * Configure shader for 2nd pass.
     * @return {[type]}                     [description]
     */
    private configureSecoundaryBuffer(scene: Scene, renderer: RenderStageBase, object: SceneObject, texs: ResolvedChainInfo) {
        var geometry = object.Geometry;
        var fm = <PhongMaterial>object.getMaterial("jthree.materials.forematerial");
        var albedo;
        if (fm && fm.diffuse) {//TODO there should be good implementation
            albedo = fm.diffuse.toVector();
        } else {
            albedo = new Vector4(1, 0, 0, 1);
        }
        this.secoundaryMaterial.materialVariables["albedo"] = albedo;
        this.secoundaryMaterial.configureMaterial(scene,renderer,object,texs,1,0);
    }

    /**
     * Configure shader for 3rd pass.
     * @return {[type]}                     [description]
     */
    private configureThirdBuffer(scene: Scene, renderer: RenderStageBase, object: SceneObject, texs: ResolvedChainInfo)
    {
        var fm = <PhongMaterial>object.getMaterial("jthree.materials.forematerial");
        var specular;
        if (fm && fm.diffuse) {
            specular = fm.specular.toVector();
        } else
        {
            specular = new Vector3(1, 0, 0);
        }
        this.thirdMaterial.materialVariables["specular"] = specular;
        this.thirdMaterial.configureMaterial(scene,renderer,object,texs,2,0);
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
