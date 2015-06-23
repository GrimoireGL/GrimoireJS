import ResourceWrapper = require('../ResourceWrapper');
import TextureTargetType = require('../../../Wrapper/TargetTextureType');
import TextureParameterType = require('../../../Wrapper/Texture/TextureParameterType');
import TextureMinFilterType = require('../../../Wrapper/Texture/TextureMinFilterType');
import TextureMagFilterType = require('../../../Wrapper/Texture/TextureMagFilterType');
import TextureWrapType = require('../../../Wrapper/Texture/TextureWrapType');
import TextureInternalFormat = require('../../../Wrapper/TextureInternalFormatType');
import TextureType = require('../../../Wrapper/TextureType');
import TextureBase = require('TextureBase');
import ContextManagerBase = require('../../ContextManagerBase');
class TextureWrapperBase extends ResourceWrapper
{	
  constructor(owner:ContextManagerBase,parent:TextureBase)
  {
    super(owner);
    this.parent=parent;
    this.parent.onFilterParameterChanged(this.applyTextureParameter.bind(this));
  }
  private parent:TextureBase;
  
  public get Parent():TextureBase
  {
    return this.parent;
  }
  
  private targetTexture:WebGLTexture;
  
  protected setTargetTexture(texture:WebGLTexture)
  {
    this.targetTexture=texture;
  }
  
  public get TargetTexture():WebGLTexture
  {
    return this.targetTexture;
  }
  
  /**
   * apply texture parameters
   */
  protected applyTextureParameter()
  {
    this.WebGLContext.TexParameteri(TextureTargetType.Texture2D,TextureParameterType.MinFilter,this.parent.MinFilter);
    this.WebGLContext.TexParameteri(TextureTargetType.Texture2D,TextureParameterType.MagFilter,this.parent.MagFilter);
    this.WebGLContext.TexParameteri(TextureTargetType.Texture2D,TextureParameterType.WrapS,this.parent.SWrap);
    this.WebGLContext.TexParameteri(TextureTargetType.Texture2D,TextureParameterType.WrapT,this.parent.TWrap);
  }
  
  public bind()
  {
    this.WebGLContext.BindTexture(TextureTargetType.Texture2D,this.targetTexture);
  }
  
  public init()
  {
    
  }
}
export = TextureWrapperBase;