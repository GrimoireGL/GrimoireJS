import ContextSafeResourceContainer from "../ContextSafeResourceContainer";
import TextureWrapperBase from "./TextureWrapperBase";
/**
 *
 */
class TextureBase extends ContextSafeResourceContainer<TextureWrapperBase> {

  protected __textureFormat: number = WebGLRenderingContext.RGBA;
  protected __elementFormat: number = WebGLRenderingContext.UNSIGNED_BYTE;
  private _targetTextureType: number = WebGLRenderingContext.TEXTURE_2D;
  private _minFilter: number = WebGLRenderingContext.NEAREST;
  private _magFilter: number = WebGLRenderingContext.NEAREST;
  private _tWrap: number = WebGLRenderingContext.CLAMP_TO_EDGE;
  private _sWrap: number = WebGLRenderingContext.CLAMP_TO_EDGE;
  private _flipY: boolean = false;
  private _textureName: string;

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
    this._flipY = flipY;
    this._targetTextureType = isCubeTexture ? WebGLRenderingContext.TEXTURE_CUBE_MAP : WebGLRenderingContext.TEXTURE_2D;
    this.__initializeForFirst();
  }

  public get TargetTextureType(): number {
    return this._targetTextureType;
  }

  public get TextureFormat(): number {
    return this.__textureFormat;
  }

  public get ElementFormat(): number {
    return this.__elementFormat;
  }

  public get FlipY(): boolean {
    return this._flipY;
  }

  public set FlipY(val: boolean) {
    this._flipY = val;
  }

  public get MinFilter(): number {
    return this._minFilter;
  }
  public set MinFilter(value: number) {
    if (value === this._minFilter) {
      return;
    }
    this._minFilter = value;
    this.emit("filter-changed", WebGLRenderingContext.TEXTURE_MIN_FILTER);
  }

  public get MagFilter(): number {
    return this._magFilter;
  }
  public set MagFilter(value: number) {
    if (value === this._magFilter) {
      return;
    }
    this._magFilter = value;
    this.emit("filter-changed", WebGLRenderingContext.TEXTURE_MAG_FILTER);
  }

  public get SWrap(): number {
    return this._sWrap;
  }

  public set SWrap(value: number) {
    if (this._sWrap === value) {
      return;
    }
    this._sWrap = value;
    this.emit("filyer-changed", WebGLRenderingContext.TEXTURE_WRAP_S);
  }

  public get TWrap(): number {
    return this._tWrap;
  }

  public set TWrap(value: number) {
    if (this._tWrap === value) {
      return;
    }
    this._tWrap = value;
    this.emit("filyer-changed", WebGLRenderingContext.TEXTURE_WRAP_T);
  }

  public generateMipmapIfNeed(): void {
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
    return this._textureName;
  }
}

export default TextureBase;
