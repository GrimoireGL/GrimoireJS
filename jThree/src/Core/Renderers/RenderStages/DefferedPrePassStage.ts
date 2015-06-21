import RendererBase = require('../RendererBase');
import SceneObject = require('../../SceneObject');
import Material = require('../../Materials/Material');
import RenderStageBase = require('./RenderStageBase');
import TextureBase = require('./../../Resources/Texture/TextureBase');
import FBO = require('./../../Resources/FBO/FBO');
import JThreeContextProxy = require('../../JThreeContextProxy');
import FrameBufferAttachmentType = require('../../../Wrapper/FrameBufferAttachmentType');
class DefferedPrePassStage extends RenderStageBase
{
	private rb1Texture:TextureBase;
	
	private rb1FBO:FBO;
	
	constructor(renderer:RendererBase)
	{
		super(renderer);
		var context = JThreeContextProxy.getJThreeContext();
		this.rb1Texture=context.ResourceManager.createTexture("rb1",512,512);
		this.rb1FBO=context.ResourceManager.createFBO("rb1");
		this.rb1FBO.getForContext(renderer.ContextManager).attachTexture(FrameBufferAttachmentType.ColorAttachment0,this.rb1Texture);
	}
	public preBeginStage()
	{
		this.rb1FBO.getForContext(this.Renderer.ContextManager).bind();
	}
	
	public postEndStage()
	{
		this.rb1FBO.getForContext(this.Renderer.ContextManager).unbind();
	}
	
	public render(object: SceneObject, material: Material) {
		var geometry = object.Geometry;
		if (!geometry || !material) return;
		material.configureMaterial(this.Renderer, object);
		geometry.drawElements(this.Renderer.ContextManager);
	}

	public needRender(object: SceneObject, material: Material): boolean {
		return true;
	}
}
export = DefferedPrePassStage;