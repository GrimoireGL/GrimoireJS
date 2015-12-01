import TextureWrapperBase = require("./TextureWrapperBase");
import Canvas = require("../../Canvas");
import CubeTexture = require("./CubeTexture");
import TextureTargetType = require("../../../Wrapper/TargetTextureType");
import TexImageTargetType = require("../../../Wrapper/Texture/TexImageTargetType");
import TextureInternalFormat = require("../../../Wrapper/TextureInternalFormatType");
import TextureType = require("../../../Wrapper/TextureType");

class CubeTextureWrapper extends TextureWrapperBase {
    constructor(contextManager: Canvas, parent: CubeTexture) {
        super(contextManager, parent);
    }

    public init(isChanged?: boolean) {
        var parent = <CubeTexture>this.Parent;
        if (this.Initialized && !isChanged) return;
        if (this.TargetTexture == null) this.setTargetTexture(this.GL.createTexture());
        this.GL.bindTexture(TextureTargetType.CubeTexture, this.TargetTexture);
        if (parent.ImageSource == null) {
            for (var i = 0; i < 6; i++) {
                this.GL.texImage2D(TexImageTargetType.CubePositiveX + i, 0, TextureInternalFormat.RGBA, 1, 1, 0,TextureInternalFormat.RGBA, TextureType.UnsignedByte, TextureWrapperBase.altTextureBuffer);
            }
        } else
        {
            this.preTextureUpload();
            for (var i = 0; i < 6; i++) {
                if (parent.ImageSource[i])
                    this.GL.texImage2D(TexImageTargetType.CubePositiveX + i, 0, TextureInternalFormat.RGBA, TextureInternalFormat.RGBA, TextureType.UnsignedByte, <ImageData>parent.ImageSource[i]);
            }
        }
        this.GL.bindTexture(TextureTargetType.CubeTexture, null);
        this.setInitialized();
    }

}

export= CubeTextureWrapper;
