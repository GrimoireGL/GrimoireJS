import TextureWrapperBase from "./TextureWrapperBase";
import Canvas from "../../Canvas/Canvas";
import CubeTexture from "./CubeTexture";

class CubeTextureWrapper extends TextureWrapperBase {
  constructor(canvas: Canvas, parent: CubeTexture) {
    super(canvas, parent);
  }

  public init(isChanged?: boolean): void {
    const parent = <CubeTexture>this.Parent;
    if (this.Initialized && !isChanged) {
      return;
    }
    if (this.TargetTexture == null) {
      this.setTargetTexture(this.GL.createTexture());
    }
    this.GL.bindTexture(WebGLRenderingContext.TEXTURE_CUBE_MAP, this.TargetTexture);
    if (parent.ImageSource == null) {
      for (let i = 0; i < 6; i++) {
        this.GL.texImage2D(WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, WebGLRenderingContext.RGBA, 1, 1, 0, WebGLRenderingContext.RGBA, WebGLRenderingContext.UNSIGNED_BYTE, TextureWrapperBase.altTextureBuffer);
      }
    } else {
      this.preTextureUpload();
      for (let i = 0; i < 6; i++) {
        if (parent.ImageSource[i]) {
          this.GL.texImage2D(WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, WebGLRenderingContext.RGBA, WebGLRenderingContext.RGBA, WebGLRenderingContext.UNSIGNED_BYTE, <ImageData>parent.ImageSource[i]);
        }
      }
    }
    this.GL.bindTexture(WebGLRenderingContext.TEXTURE_CUBE_MAP, null);
    this.setInitialized();
  }

}

export default CubeTextureWrapper;
