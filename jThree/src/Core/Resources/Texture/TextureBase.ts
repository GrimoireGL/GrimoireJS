import ContextSafeResourceContainer from "../ContextSafeResourceContainer";
import TextureWrapperBase from "./TextureWrapperBase";
import JThreeEvent from "../../../Base/JThreeEvent";
import {Action2} from "../../../Base/Delegates";
/**
 *
 */
class TextureBase extends ContextSafeResourceContainer<TextureWrapperBase> {

  protected textureFormat: number = WebGLRenderingContext.RGBA;
  protected elementFormat: number = WebGLRenderingContext.UNSIGNED_BYTE;
  private targetTextureType: number = WebGLRenderingContext.TEXTURE_2D;
  private onFilterParameterChangedHandler: JThreeEvent<number> = new JThreeEvent<number>();
  private minFilter: number = WebGLRenderingContext.NEAREST;
  private magFilter: number = WebGLRenderingContext.NEAREST;
  private tWrap: number = WebGLRenderingContext.CLAMP_TO_EDGE;
  private sWrap: number = WebGLRenderingContext.CLAMP_TO_EDGE;
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
    this.targetTextureType = isCubeTexture ? WebGLRenderingContext.TEXTURE_CUBE_MAP : WebGLRenderingContext.TEXTURE_2D;
    this.initializeForFirst();
  }

  public get TargetTextureType() {
    return this.targetTextureType;
  }

  public get TextureFormat(): number {
    return this.textureFormat;
  }

  public get ElementFormat(): number {
    return this.elementFormat;
  }

  public get FlipY(): boolean {
    return this.flipY;
  }

  public set FlipY(val: boolean) {
    this.flipY = val;
  }

  public get MinFilter(): number {
    return this.minFilter;
  }
  public set MinFilter(value: number) {
    if (value === this.minFilter) {
      return;
    }
    this.minFilter = value;
    this.onFilterParameterChangedHandler.fire(this, WebGLRenderingContext.TEXTURE_MIN_FILTER);
  }

  public get MagFilter(): number {
    return this.magFilter;
  }
  public set MagFilter(value: number) {
    if (value === this.magFilter) {
      return;
    }
    this.magFilter = value;
    this.onFilterParameterChangedHandler.fire(this, WebGLRenderingContext.TEXTURE_MAG_FILTER);
  }

  public get SWrap(): number {
    return this.sWrap;
  }

  public set SWrap(value: number) {
    if (this.sWrap === value) {
      return;
    }
    this.sWrap = value;
    this.onFilterParameterChangedHandler.fire(this, WebGLRenderingContext.TEXTURE_WRAP_S);
  }

  public get TWrap(): number {
    return this.tWrap;
  }

  public set TWrap(value: number) {
    if (this.tWrap === value) {
      return;
    }
    this.tWrap = value;
    this.onFilterParameterChangedHandler.fire(this, WebGLRenderingContext.TEXTURE_WRAP_T);
  }

  public onFilterParameterChanged(handler: Action2<TextureBase, number>): void {
    this.onFilterParameterChangedHandler.addListener(handler);
  }

  public generateMipmapIfNeed() {
    switch (this.MinFilter) {
      case WebGLRenderingContext.LINEAR_MIPMAP_LINEAR:
      case WebGLRenderingContext.LINEAR_MIPMAP_NEAREST:
      case WebGLRenderingContext.NEAREST_MIPMAP_LINEAR:
      case WebGLRenderingContext.NEAREST_MIPMAP_NEAREST:
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
