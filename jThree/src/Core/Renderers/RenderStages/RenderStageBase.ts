import JThreeObject = require('./../../../Base/JThreeObject');
import RendererBase = require('../RendererBase');
import SceneObject = require('../../SceneObject');
import Material = require('../../Materials/Material');
import Scene = require('../../Scene')
import Program = require('../../Resources/Program/Program');
import JThreeContextProxy = require('../../JThreeContextProxy');
import Matrix = require('../../../Math/Matrix')
import ShaderType = require("../../../Wrapper/ShaderType");
import ResolvedChainInfo = require('../ResolvedChainInfo');
import TextureRegister = require('../../../Wrapper/Texture/TextureRegister');
import TextureBase = require('../../Resources/Texture/TextureBase');
import RBO = require('../../Resources/RBO/RBO');
import FBO = require('../../Resources/FBO/FBO');
import FBOWrapper = require('../../Resources/FBO/FBOWrapper');
import Delegates = require('../../../Base/Delegates');
import FrameBufferAttachmentType = require('../../../Wrapper/FrameBufferAttachmentType');
interface FBOBindData {
	texture: TextureBase|RBO,
	target: string|number,
	isOptional?: boolean,
	type?: string
}

class RenderStageBase extends JThreeObject {
	private renderer: RendererBase;
	/**
	 * Getter for renderer having this renderstage
	 */
	public get Renderer(): RendererBase {
		return this.renderer;
	}
	
	public get GLContext()
	{
		return this.Renderer.GLContext;
	}

	constructor(renderer: RendererBase) {
		super();
		this.renderer = renderer;
	}

	public preBeginStage(scene: Scene, passCount: number, texs: ResolvedChainInfo) {

	}

	public postEndStage(scene: Scene, passCount: number, texs: ResolvedChainInfo) {

	}

	public render(scene: Scene, object: SceneObject, passCount: number, texs: ResolvedChainInfo) {

	}

	public needRender(scene: Scene, object: SceneObject, passCount: number): boolean {
		return false;
	}

	public getPassCount(scene: Scene) {
		return 1;
	}

	public get TargetGeometry(): string {
		return "scene";
	}

	protected loadProgram(vsid: string, fsid: string, pid: string, vscode: string, fscode: string): Program {
        var jThreeContext = JThreeContextProxy.getJThreeContext();
        var rm = jThreeContext.ResourceManager;
        var vShader = rm.createShader(vsid, vscode, ShaderType.VertexShader);
        var fShader = rm.createShader(fsid, fscode, ShaderType.FragmentShader);
        vShader.loadAll(); fShader.loadAll();
        return rm.createProgram(pid, [vShader, fShader]);
    }

	protected bindAsOutBuffer(fbo: FBO, bindInfo: FBOBindData[], onBind: Delegates.Action0, onDefaultBuffer?: Delegates.Action0) {
		var shouldBeDefault = false;
		var targetWrapper = fbo.getForContext(this.Renderer.ContextManager);
		bindInfo.forEach(v=> {
			var attachmentType = FrameBufferAttachmentType.ColorAttachment0;
			if (v.target === "depth") {
				attachmentType = FrameBufferAttachmentType.DepthAttachment;
			} else if (v.target === "stencil") {
				attachmentType = FrameBufferAttachmentType.StencilAttachment;
			} else if (v.target === "depthstencil") {
				attachmentType = FrameBufferAttachmentType.DepthStencilAttachment;
			} else {
				attachmentType = ((<number>FrameBufferAttachmentType.ColorAttachment0) + <number>new Number(v.target));
			}
			if (shouldBeDefault||(typeof v.isOptional !== 'undefined' && !v.isOptional && v.texture === null)) {//use default buffer
				this.attachToWrapper(v,targetWrapper,attachmentType);
				this.Renderer.GLContext.BindFrameBuffer(null);
				shouldBeDefault=true;
			}else
			{
				this.attachToWrapper(v,targetWrapper,attachmentType);
			}
		});
		if(shouldBeDefault)
		{
			if(onDefaultBuffer)onDefaultBuffer();
		}else{
			onBind();
		}
	}

	private attachToWrapper(v:FBOBindData,targetWrapper:FBOWrapper,targetAttachment:FrameBufferAttachmentType) {
		if (!v.type || v.type == "texture") {
			targetWrapper.attachTexture(targetAttachment,<TextureBase>v.texture);
		} else if (v.type = "rbo") {
			targetWrapper.attachRBO(targetAttachment,<RBO>v.texture);
		} else {
			console.error("unknown bind type!");
		}
	}
}

export = RenderStageBase;