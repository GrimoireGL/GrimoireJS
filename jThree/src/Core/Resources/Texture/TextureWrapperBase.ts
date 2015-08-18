import ResourceWrapper = require('../ResourceWrapper');
import TextureParameterType = require('../../../Wrapper/Texture/TextureParameterType');
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
  
  private targetTexture:WebGLTexture=null;
  
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
  protected applyTextureParameter() {
      if (!this.WebGLContext.IsTexture(this.TargetTexture))return;
      this.bind();
    this.WebGLContext.TexParameteri(this.Parent.TargetTextureType,TextureParameterType.MinFilter,this.parent.MinFilter);
    this.WebGLContext.TexParameteri(this.Parent.TargetTextureType,TextureParameterType.MagFilter,this.parent.MagFilter);
    this.WebGLContext.TexParameteri(this.Parent.TargetTextureType,TextureParameterType.WrapS,this.parent.SWrap);
    this.WebGLContext.TexParameteri(this.Parent.TargetTextureType,TextureParameterType.WrapT,this.parent.TWrap);
  }
  
  public bind()
  {
    this.WebGLContext.BindTexture(this.Parent.TargetTextureType,this.targetTexture);
  }
  
  public init()
  {
    
  }
 
}
export = TextureWrapperBase;