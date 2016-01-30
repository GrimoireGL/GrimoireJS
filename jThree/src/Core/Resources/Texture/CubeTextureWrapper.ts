import TextureWrapperBase from "./TextureWrapperBase";
import Canvas from "../../Canvas/Canvas";
import CubeTexture from "./CubeTexture";
import TexImageTargetType from "../../../Wrapper/Texture/TexImageTargetType";

class CubeTextureWrapper extends TextureWrapperBase {
  constructor(canvas: Canvas, parent: CubeTexture) {
    super(canvas, parent);
  }

  public init(isChanged?: boolean) {
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
        this.GL.texImage2D(TexImageTargetType.CubePositiveX + i, 0, WebGLRenderingContext.RGBA, 1, 1, 0, WebGLRenderingContext.RGBA, WebGLRenderingContext.UNSIGNED_BYTE, TextureWrapperBase.altTextureBuffer);
      }
    } else {
      this.preTextureUpload();
      for (let i = 0; i < 6; i++) {
        if (parent.ImageSource[i]) {
          this.GL.texImage2D(TexImageTargetType.CubePositiveX + i, 0, WebGLRenderingContext.RGBA, WebGLRenderingContext.RGBA, WebGLRenderingContext.UNSIGNED_BYTE, <ImageData>parent.ImageSource[i]);
        }
      }
    }
    this.GL.bindTexture(WebGLRenderingContext.TEXTURE_CUBE_MAP, null);
    this.setInitialized();
  }

}

export default CubeTextureWrapper;
