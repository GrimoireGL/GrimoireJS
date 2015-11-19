import JThreeObject = require('./../../../Base/JThreeObject');
import RendererBase = require('../RendererBase');
import SceneObject = require('../../SceneObject');
import Scene = require('../../Scene')
import Program = require('../../Resources/Program/Program');
import JThreeContextProxy = require('../../JThreeContextProxy');
import ShaderType = require("../../../Wrapper/ShaderType");
import ResolvedChainInfo = require('../ResolvedChainInfo');
import TextureBase = require('../../Resources/Texture/TextureBase');
import RBO = require('../../Resources/RBO/RBO');
import FBO = require('../../Resources/FBO/FBO');
import FBOWrapper = require('../../Resources/FBO/FBOWrapper');
import Delegates = require('../../../Base/Delegates');
import GLCullMode = require('../../../Wrapper/GLCullMode');
import GLFeature = require('../../../Wrapper/GLFeatureType');
import FrameBufferAttachmentType = require('../../../Wrapper/FrameBufferAttachmentType');
import FboBindData = require("../FBOBindData");
import RenderStageConfig = require("../RenderStageConfig");
import ContextComponents = require("../../../ContextComponents");
import JThreeContext = require("../../../NJThreeContext");
import ResourceManager = require("../../ResourceManager");
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

	public get GL()
	{
		return this.Renderer.GL;
	}

	private get ResourceManager()
	{
		return JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
	}

	constructor(renderer: RendererBase) {
		super();
		this.renderer = renderer;
	}

	public preAllStage(scene: Scene,texs: ResolvedChainInfo)
	{

	}

	public postAllStage(scene:Scene,texs:ResolvedChainInfo)
	{

	}

	/**
	 * This method will be called before process render in each pass
	 */
	public preBeginStage(scene: Scene, techniqueIndex: number, texs: ResolvedChainInfo) {

	}
	/**
	 * This method will be called after process render in each pass.
	 */
	public postEndStage(scene: Scene, techniqueIndex: number, texs: ResolvedChainInfo) {
		this.Renderer.GL.flush();
	}

	public render(scene: Scene, object: SceneObject, techniqueIndex: number, texs: ResolvedChainInfo) {

	}

	public needRender(scene: Scene, object: SceneObject, techniqueIndex: number): boolean {
		return false;
	}

	public getTechniqueCount(scene: Scene) {
		return 1;
	}

	public get TargetGeometry(): string {
		return "scene";
	}

	public applyStageConfig() {
		//cull enabled/disabled
		this.applyStageConfigToGLFeature(this.RenderStageConfig.cullFace, GLFeature.CullFace, true);
        this.applyStageConfigToGLFeature(this.RenderStageConfig.depthTest, GLFeature.DepthTest, true);
        this.applyStageConfigToGLFeature(this.RenderStageConfig.blend,GLFeature.Blend,true);
		//cull face direction
		if (!this.RenderStageConfig.cullFront) {
			this.GL.cullFace(GLCullMode.Front);
		} else {
			this.GL.cullFace(GLCullMode.Back);
		}
	}

	private applyStageConfigToGLFeature(flag: boolean, target: GLFeature, def: boolean) {
		if (typeof flag === 'undefined') {
			flag = def;
		}
		if (flag) {
			this.GL.enable(target);
		}
		else {
			this.GL.disable(target);
		}
	}

	public get RenderStageConfig(): RenderStageConfig {
		return {
			cullFace: true,
			cullFront: false,
      depthTest: true,
      blend:true
		};
	}

	protected loadProgram(vsid: string, fsid: string, pid: string, vscode: string, fscode: string): Program {
        var rm = this.ResourceManager;
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
		    var attachmentType;
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
				this.Renderer.GL.bindFramebuffer(this.Renderer.GL.FRAMEBUFFER,null);
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
		if (!v.type || v.type === "texture") {
			targetWrapper.attachTexture(targetAttachment, <TextureBase>v.texture);
		} else if (v.type === "rbo") {
			targetWrapper.attachRBO(targetAttachment, <RBO>v.texture);
		} else {
			console.error("unknown bind type!");
		}
    }

    protected drawForMaterials(scene:Scene,object:SceneObject,techniqueIndex:number,texs:ResolvedChainInfo,materialGroup:string) {
        var materials = object.getMaterials(materialGroup);
        for (var i = 0; i < materials.length; i++)
        {
            var material = materials[i];
            if (!material || !material.Initialized||!material.Enabled) return;
            for (var pass = 0; pass < material.getPassCount(techniqueIndex); pass++)
            {
                material.configureMaterial(scene, this.Renderer, object, texs,techniqueIndex, pass);
                object.Geometry.drawElements(this.Renderer.ContextManager, material);
            }
        }
    }

	/**
	 * Get default fbo that is allocated for this renderer.
	 */
	public get DefaultFBO(): FBO {
		return this.ResourceManager.getFBO(this.Renderer.ID + ".fbo.default");
	}

	/**
	 * Get default rbo that is allocated for this renderer.
	 */
	public get DefaultRBO(): RBO {
		return this.ResourceManager.getRBO(this.Renderer.ID + ".rbo.default");
	}

	protected get Context()
	{
		return JThreeContextProxy.getJThreeContext();
	}
}

export = RenderStageBase;
