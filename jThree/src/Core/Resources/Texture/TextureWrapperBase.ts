import ResourceWrapper = require('../ResourceWrapper');

class TextureWrapperBase extends ResourceWrapper
{	
  private minFilter: TextureMinFilterType=TextureMinFilterType.LinearMipmapLinear;
  private magFilter: TextureMagFilterType=TextureMagFilterType.Linear;
  private tWrap: TextureWrapType=TextureWrapType.ClampToEdge;
  private sWrap: TextureWrapType=TextureWrapType.ClampToEdge;
  public get MinFilter(): TextureMinFilterType {
    return this.minFilter;
  }
  public set MinFilter(value: TextureMinFilterType) {
    this.minFilter = value;
  }

  public get MagFilter(): TextureMagFilterType {
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
}
export = TextureWrapperBase;