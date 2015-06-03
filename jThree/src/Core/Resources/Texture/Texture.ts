import ContextSafeResourceContainer = require('../ContextSafeResourceContainer');
import TextureWrapper = require('./TextureWrapper');
import TextureParameterType = require('../../../Wrapper/Texture/TextureParameterType');
import TextureMinFilterType = require('../../../Wrapper/Texture/TextureMinFilterType');
import TextureMagFilterType = require('../../../Wrapper/Texture/TextureMagFilterType');
import ContextManagerBase = require('../../ContextManagerBase');
import TextureWrapType = require('../../../Wrapper/Texture/TextureWrapType');
import JThreeContext = require('../../JThreeContext');
type ImageSource = HTMLCanvasElement|HTMLImageElement|ImageData|ArrayBufferView;
class Texture extends ContextSafeResourceContainer<TextureWrapper>
{
  constructor(context:JThreeContext,source:ImageSource)
  {
    super(context);
    this.imageSource=source;
  }

  private minFilter: TextureMinFilterType=TextureMinFilterType.Nearest;
  private magFilter: TextureMagFilterType=TextureMagFilterType.Nearest;
  private tWrap: TextureWrapType=TextureWrapType.ClampToEdge;
  private sWrap: TextureWrapType=TextureWrapType.ClampToEdge;
  private imageSource:ImageSource;

  public get ImageSource():ImageSource
  {
    return this.imageSource;
  }
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

  protected getInstanceForRenderer(contextManager: ContextManagerBase): TextureWrapper {
      return new TextureWrapper(contextManager,this);
  }
}

export = Texture;
