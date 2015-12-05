import JThreeObjectWithID = require("../../Base/JThreeObjectWithID");
import BasicRenderer = require("../Renderers/BasicRenderer");
import SceneObject = require("../SceneObject");
import GLCullMode = require("../../Wrapper/GLCullMode");
import GLFeatureType = require("../../Wrapper/GLFeatureType");
import ShaderType = require("../../Wrapper/ShaderType");
import Program = require('../Resources/Program/Program');
import Scene = require('../Scene');
import ResolvedChainInfo = require('../Renderers/ResolvedChainInfo');
import Geometry = require('../Geometries/Geometry')
import ResourceManager = require("../ResourceManager");
import JThreeContext = require("../../JThreeContext");
import ContextComponents = require("../../ContextComponents");
import IMaterialConfig = require("./IMaterialConfig");
import RenderStageBase = require("../Renderers/RenderStages/RenderStageBase");
declare function require(string): string;
/**
* Basement class for any Materials.
* Material is basically meaning what shader will be used or what shader variable will passed.
* In jThree v3,these renderer are implemented with deferred rendering method.
* That method needs to use a lot of shaders and shader variables.
* Therefore,materials of jThree is not only visceral Materials.
* Some of materials are intended to use in deferred rendering stage(G-buffer generation stage is one of example).
* This is one of significant difference between jThree and the other Web3D libraries in Material.
*/
class Material extends JThreeObjectWithID {
   /**
   * Whether this material was initialized already or not.
   */
    private initialized:boolean=false;

    /**
    * Set loaded status of this material.
    * If first argument of boolean was passed,the status of loaded will be changed in that value.
    * If first argument of boolean was not passed, the status of loaded will be changed in true.
    */
    protected setLoaded(flag?:boolean)
    {
        flag=typeof flag ==='undefined'?true:flag;
        this.initialized=flag;
    }

    /**
     * Provides the flag this material finished loading or not.
     */
    public get Initialized():boolean
    {
        return this.initialized;
    }

    constructor() {
        super();
    }

    /**
    * Rendering priorty
    */
    private priorty: number;
    /**
    * Rendering priorty of this material.
    * If render stage request materials of an specific material group, these list is sorted in this priorty value.
    * So any material with same group id having lower priorty will be rendered later.
    */
    public get Priorty(): number {
        return this.priorty;
    }

    public getMaterialConfig(pass:number,technique:number):IMaterialConfig
    {
      return {
        cull:"ccw",
        blend:true
      }
    }
    /**
    * Group name of this material.
    * This main purpose is mainly intended to be used in RenderStage for filtering materials by puropse of material.
    */
    public get MaterialGroup():string
    {
        return "jthree.materials.forematerial";
    }
    /**
    * Should return how many times required to render this material.
    * If you render some of model with edge,it can be 2 or greater.
    * Because it needs rendering edge first,then rendering forward shading.
    */
    public getPassCount(techniqueIndex: number) {
        return 1;
    }

    /**
    * Initialize shader programs.
    * @param vsid the vertex shader id
    * @param fsid the fragment shader id
    * @param pid the program id which is link of the vertex shader and fragment shader
    * @param vscode the vertex shader source code
    * @param fscode the fragment shader source code
    */
    protected loadProgram(vsid: string, fsid: string, pid: string,vscode:string,fscode:string): Program {
        var rm = JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
        var vShader = rm.createShader(vsid,vscode,ShaderType.VertexShader);
        var fShader = rm.createShader(fsid,fscode,ShaderType.FragmentShader);
        vShader.loadAll();fShader.loadAll();
        return rm.createProgram(pid,[vShader,fShader]);
    }
    /**
    * Apply configuration of program.
    * This is used for passing variables,using programs,binding index buffer.
    */
    public configureMaterial(scene:Scene,renderStage: RenderStageBase, object: SceneObject,texs:ResolvedChainInfo,techniqueIndex:number,passIndex:number): void {
        this.applyMaterialConfig(passIndex,techniqueIndex,renderStage.Renderer);
        return;
    }

    protected applyMaterialConfig(passIndex:number,techniqueIndex:number,renderer:BasicRenderer)
    {
      var config = this.getMaterialConfig(passIndex,techniqueIndex);
      if(config.cull)
      {
        renderer.GL.enable(renderer.GL.CULL_FACE);
        if(config.cull == "cw")
        {
          renderer.GL.cullFace(renderer.GL.FRONT);
        }else
        {
          renderer.GL.cullFace(renderer.GL.BACK);
        }
      }else
      {
        renderer.GL.disable(renderer.GL.CULL_FACE);
      }
      if(config.blend)
      {
        renderer.GL.enable(renderer.GL.BLEND);
        if(!config.blendArg1)
        {
          //If blendFunc was not specified, jThree will select linear blending
          config.blendArg1 = "srcAlpha"
          config.blendArg2 = "oneMinusSrcAlpha"
        }
        renderer.GL.blendFunc(this.parseBlendVariable(config.blendArg1,renderer),this.parseBlendVariable(config.blendArg2,renderer));
      }else
      {
        renderer.GL.disable(renderer.GL.BLEND);
      }
    }

    private parseBlendVariable(blendConfig:string,renderer:BasicRenderer):number
    {
      if(blendConfig == "1")return renderer.GL.ONE;
      if(blendConfig == "0")return renderer.GL.ZERO;
      if(blendConfig == "srcAlpha")return renderer.GL.SRC_ALPHA;
      if(blendConfig == "srcColor")return renderer.GL.SRC_COLOR;
      if(blendConfig == "oneMinusSrcAlpha")return renderer.GL.ONE_MINUS_SRC_ALPHA;
      if(blendConfig == "oneMinusSrcColor")return renderer.GL.ONE_MINUS_SRC_COLOR;
      if(blendConfig == "oneMinusDstAlpha")return renderer.GL.ONE_MINUS_DST_ALPHA;
      if(blendConfig == "oneMinusDstColor")return renderer.GL.ONE_MINUS_DST_COLOR;
      if(blendConfig == "destAlpha")return renderer.GL.DST_ALPHA;
      if(blendConfig == "destColor")return renderer.GL.DST_COLOR;
      console.error("Unsupported blend config!");
    }

    /**
    * The flag whether this material should be called for rendering.
    */
    public get Enabled(): boolean {
        return true;
    }

    public getDrawGeometryLength(geo:Geometry):number
    {
        return geo.IndexCount;
    }

    public getDrawGeometryOffset(geo:Geometry):number
    {
        return geo.GeometryOffset;
    }
}

export =Material;