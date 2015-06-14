import ContextSafeResourceContainer = require('../ContextSafeResourceContainer');
import BufferTextureWrapper = require('./BufferTextureWrapper');
import TextureFormat = require('../../../Wrapper/TextureInternalFormatType');
import ElementFormat = require('../../../Wrapper/TextureType');
import JThreeContext = require('../../JThreeContext');
import TextureParameterType = require('../../../Wrapper/Texture/TextureParameterType');
import TextureMinFilterType = require('../../../Wrapper/Texture/TextureMinFilterType');
import TextureMagFilterType = require('../../../Wrapper/Texture/TextureMagFilterType');
import ContextManagerBase = require('../../ContextManagerBase');
import TextureWrapType = require('../../../Wrapper/Texture/TextureWrapType');
class BufferTexture extends ContextSafeResourceContainer<BufferTextureWrapper>
{
	private width:number;
	
	get Width():number
	{
		return this.width;
	}
	
	private height:number;
	
	get Height():number
	{
		return this.height;
	}
	
	private textureFormat:TextureFormat;
	
	get TextureFormat():TextureFormat
	{
		return this.textureFormat;
	}
	
	private elementFormat:ElementFormat;
	
	get ElementFormat():ElementFormat
	{
		return this.elementFormat;
	}
	private minFilter: TextureMinFilterType=TextureMinFilterType.LinearMipmapLinear;
  private magFilter: TextureMagFilterType=TextureMagFilterType.Linear;;
  private tWrap: TextureWrapType=TextureWrapType.ClampToEdge;
  private sWrap: TextureWrapType=TextureWrapType.ClampToEdge;
  public get MinFilter(): TextureMinFilterType {
    return this.minFilter;
  }
  public set MinFilter(value: TextureMinFilterType) {
    this.minFilter = value;
  }

  public get MagFiltrer(): TextureMagFilterType {
    return this.magFilter;
  }
  public set MagFilter(value: TextureMagFilterType) {
    this.magFilter = value;
  }

  public get SWrap(): TextureWrapType {
    return this.sWrap;
  }

  public set SWrap(value: TextureWrapType) {
    this.sWrap = value;
  }

  public get TWrap(): TextureWrapType {
    return this.tWrap;
  }

  public set TWrap(value: TextureWrapType) {
    this.tWrap = value;
  }
	
	
	constructor(context:JThreeContext,width:number,height:number,textureFormat:TextureFormat,elementFormat:ElementFormat)
	{
		super(context);
		this.width=width;
		this.height=height;
		this.textureFormat=textureFormat;
		this.elementFormat=elementFormat;
		debugger;
	}
	
	  protected getInstanceForRenderer(contextManager: ContextManagerBase): BufferTextureWrapper {
      var textureWrapper=new BufferTextureWrapper(contextManager,this);
      return textureWrapper;
  }
	
	
}

export = BufferTexture;