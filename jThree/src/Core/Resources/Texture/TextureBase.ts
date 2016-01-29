import ContextSafeResourceContainer from "../ContextSafeResourceContainer";
import TextureWrapperBase from "./TextureWrapperBase";
import TextureParameterType from "../../../Wrapper/Texture/TextureParameterType";
import TextureMinFilterType from "../../../Wrapper/Texture/TextureMinFilterType";
import TextureMagFilterType from "../../../Wrapper/Texture/TextureMagFilterType";
import TextureWrapType from "../../../Wrapper/Texture/TextureWrapType";
import JThreeEvent from "../../../Base/JThreeEvent";
import {Action2} from "../../../Base/Delegates";
import TextureTargetType from "../../../Wrapper/TargetTextureType";
import ElementFormat from "../../../Wrapper/TextureType";
import TextureFormat from "../../../Wrapper/TextureInternalFormatType";
/**
 *
 */
class TextureBase extends ContextSafeResourceContainer<TextureWrapperBase> {

  protected textureFormat: TextureFormat = TextureFormat.RGBA;
  protected elementFormat: ElementFormat = ElementFormat.UnsignedByte;
  private targetTextureType: TextureTargetType = TextureTargetType.Texture2D;
  private onFilterParameterChangedHandler: JThreeEvent<TextureParameterType> = new JThreeEvent<TextureParameterType>();
  private minFilter: TextureMinFilterType = TextureMinFilterType.Nearest;
  private magFilter: TextureMagFilterType = TextureMagFilterType.Nearest;
  private tWrap: TextureWrapType = TextureWrapType.ClampToEdge;
  private sWrap: TextureWrapType = TextureWrapType.ClampToEdge;
  private flipY: boolean = false;
  private textureName: string;

  constructor(textureName: string);
  constructor(textureName: string, flipY: boolean, isCubeTexture: boolean);
  constructor(textureName: string, flipY?: boolean, isCubeTexture?: boolean) {
    super();
    if (typeof flipY === "undefined") {
      flipY = false;
    }
    if (typeof isCubeTexture === "undefined") {
      isCubeTexture = false;
    }
    this.flipY = flipY;
    this.targetTextureType = isCubeTexture ? TextureTargetType.CubeTexture : TextureTargetType.Texture2D;
    this.initializeForFirst();
  }

  public get TargetTextureType() {
    return this.targetTextureType;
  }

  public get TextureFormat(): TextureFormat {
    return this.textureFormat;
  }

  public get ElementFormat(): ElementFormat {
    return this.elementFormat;
  }

  public get FlipY(): boolean {
    return this.flipY;
  }

  public set FlipY(val: boolean) {
    this.flipY = val;
  }

  public get MinFilter(): TextureMinFilterType {
    return this.minFilter;
  }
  public set MinFilter(value: TextureMinFilterType) {
    if (value === this.minFilter) {
      return;
    }
    this.minFilter = value;
    this.onFilterParameterChangedHandler.fire(this, TextureParameterType.MinFilter);
  }

  public get MagFilter(): TextureMagFilterType {
    return this.magFilter;
  }
  public set MagFilter(value: TextureMagFilterType) {
    if (value === this.magFilter) {
      return;
    }
    this.magFilter = value;
    this.onFilterParameterChangedHandler.fire(this, TextureParameterType.MagFilter);
  }

  public get SWrap(): TextureWrapType {
    return this.sWrap;
  }

  public set SWrap(value: TextureWrapType) {
    if (this.sWrap === value) {
      return;
    }
    this.sWrap = value;
    this.onFilterParameterChangedHandler.fire(this, TextureParameterType.WrapS);
  }

  public get TWrap(): TextureWrapType {
    return this.tWrap;
  }

  public set TWrap(value: TextureWrapType) {
    if (this.tWrap === value) {
      return;
    }
    this.tWrap = value;
    this.onFilterParameterChangedHandler.fire(this, TextureParameterType.WrapT);
  }

  public onFilterParameterChanged(handler: Action2<TextureBase, TextureParameterType>): void {
    this.onFilterParameterChangedHandler.addListener(handler);
  }

  public generateMipmapIfNeed() {
    switch (this.MinFilter) {
      case TextureMinFilterType.LinearMipmapLinear:
      case TextureMinFilterType.LinearMipmapNearest:
      case TextureMinFilterType.NearestMipmapLinear:
      case TextureMinFilterType.NearestMipmapNearest:
        this.each((v) => {
          v.bind();
          v.GL.generateMipmap(this.TargetTextureType);
        });
        break;
      default:
    }
  }

  public get TextureName(): string {
    return this.textureName;
  }
}

export default TextureBase;
