import ResourceWrapper = require('../ResourceWrapper');
import ContextManagerBase = require('../../ContextManagerBase');
class TextureWrapper extends ResourceWrapper
{
  constructor(contextManager:ContextManagerBase)
  {
    super(contextManager);
  }

  private targetTexture:WebGLTexture;

  private initialized:boolean;

  init()
  {
    if(this.initialized)return;
    this.targetTexture = this.WebGLContext.CreateTexture();

  }
}

export = TextureWrapper;
