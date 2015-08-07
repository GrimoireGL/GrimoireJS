import JThreeObject = require('./../../../Base/JThreeObject');
import RendererBase = require('../RendererBase');
import SceneObject = require('../../SceneObject');
import Scene = require('../../Scene')
import Program = require('../../Resources/Program/Program');
import JThreeContextProxy = require('../../JThreeContextProxy');
import ShaderType = require("../../../Wrapper/ShaderType");
import ResolvedChainInfo = require('../ResolvedChainInfo');
import TextureRegister = require('../../../Wrapper/Texture/TextureRegister');
import TextureBase = require('../../Resources/Texture/TextureBase');
import RBO = require('../../Resources/RBO/RBO');
import FBO = require('../../Resources/FBO/FBO');
import FBOWrapper = require('../../Resources/FBO/FBOWrapper');
import Delegates = require('../../../Base/Delegates');
import GLCullMode = require('../../../Wrapper/GLCullMode');
import GLFeature = require('../../../Wrapper/GLFeatureType');
import FrameBufferAttachmentType = require('../../../Wrapper/FrameBufferAttachmentType');
import TargetTextureType = require('../../../Wrapper/TargetTextureType');
import GLSpecManager = require('../../GLSpecManager');
import PixelStoreParamType = require('../../../Wrapper/Texture/PixelStoreParamType');
import FboBindData = require("../FBOBindData");
import RenderStageConfig = require("../RenderStageConfig");

class RenderStageBase extends JThreeObject {
	private renderer: RendererBase;
	/**
	 * Getter for renderer having this renderstage
	 */
	public get Renderer(): RendererBase {
		return this.renderer;
	}

	public get GLContext() {
		return this.Renderer.GLContext;
	}

	constructor(renderer: RendererBase) {
		super();
		this.renderer = renderer;
	}

	/**
	 * This method will be called before process render in each pass
	 */
	public preBeginStage(scene: Scene, passCount: number, texs: ResolvedChainInfo) {

	}
	/**
	 * This method will be called after process render in each pass.
	 */
	public postEndStage(scene: Scene, passCount: number, texs: ResolvedChainInfo) {
		this.Renderer.GLContext.Flush();
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

	public applyStageConfig() {
		//cull enabled/disabled
		this.applyStageConfigToGLFeature(this.RenderStageConfig.cullFace, GLFeature.CullFace, true);
		this.applyStageConfigToGLFeature(this.RenderStageConfig.depthTest, GLFeature.DepthTest, true);
		//cull face direction
		if (!this.RenderStageConfig.cullFront) {
			this.GLContext.CullFace(GLCullMode.Front);
		} else {
			this.GLContext.CullFace(GLCullMode.Back);
		}
		if(typeof this.RenderStageConfig.texYFlip ==='undefined'||this.RenderStageConfig.texYFlip)
		{
			this.GLContext.PixelStorei(PixelStoreParamType.UnpackFlipYWebGL, 1);		}else
		{
	        this.GLContext.PixelStorei(PixelStoreParamType.UnpackFlipYWebGL, 0);
		}
		//reset texture register
		this.resetActiveTextures();
	}

	private applyStageConfigToGLFeature(flag: boolean, target: GLFeature, def: boolean) {
		if (typeof flag === 'undefined') {
			flag = def;
		}
		if (flag) {
			this.GLContext.Enable(target);
		}
		else {
			this.GLContext.Disable(target);
		}
	}

	private resetActiveTextures()
	{
		for(var i=0;i<GLSpecManager.MaxTextureCount;i++)
		{
			this.GLContext.ActiveTexture(TextureRegister.Texture0+i);
			this.GLContext.BindTexture(TargetTextureType.Texture2D,null);
		}
	}

	public get RenderStageConfig(): RenderStageConfig {
		return {
			cullFace: true,
			cullFront: false,
			depthTest: true
		};
	}

	protected loadProgram(vsid: string, fsid: string, pid: string, vscode: string, fscode: string): Program {
        var jThreeContext = JThreeContextProxy.getJThreeContext();
        var rm = jThreeContext.ResourceManager;
        var vShader = rm.createShader(vsid, vscode, ShaderType.VertexShader);
        var fShader = rm.createShader(fsid, fscode, ShaderType.FragmentShader);
        vShader.loadAll(); fShader.loadAll();
        return rm.createProgram(pid, [vShader, fShader]);
    }

	protected bindAsOutBuffer(fbo: FBO, bindInfo: FboBindData[], onBind: Delegates.Action0, onDefaultBuffer?: Delegates.Action0) {
		var shouldBeDefault = false;
		var targetWrapper = fbo.getForContext(this.Renderer.ContextManager);
		bindInfo.forEach(v=> {
			v.target = v.target.toString().toLowerCase();
			var attachmentType = FrameBufferAttachmentType.ColorAttachment0;
			//assign attachment type
			if (v.target === "depth") {
				attachmentType = FrameBufferAttachmentType.DepthAttachment;
			} else if (v.target === "stencil") {
				attachmentType = FrameBufferAttachmentType.StencilAttachment;
			} else if (v.target === "depthstencil") {
				attachmentType = FrameBufferAttachmentType.DepthStencilAttachment;
			} else {
				attachmentType = ((<number>FrameBufferAttachmentType.ColorAttachment0) + <number>new Number(v.target));
			}
			if (shouldBeDefault || (typeof v.isOptional !== 'undefined' && !v.isOptional && v.texture === null)) {//use default buffer
				this.attachToWrapper(v, targetWrapper, attachmentType);
				this.Renderer.GLContext.BindFrameBuffer(null);
				shouldBeDefault = true;
			} else {
				this.attachToWrapper(v, targetWrapper, attachmentType);
			}
		});
		if (shouldBeDefault) {
			if (onDefaultBuffer) onDefaultBuffer();
		} else {
			onBind();
		}
	}

	private attachToWrapper(v: FboBindData, targetWrapper: FBOWrapper, targetAttachment: FrameBufferAttachmentType) {
		if (!v.type || v.type == "texture") {
			targetWrapper.attachTexture(targetAttachment, <TextureBase>v.texture);
		} else if (v.type = "rbo") {
			targetWrapper.attachRBO(targetAttachment, <RBO>v.texture);
		} else {
			console.error("unknown bind type!");
		}
	}

	/**
	 * Get default fbo that is allocated for this renderer.
	 */
	public get DefaultFBO(): FBO {
		return JThreeContextProxy.getJThreeContext().ResourceManager.getFBO(this.Renderer.ID + ".fbo.default");
	}

	/**
	 * Get default rbo that is allocated for this renderer.
	 */
	public get DefaultRBO(): RBO {
		return JThreeContextProxy.getJThreeContext().ResourceManager.getRBO(this.Renderer.ID + ".rbo.default");
	}

	protected get Context()
	{
		return JThreeContextProxy.getJThreeContext();
	}
}

export = RenderStageBase;
