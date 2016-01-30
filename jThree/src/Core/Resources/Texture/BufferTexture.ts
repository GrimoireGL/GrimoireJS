import BufferTextureWrapper from "./BufferTextureWrapper";
import Canvas from "../../Canvas/Canvas";
import TextureBase from "./TextureBase";
/**
 * Buffer texture is a texture created from array programatically.
 */
class BufferTexture extends TextureBase {
  private width: number;

  public get Width(): number {
    return this.width;
  }

  private height: number;

  public get Height(): number {
    return this.height;
  }

  constructor(width: number, height: number, textureFormat: number, elementFormat: number, textureName: string) {
    super(textureName);
    this.width = width;
    this.height = height;
    this.textureFormat = textureFormat;
    this.elementFormat = elementFormat;
    if (this.elementFormat === WebGLRenderingContext.FLOAT) {
      this.MinFilter = WebGLRenderingContext.NEAREST;
      this.MagFilter = WebGLRenderingContext.NEAREST;
    }
  }

  protected createWrapperForCanvas(canvas: Canvas): BufferTextureWrapper {
    return new BufferTextureWrapper(canvas, this);
  }

  public resize(width: number, height: number) {
    if (this.width !== width || this.height !== height) {
      this.width = width;
      this.height = height;
      this.each(v => (<BufferTextureWrapper>v).resize(width, height));
    }
  }

  public updateTexture(buffer: ArrayBufferView) {
    this.each(t => {
      (<BufferTextureWrapper>t).updateTexture(buffer);
    });
  }

}

export default BufferTexture;
