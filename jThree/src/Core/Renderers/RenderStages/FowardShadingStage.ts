import JThreeObject = require('./../../../Base/JThreeObject');
import RendererBase = require('../RendererBase');
import SceneObject = require('../../SceneObject');
import Material = require('../../Materials/Material');
import RenderStageBase = require('./RenderStageBase');
import Scene = require('../../Scene');
import FBO = require('../../Resources/FBO/FBO');
import RBO = require('../../Resources/RBO/RBO');
import ResolvedChainInfo = require('../ResolvedChainInfo');
import JThreeContextProxy = require('../../JThreeContextProxy')
import FrameBufferAttachmentType = require('../../../Wrapper/FrameBufferAttachmentType');
import ClearTargetType = require("../../../Wrapper/ClearTargetType");
class FowardShadingStage extends RenderStageBase {
	private fbo: FBO;
	constructor(renderer: RendererBase) {
		super(renderer);
		var context = JThreeContextProxy.getJThreeContext();
		var rm=context.ResourceManager;
		this.fbo=rm.getFBO("jthree.fbo.default");
		var rbo=rm.getRBO("jthree.rbo.default");
		this.fbo.getForContext(renderer.ContextManager).attachRBO(FrameBufferAttachmentType.DepthAttachment,rbo);
	}

	public preBeginStage(scene: Scene, passCount: number, texs: ResolvedChainInfo) {
		this.bindAsOutBuffer(this.fbo,[{
			texture:texs["OUT"],
			target:0,
			isOptional:false
		}],()=>{
			this.Renderer.GLContext.Clear(ClearTargetType.ColorBits|ClearTargetType.DepthBits)
		});
	}

	public render(scene: Scene, object: SceneObject, passCount: number, texs: ResolvedChainInfo) {
		var geometry = object.Geometry;
		if (!geometry) return;
		var material = object.getMaterial("jthree.materials.forematerial");
		if (!material || !material.Loaded) return;
		material.configureMaterial(scene, this.Renderer, object, texs);
		geometry.drawElements(this.Renderer.ContextManager);
	}

	public needRender(scene: Scene, object: SceneObject, passCount: number): boolean {
		return true;
	}
}

export = FowardShadingStage;