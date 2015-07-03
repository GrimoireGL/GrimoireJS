import JThreeObject = require('../../Base/JThreeObject');
import Color4 = require('../../Base/Color/Color4');
import Vector3 = require('../../Math/Vector3');
import SceneObject = require('../SceneObject');
import LightBase = require('./LightBase');
import FBO = require('../Resources/FBO/FBO');
import RBO = require('../Resources/RBO/RBO');
import TextureBase = require('../Resources/Texture/TextureBase');
import JThreeContextProxy=require('../JThreeContextProxy');
import TextureFormat = require('../../Wrapper/TextureInternalFormatType');
import ElementFormat = require('../../Wrapper/TextureType');
import ContextManagerBase = require('../ContextManagerBase');
import FrameBufferAttachmentType = require('../../Wrapper/FrameBufferAttachmentType');
import Scene = require('../Scene');
import Material = require('../Materials/Material');
import DepthMaterial = require('../Materials/DepthMaterial');
import Matrix = require('../../Math/Matrix');
import RendererBase = require('../Renderers/RendererBase');
import ClearTargetType = require('../../Wrapper/ClearTargetType');
class DirectionalLight extends LightBase
{
	constructor()
	{
		super();
		var width=512,height=512;//TODO fix this
		var rm=JThreeContextProxy.getJThreeContext().ResourceManager;
		this.shadowMapFBO=rm.createFBO("directional.test");
		this.shadowMapColTex=rm.createTexture("directional.testcol",width,height);
		this.shadowMapTexture=rm.createTexture("directional.test",width,height,TextureFormat.DEPTH_COMPONENT,ElementFormat.UnsignedShort);
		this.depthMat.VP=Matrix.multiply(Matrix.ortho(-2.828,2.828,-1,1,0,5.656),Matrix.lookAt(new Vector3(2,0.4,-2),new Vector3(0,0,-1),new Vector3(0,1,0)));
	}
	
	private shadowMapFBO:FBO;
	
	private shadowMapColTex:TextureBase;
	
	private shadowMapTexture:TextureBase;
	
	private intensity:number=1.0;
	
	private depthMat:DepthMaterial=new DepthMaterial();
	
	public get VP():Matrix
	{
		return this.depthMat.VP;
	}
	
	/**
	 * Light's intensity
	 */
	public get Intensity():number
	{
		return this.intensity;
	}
	
	/**
	 * Light's intensity
	 */
	public set Intensity(intensity:number)
	{
		this.intensity=intensity;
	}
	
	public get AliasName():string
	{
		return "jthree.lights.directionallight";
	}
	
	public beforeRender(target:ContextManagerBase)
	{
		this.shadowMapFBO.getForContext(target).attachTexture(FrameBufferAttachmentType.ColorAttachment0,this.shadowMapColTex);
		this.shadowMapFBO.getForContext(target).attachTexture(FrameBufferAttachmentType.DepthAttachment,this.shadowMapTexture);
		this.shadowMapFBO.getForContext(target).bind();
		target.Context.ClearColor(0,0,0,0);
		target.Context.Clear(ClearTargetType.ColorBits|ClearTargetType.DepthBits);
	}
	
	public afterRender(target:ContextManagerBase)
	{
		this.shadowMapFBO.getForContext(target).unbind();
	}
	
	public drawBuffer(renderer:RendererBase,scene:Scene,object: SceneObject, material: Material,passCount:number) 
	{
		if(!object.Geometry)return;
		this.depthMat.configureMaterial(scene,renderer,object);
		object.Geometry.drawElements(renderer.ContextManager);
	}
}

export = DirectionalLight;