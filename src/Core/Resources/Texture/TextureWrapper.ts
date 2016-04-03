import TextureWrapperBase from "./TextureWrapperBase";
import Canvas from "../../Canvas/Canvas";
import Texture from "./Texture";
class TextureWrapper extends TextureWrapperBase {
  constructor(canvas: Canvas, parent: Texture) {
    super(canvas, parent);
  }

  public init(isChanged?: boolean): void {
    if (this.Initialized && !isChanged) {
      return;
    }
    if (this.TargetTexture == null) {
      this.__setTargetTexture(this.GL.createTexture());
    }
    this.updateTexture();
    this.GL.bindTexture(WebGLRenderingContext.TEXTURE_2D, null);
    this.__setInitialized();
  }

  public updateTexture(): void {
    const parentTexture = this.Parent as Texture;
    this.GL.bindTexture(WebGLRenderingContext.TEXTURE_2D, this.TargetTexture);
    if (parentTexture.ImageSource == null) {
      this.GL.texImage2D(WebGLRenderingContext.TEXTURE_2D, 0, WebGLRenderingContext.RGBA, 1, 1, 0, WebGLRenderingContext.RGBA, WebGLRenderingContext.UNSIGNED_BYTE, TextureWrapperBase.__altTextureBuffer);
    } else {
      this.preTextureUpload();
      this.GL.texImage2D(WebGLRenderingContext.TEXTURE_2D, 0, WebGLRenderingContext.RGBA, WebGLRenderingContext.RGBA, WebGLRenderingContext.UNSIGNED_BYTE, parentTexture.ImageSource as ImageData);
    }
  }

}


export default TextureWrapper;
