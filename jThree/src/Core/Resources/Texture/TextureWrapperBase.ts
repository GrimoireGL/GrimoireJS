import ResourceWrapper = require('../ResourceWrapper');
import TextureParameterType = require('../../../Wrapper/Texture/TextureParameterType');
import TextureBase = require('TextureBase');
import ContextManagerBase = require('../../ContextManagerBase');
import TextureRegister = require("../../../Wrapper/Texture/TextureRegister");

class TextureWrapperBase extends ResourceWrapper
{	

    protected static altTextureBuffer: Float32Array = new Uint8Array([255, 0, 255, 255]);

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
  private applyTextureParameter() {
      if (!this.WebGLContext.IsTexture(this.TargetTexture))return;
      this.bind();
    this.WebGLContext.TexParameteri(this.Parent.TargetTextureType,TextureParameterType.MinFilter,this.parent.MinFilter);
    this.WebGLContext.TexParameteri(this.Parent.TargetTextureType,TextureParameterType.MagFilter,this.parent.MagFilter);
    this.WebGLContext.TexParameteri(this.Parent.TargetTextureType,TextureParameterType.WrapS,this.parent.SWrap);
    this.WebGLContext.TexParameteri(this.Parent.TargetTextureType,TextureParameterType.WrapT,this.parent.TWrap);
  }

    public bind() {
        if (this.targetTexture!==null) this.WebGLContext.BindTexture(this.Parent.TargetTextureType, this.targetTexture);
        else {
            this.WebGLContext.BindTexture(this.Parent.TargetTextureType, null);
        }
  }

    public registerTexture(registerIndex: number):boolean {
        if (!this.WebGLContext.IsTexture(this.targetTexture)) {
            this.WebGLContext.ActiveTexture(TextureRegister.Texture0+registerIndex);
            this.WebGLContext.BindTexture(this.parent.TargetTextureType, null);
            return false;
        }
        this.WebGLContext.ActiveTexture(TextureRegister.Texture0 +registerIndex);
        this.applyTextureParameter();
        this.bind();
        return true;
    }

  public init()
  {
    
  }
 
}
export = TextureWrapperBase;