import TextureWrapperBase = require("./TextureWrapperBase");
import Canvas = require("../../Canvas");
import TextureTargetType = require("../../../Wrapper/TargetTextureType");
import TextureInternalFormat = require("../../../Wrapper/TextureInternalFormatType");
import Texture = require("./Texture");
import TextureType = require("../../../Wrapper/TextureType");
import TexImage2DTargetType = require("../../../Wrapper/Texture/TexImageTargetType");
class TextureWrapper extends TextureWrapperBase {
  constructor(canvas: Canvas, parent: Texture) {
    super(canvas, parent);
  }


  public init(isChanged?: boolean) {
    var parent = <Texture>this.Parent;
    if (this.Initialized && !isChanged) return;
    if (this.TargetTexture == null) this.setTargetTexture(this.GL.createTexture());
    this.GL.bindTexture(TextureTargetType.Texture2D, this.TargetTexture);
    if (parent.ImageSource == null) {
      this.GL.texImage2D(TexImage2DTargetType.Texture2D, 0, TextureInternalFormat.RGBA, 1, 1, 0, TextureInternalFormat.RGBA, TextureType.UnsignedByte, TextureWrapperBase.altTextureBuffer);
    } else {
      this.preTextureUpload();
      this.GL.texImage2D(TexImage2DTargetType.Texture2D, 0, TextureInternalFormat.RGBA, TextureInternalFormat.RGBA, TextureType.UnsignedByte, <ImageData>parent.ImageSource);
    }
    this.GL.bindTexture(TextureTargetType.Texture2D, null);
    this.setInitialized();
  }

}


export = TextureWrapper;
