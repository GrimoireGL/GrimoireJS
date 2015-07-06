import JThreeObject = require('./../../../../Base/JThreeObject');
import RendererBase = require('../../RendererBase');
import SceneObject = require('../../../SceneObject');
import Material = require('../../../Materials/Material');
import RenderStageBase = require('./../RenderStageBase');
import Scene = require('../../../Scene');
import FBO = require('../../../Resources/FBO/FBO');
import RBO = require('../../../Resources/RBO/RBO');
import ResolvedChainInfo = require('../../ResolvedChainInfo');
import JThreeContextProxy = require('../../../JThreeContextProxy')
import FrameBufferAttachmentType = require('../../../../Wrapper/FrameBufferAttachmentType');
import ClearTargetType = require("../../../../Wrapper/ClearTargetType");
import DepthMaterial = require('../../../Materials/DepthMaterial');
import Matrix = require('../../../../Math/Matrix');
class DirectionalLightDepthStage extends RenderStageBase {
	private fbo: FBO;
	
	private mat:DepthMaterial=new DepthMaterial();
	
	public get VP():Matrix
	{
		return this.mat.VP;
	}
	
	public set VP(mat:Matrix)
	{
		this.mat.VP=mat;
	}
	constructor(renderer: RendererBase) {
		super(renderer);
		var context = JThreeContextProxy.getJThreeContext();
		var rm=context.ResourceManager;
		this.fbo=rm.createFBO(renderer.ID+"depth");
		var rbo=rm.getRBO("jthree.rbo.default");
		this.fbo.getForContext(renderer.ContextManager).attachRBO(FrameBufferAttachmentType.DepthAttachment,rbo);
		var tex =rm.createTexture("test.direct",512,512);
		this.fbo.getForContext(renderer.ContextManager).attachTexture(FrameBufferAttachmentType.ColorAttachment0,tex);
		
	}

	public preBeginStage(scene: Scene, passCount: number, texs: ResolvedChainInfo) {
		if (texs["OUT"] == null) this.fbo.getForContext(this.Renderer.ContextManager).attachTexture(FrameBufferAttachmentType.ColorAttachment0,null);
		else{
			this.fbo.getForContext(this.Renderer.ContextManager).attachTexture(FrameBufferAttachmentType.DepthAttachment,texs["OUT"]);
			this.Renderer.GLContext.Clear(ClearTargetType.ColorBits|ClearTargetType.DepthBits)
		}
	}

	public render(scene: Scene, object: SceneObject, passCount: number, texs: ResolvedChainInfo) {
		var geometry = object.Geometry;
		if (!geometry) return;
		this.mat.configureMaterial(scene, this.Renderer, object, texs);
		geometry.drawElements(this.Renderer.ContextManager);
	}

	public needRender(scene: Scene, object: SceneObject, passCount: number): boolean {
		return true;
	}
}

export = DirectionalLightDepthStage;