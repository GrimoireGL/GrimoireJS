import TextureWrapperBase = require('./TextureWrapperBase');
import ContextManagerBase = require('../../ContextManagerBase');
import TextureTargetType = require('../../../Wrapper/TargetTextureType');
import TextureParameterType = require('../../../Wrapper/Texture/TextureParameterType');
import TextureMinFilterType = require('../../../Wrapper/Texture/TextureMinFilterType');
import TextureMagFilterType = require('../../../Wrapper/Texture/TextureMagFilterType');
import TextureWrapType = require('../../../Wrapper/Texture/TextureWrapType');
import TextureInternalFormat = require('../../../Wrapper/TextureInternalFormatType');
import TextureType = require('../../../Wrapper/TextureType');
import Texture = require('./Texture');
import TextureRegister = require('../../../Wrapper/Texture/TextureRegister');
class TextureWrapper extends TextureWrapperBase
{
  constructor(contextManager:ContextManagerBase,parent:Texture)
  {
    super(contextManager,parent);
  }
  private parentTexture:Texture;

  init()
  {
    if(this.Initialized)return;
    this.setTargetTexture(this.WebGLContext.CreateTexture());
    this.WebGLContext.BindTexture(TextureTargetType.Texture2D,this.TargetTexture);
    this.WebGLContext.TexImage2D(TextureTargetType.Texture2D,0,TextureInternalFormat.RGBA,TextureInternalFormat.RGBA,TextureType.UnsignedByte,this.parentTexture.ImageSource);
    this.applyTextureParameters();
    this.WebGLContext.GenerateMipmap(TextureTargetType.Texture2D);
    this.WebGLContext.BindTexture(TextureTargetType.Texture2D,null);
    this.setInitialized();
  }

  private applyTextureParameters():void
  {
    this.WebGLContext.TexParameteri(TextureTargetType.Texture2D,TextureParameterType.MinFilter,this.parentTexture.MinFilter);
    this.WebGLContext.TexParameteri(TextureTargetType.Texture2D,TextureParameterType.MagFilter,this.parentTexture.MagFilter);
     this.WebGLContext.TexParameteri(TextureTargetType.Texture2D,TextureParameterType.WrapS,this.parentTexture.SWrap);
    this.WebGLContext.TexParameteri(TextureTargetType.Texture2D,TextureParameterType.WrapT,this.parentTexture.TWrap);
  }
}

export = TextureWrapper;
