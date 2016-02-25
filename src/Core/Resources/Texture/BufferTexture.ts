import BufferTextureWrapper from "./BufferTextureWrapper";
import Canvas from "../../Canvas/Canvas";
import TextureBase from "./TextureBase";
/**
 * Buffer texture is a texture created from array programatically.
 */
class BufferTexture extends TextureBase {
  private _width: number;

  public get Width(): number {
    return this._width;
  }

  private _height: number;

  public get Height(): number {
    return this._height;
  }

  constructor(width: number, height: number, textureFormat: number, elementFormat: number, textureName: string) {
    super(textureName);
    this._width = width;
    this._height = height;
    this.textureFormat = textureFormat;
    this.elementFormat = elementFormat;
    if (this.elementFormat === WebGLRenderingContext.FLOAT) {
      this.MinFilter = WebGLRenderingContext.NEAREST;
      this.MagFilter = WebGLRenderingContext.NEAREST;
    }
  }

  protected __createWrapperForCanvas(canvas: Canvas): BufferTextureWrapper {
    return new BufferTextureWrapper(canvas, this);
  }

  public resize(width: number, height: number): void {
    if (this._width !== width || this._height !== height) {
      this._width = width;
      this._height = height;
      this.each(v => (<BufferTextureWrapper>v).resize(width, height));
    }
  }

  public updateTexture(buffer: ArrayBufferView): void {
    this.each(t => {
      (<BufferTextureWrapper>t).updateTexture(buffer);
    });
  }

}

export default BufferTexture;
