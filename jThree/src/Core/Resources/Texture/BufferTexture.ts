import BufferTextureWrapper from "./BufferTextureWrapper";
import TextureFormat from "../../../Wrapper/TextureInternalFormatType";
import ElementFormat from "../../../Wrapper/TextureType";
import TextureMinFilterType from "../../../Wrapper/Texture/TextureMinFilterType";
import TextureMagFilterType from "../../../Wrapper/Texture/TextureMagFilterType";
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

  constructor(width: number, height: number, textureFormat: TextureFormat, elementFormat: ElementFormat, textureName: string) {
    super(textureName);
    this.width = width;
    this.height = height;
    this.textureFormat = textureFormat;
    this.elementFormat = elementFormat;
    if (this.elementFormat === ElementFormat.Float) {
      this.MinFilter = TextureMinFilterType.Nearest;
      this.MagFilter = TextureMagFilterType.Nearest;
    }
  }

  protected getInstanceForRenderer(canvas: Canvas): BufferTextureWrapper {
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
