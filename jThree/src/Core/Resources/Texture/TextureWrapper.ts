import TextureWrapperBase from "./TextureWrapperBase";
import Canvas from "../../Canvas/Canvas";
import Texture from "./Texture";
import TexImage2DTargetType from "../../../Wrapper/Texture/TexImageTargetType";
class TextureWrapper extends TextureWrapperBase {
  constructor(canvas: Canvas, parent: Texture) {
    super(canvas, parent);
  }

  public init(isChanged?: boolean) {
    const parent = <Texture>this.Parent;
    if (this.Initialized && !isChanged) {
      return;
    }
    if (this.TargetTexture == null) {
      this.setTargetTexture(this.GL.createTexture());
    }
    this.GL.bindTexture(WebGLRenderingContext.TEXTURE_2D, this.TargetTexture);
    if (parent.ImageSource == null) {
      this.GL.texImage2D(TexImage2DTargetType.Texture2D, 0, WebGLRenderingContext.RGBA, 1, 1, 0, WebGLRenderingContext.RGBA, WebGLRenderingContext.UNSIGNED_BYTE, TextureWrapperBase.altTextureBuffer);
    } else {
      this.preTextureUpload();
      this.GL.texImage2D(TexImage2DTargetType.Texture2D, 0, WebGLRenderingContext.RGBA, WebGLRenderingContext.RGBA, WebGLRenderingContext.UNSIGNED_BYTE, <ImageData>parent.ImageSource);
    }
    this.GL.bindTexture(WebGLRenderingContext.TEXTURE_2D, null);
    this.setInitialized();
  }

}


export default TextureWrapper;
