import TextureWrapperBase from "./TextureWrapperBase";
import Canvas from "../../Canvas/Canvas";
import CubeTexture from "./CubeTexture";
import TextureTargetType from "../../../Wrapper/TargetTextureType";
import TexImageTargetType from "../../../Wrapper/Texture/TexImageTargetType";
import TextureInternalFormat from "../../../Wrapper/TextureInternalFormatType";
import TextureType from "../../../Wrapper/TextureType";

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
    this.GL.bindTexture(TextureTargetType.CubeTexture, this.TargetTexture);
    if (parent.ImageSource == null) {
      for (let i = 0; i < 6; i++) {
        this.GL.texImage2D(TexImageTargetType.CubePositiveX + i, 0, TextureInternalFormat.RGBA, 1, 1, 0, TextureInternalFormat.RGBA, TextureType.UnsignedByte, TextureWrapperBase.altTextureBuffer);
      }
    } else {
      this.preTextureUpload();
      for (let i = 0; i < 6; i++) {
        if (parent.ImageSource[i]) {
          this.GL.texImage2D(TexImageTargetType.CubePositiveX + i, 0, TextureInternalFormat.RGBA, TextureInternalFormat.RGBA, TextureType.UnsignedByte, <ImageData>parent.ImageSource[i]);
        }
      }
    }
    this.GL.bindTexture(TextureTargetType.CubeTexture, null);
    this.setInitialized();
  }

}

export default CubeTextureWrapper;
