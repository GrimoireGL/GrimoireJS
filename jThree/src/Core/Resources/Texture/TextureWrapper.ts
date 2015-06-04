import ResourceWrapper = require('../ResourceWrapper');
import ContextManagerBase = require('../../ContextManagerBase');
import TextureTargetType = require('../../../Wrapper/TargetTextureType');
import TextureParameterType = require('../../../Wrapper/Texture/TextureParameterType');
import TextureMinFilterType = require('../../../Wrapper/Texture/TextureMinFilterType');
import TextureMagFilterType = require('../../../Wrapper/Texture/TextureMagFilterType');
import TextureWrapType = require('../../../Wrapper/Texture/TextureWrapType');
import TextureInternalFormat = require('../../../Wrapper/TextureInternalFormatType');
import Texture = require('./Texture');
import TextureType = require('../../../Wrapper/TextureType');
import TextureRegister = require('../../../Wrapper/Texture/TextureRegister');
class TextureWrapper extends ResourceWrapper
{
  constructor(contextManager:ContextManagerBase,parent:Texture)
  {
    super(contextManager);
    this.parentTexture=parent;
  }

  private targetTexture:WebGLTexture;

  private initialized:boolean;

  private parentTexture:Texture;

  init()
  {
    if(this.initialized)return;
    this.targetTexture = this.WebGLContext.CreateTexture();
    this.WebGLContext.BindTexture(TextureTargetType.Texture2D,this.targetTexture);
    this.WebGLContext.TexImage2D(TextureTargetType.Texture2D,0,TextureInternalFormat.RGBA,TextureInternalFormat.RGBA,TextureType.UnsignedByte,this.parentTexture.ImageSource);
    this.applyTextureParameters();
    this.WebGLContext.GenerateMipmap(TextureTargetType.Texture2D);
    this.initialized=true;
    this.WebGLContext.BindTexture(TextureTargetType.Texture2D,null);
  }

  private applyTextureParameters():void
  {
    // this.WebGLContext.TexParameteri(TextureTargetType.Texture2D,TextureParameterType.MinFilter,this.parentTexture.MinFilter);
    // this.WebGLContext.TexParameteri(TextureTargetType.Texture2D,this.WebGLContext.,this.parentTexture.MagFilter);
    // this.WebGLContext.TexParameteri(TextureTargetType.Texture2D,TextureParameterType.WrapS,this.parentTexture.SWrap);
    // this.WebGLContext.TexParameteri(TextureTargetType.Texture2D,TextureParameterType.WrapT,this.parentTexture.TWrap);
  }

  public bind(register:TextureRegister):void
  {
    this.WebGLContext.ActiveTexture(register);
    this.WebGLContext.BindTexture(TextureTargetType.Texture2D,this.targetTexture);
  }
}

export = TextureWrapper;
