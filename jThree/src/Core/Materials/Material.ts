import JThreeObjectWithID = require("../../Base/JThreeObjectWithID");
import RendererBase = require("../Renderers/RendererBase");
import SceneObject = require("../SceneObject");
import GLCullMode = require("../../Wrapper/GLCullMode");
import GLFeatureType = require("../../Wrapper/GLFeatureType");
import JThreeContextProxy = require('./../JThreeContextProxy');
import ShaderType = require("../../Wrapper/ShaderType");
import Program = require('../Resources/Program/Program');
import Scene = require('../Scene');
import ResolvedChainInfo = require('../Renderers/ResolvedChainInfo');
import Geometry = require('../Geometries/Geometry')
declare function require(string): string;
class Material extends JThreeObjectWithID {
    private loaded:boolean=false;
    
    protected setLoaded(flag?:boolean)
    {
        flag=typeof flag ==='undefined'?true:flag;
        this.loaded=flag;
    }
    /**
     * Provides the flag this material finished loading or not.
     */
    public get Loaded():boolean
    {
        return this.loaded;
    }

    constructor() {
        super();
    }

    private priorty: number;

    public get Priorty(): number {
        return this.priorty;
    }

    private cullMode: GLCullMode = GLCullMode.Back;

    public get CullMode(): GLCullMode {
        return this.cullMode;
    }

    private cullEnabled: boolean = true;

    public get CullEnabled(): boolean {
        return this.cullEnabled;
    }

    public set CullEnabled(val: boolean) {
        this.cullEnabled = val;
    }

    public get MaterialGroup():string
    {
        return "jthree.materials.forematerial";
    }
    
    public get PassCount():number
    {
        return 1;
    }

    protected loadProgram(vsid: string, fsid: string, pid: string,vscode:string,fscode:string): Program {
        var jThreeContext = JThreeContextProxy.getJThreeContext();
        var rm = jThreeContext.ResourceManager;
        var vShader = rm.createShader(vsid,vscode,ShaderType.VertexShader);
        var fShader = rm.createShader(fsid,fscode,ShaderType.FragmentShader);
        vShader.loadAll();fShader.loadAll();
        return rm.createProgram(pid,[vShader,fShader]);
    }

    public configureMaterial(scene:Scene,renderer: RendererBase, object: SceneObject,texs:ResolvedChainInfo,techniqueIndex:number,passIndex:number): void {
        this.applyCullConfigure(renderer);
        return;
    }

    protected applyCullConfigure(renderer: RendererBase) {
        if (this.CullEnabled) {//default = Cull.Front
            renderer.GLContext.Enable(
                GLFeatureType.CullFace);
            renderer.GLContext.CullFace(this.cullMode);
        }
        else {
            renderer.GLContext.Disable(GLFeatureType.CullFace);
        }
    }
    
    public get NeedFoward():boolean
    {
        return false;
    }

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
