import RendererBase = require('../RendererBase');
import SceneObject = require('../../SceneObject');
import Material = require('../../Materials/Material');
import RenderStageBase = require('./RenderStageBase');
import TextureBase = require('./../../Resources/Texture/TextureBase');
import FBO = require('./../../Resources/FBO/FBO');
import JThreeContextProxy = require('../../JThreeContextProxy');
import FrameBufferAttachmentType = require('../../../Wrapper/FrameBufferAttachmentType');
import ClearTargetType = require("../../../Wrapper/ClearTargetType");
import TextureFormat = require('../../../Wrapper/TextureInternalFormatType');
import ElementFormat = require('../../../Wrapper/TextureType');
import TextureMinFilterType = require('../../../Wrapper/Texture/TextureMinFilterType');
import Scene = require('../../Scene');
import Program = require('../../Resources/Program/Program');
class DefferedPrePassStage extends RenderStageBase
{
	private rb1Texture:TextureBase;
	
	private rb1FBO:FBO;
	
	private rb2Texture:TextureBase;
	
	private rbDepthTexture:TextureBase;
	
	private rb2FBO:FBO;
	
	private rblight:TextureBase;
	
	private rbLightFBO:FBO;
	
	private lightAccumrationProgram:Program;
	
	constructor(renderer:RendererBase)
	{
		super(renderer);
		var context = JThreeContextProxy.getJThreeContext();
		var width =512,height=512;
		var id = this.Renderer.ID;
		var rm = context.ResourceManager;
		this.rb1Texture=rm.createTexture(id+".deffered.rb1",width,height);
		this.rb1FBO=rm.createFBO(id+".deffered.rb1");
		this.rb1FBO.getForContext(renderer.ContextManager).attachTexture(FrameBufferAttachmentType.ColorAttachment0,this.rb1Texture);
		this.rb2Texture=rm.createTexture(id+".deffered.rb2",width,height);
		this.rb2FBO=rm.createFBO(id+".deffered.rb2");
		this.rb2FBO.getForContext(renderer.ContextManager).attachTexture(FrameBufferAttachmentType.ColorAttachment0,this.rb2Texture);
		this.rbDepthTexture=rm.createTexture(id+".deffered.depth",width,height,TextureFormat.DEPTH_COMPONENT,ElementFormat.UnsignedShort);
		this.rbDepthTexture.MinFilter=TextureMinFilterType.Linear;
		this.rb2FBO.getForContext(renderer.ContextManager).attachTexture(FrameBufferAttachmentType.DepthAttachment,this.rbDepthTexture);
		this.rblight=rm.createTexture(id+".deffered.light",width,height);
		this.rbLightFBO=rm.createFBO("id"+"deffered.light");
		this.rbLightFBO.getForContext(renderer.ContextManager).attachTexture(FrameBufferAttachmentType.ColorAttachment0,this.rblight);
		
	}
	
	
	public preBeginStage(scene:Scene,passCount:number)
	{
		this.Renderer.GLContext.ClearColor(0,0,0,0);
		switch(passCount)
		{
			case 0:
				this.rb1FBO.getForContext(this.Renderer.ContextManager).bind();
				this.Renderer.GLContext.Clear(ClearTargetType.ColorBits|ClearTargetType.DepthBits);
			break;
			case 1:
				this.rb2FBO.getForContext(this.Renderer.ContextManager).bind();
				this.Renderer.GLContext.Clear(ClearTargetType.ColorBits|ClearTargetType.DepthBits);
			break;
		}

	}
	
	public postEndStage(scene:Scene,passCount:number)
	{
		switch(passCount)
		{
			case 0:
				this.rb1FBO.getForContext(this.Renderer.ContextManager).unbind();
			break;
			case 1:
				this.rb2FBO.getForContext(this.Renderer.ContextManager).unbind();
				this.renderLightAccumulation();
			break;
		}
	}
	
	private renderLightAccumulation()
	{
		this.rbLightFBO.getForContext(this.Renderer.ContextManager).bind();
		this.Renderer.GLContext.Clear(ClearTargetType.ColorBits|ClearTargetType.DepthBits);
		
		this.rbLightFBO.getForContext(this.Renderer.ContextManager).unbind();
	}
	
	public render(scene:Scene,object: SceneObject, material: Material,passCount:number) {
		var geometry = object.Geometry;
		if (!geometry || !material) return;
		material.configureDefferedPrePassMaterial(this.Renderer, object,passCount);
		geometry.drawElements(this.Renderer.ContextManager);
	}

	public needRender(scene:Scene,object: SceneObject, material: Material,passCount:number): boolean {
		return true;
	}
	
	public get PassCount():number
	{
		return 2;
	}
}
export = DefferedPrePassStage;