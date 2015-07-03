import JThreeObject = require('./../../../Base/JThreeObject');
import RendererBase = require('../RendererBase');
import SceneObject = require('../../SceneObject');
import Material = require('../../Materials/Material');
import Scene = require('../../Scene')
import Program = require('../../Resources/Program/Program');
import JThreeContextProxy = require('../../JThreeContextProxy');
import Matrix = require('../../../Math/Matrix')
import ShaderType = require("../../../Wrapper/ShaderType");
import ResolvedChainInfo= require('../ResolvedChainInfo');
import TextureRegister = require('../../../Wrapper/Texture/TextureRegister');
import TextureBase = require('../../Resources/Texture/TextureBase');
class RenderStageBase extends JThreeObject {
	private renderer: RendererBase;
	/**
	 * Getter for renderer having this renderstage
	 */
	public get Renderer(): RendererBase {
		return this.renderer;
	}

	constructor(renderer: RendererBase) {
		super();
		this.renderer = renderer;
	}
	
	public preBeginStage(scene:Scene,passCount:number,texs:ResolvedChainInfo)
	{
		
	}
	
	public postEndStage(scene:Scene,passCount:number,texs:ResolvedChainInfo)
	{
		
	}

	public render(scene:Scene,object: SceneObject,passCount:number,texs:ResolvedChainInfo) {

	}

	public needRender(scene:Scene,object: SceneObject,passCount:number): boolean {
		return false;
	}
	
	public getPassCount(scene:Scene)
	{
		return 1;
	}
	
	public get TargetGeometry():string
	{
		return "scene";
	}
	
	    protected loadProgram(vsid: string, fsid: string, pid: string,vscode:string,fscode:string): Program {
        var jThreeContext = JThreeContextProxy.getJThreeContext();
        var rm = jThreeContext.ResourceManager;
        var vShader = rm.createShader(vsid,vscode,ShaderType.VertexShader);
        var fShader = rm.createShader(fsid,fscode,ShaderType.FragmentShader);
        vShader.loadAll();fShader.loadAll();
        return rm.createProgram(pid,[vShader,fShader]);
    }
	
	
    /**
    * Calculate MVP(Model-View-Projection) matrix
    */
    protected CalculateMVPMatrix(renderer: RendererBase, object: SceneObject): Matrix {
        return Matrix.multiply(Matrix.multiply(renderer.Camera.ProjectionMatrix, renderer.Camera.ViewMatrix), object.Transformer.LocalToGlobal);
    }
	
registerTexture(program:Program,renderer: RendererBase, tex: TextureBase, texNumber: number, samplerName: string) {
    renderer.ContextManager.Context.ActiveTexture(TextureRegister.Texture0 + texNumber);
    if(tex)tex.getForContext(renderer.ContextManager).bind();
    program.getForContext(renderer.ContextManager).setUniform1i(samplerName, texNumber);
  }
}

export = RenderStageBase;