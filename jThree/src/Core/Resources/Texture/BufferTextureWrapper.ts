import ResourceWrapper = require('../ResourceWrapper')
import CanvasManagerBase = require('../../ContextManagerBase')
import TargetTextureType = require('../../../Wrapper/TargetTextureType')
import TextureFormat = require('../../../Wrapper/TextureInternalFormatType');
import ElementFormat = require('../../../Wrapper/TextureType');
import BufferTexture = require('./BufferTexture')
import TextureParameterType = require('../../../Wrapper/Texture/TextureParameterType');

class BufferTextureWrapper extends ResourceWrapper
{
	constructor(ownerCanvas:CanvasManagerBase,parent:BufferTexture)
	{
		super(ownerCanvas);
		this.parent=parent;
	}
	
	private initialized:boolean=false;
	
	private parent:BufferTexture;
	
	private targetTexture:WebGLTexture;
	
	public get TargetTexture():WebGLTexture
	{
		return this.targetTexture;
	}
	
	init()
	{
		if(this.initialized)return;
		this.targetTexture= this.WebGLContext.CreateTexture();
		this.WebGLContext.BindTexture(TargetTextureType.Texture2D,this.targetTexture);
		this.WebGLContext.TexImage2D(TargetTextureType.Texture2D,0,this.parent.TextureFormat,this.parent.Width,this.parent.Height,0,this.parent.ElementFormat,null);
		this.applyTextureParameters();
	}
	
	  private applyTextureParameters():void
  {
    this.WebGLContext.TexParameteri(TargetTextureType.Texture2D,TextureParameterType.MinFilter,this.parent.MinFilter);
    this.WebGLContext.TexParameteri(TargetTextureType.Texture2D,TextureParameterType.MagFilter,this.parent.MagFilter);
     this.WebGLContext.TexParameteri(TargetTextureType.Texture2D,TextureParameterType.WrapS,this.parent.SWrap);
    this.WebGLContext.TexParameteri(TargetTextureType.Texture2D,TextureParameterType.WrapT,this.parent.TWrap);
  }

}

export = BufferTextureWrapper;