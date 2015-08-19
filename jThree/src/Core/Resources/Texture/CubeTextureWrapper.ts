import TextureWrapperBase = require("./TextureWrapperBase");
import ContextManagerBase = require("../../ContextManagerBase");
import CubeTexture = require("./CubeTexture");
import TextureTargetType = require("../../../Wrapper/TargetTextureType");
import TexImageTargetType = require("../../../Wrapper/Texture/TexImageTargetType");
import TextureInternalFormat = require("../../../Wrapper/TextureInternalFormatType");
import TextureType = require("../../../Wrapper/TextureType");
class CubeTextureWrapper extends TextureWrapperBase{
    constructor(contextManager: ContextManagerBase, parent: CubeTexture) {
        super(contextManager, parent);
    }

    public init(isChanged?: boolean)
    {
        var parent = <CubeTexture>this.Parent;
        if (this.Initialized && !isChanged) return;
        if (this.TargetTexture == null) this.setTargetTexture(this.WebGLContext.CreateTexture());
        this.WebGLContext.BindTexture(TextureTargetType.Texture2D, this.TargetTexture);
        if (parent.ImageSource == null)
        {
            this.WebGLContext.TexImage2D(TexImageTargetType.Texture2D, 0, TextureInternalFormat.RGBA, 1, 1, 0, TextureType.UnsignedShort4444, null);
        } else
        {
            this.WebGLContext.TexImage2D(TexImageTargetType.Texture2D, 0, TextureInternalFormat.RGBA, TextureInternalFormat.RGBA, TextureType.UnsignedByte, parent.ImageSource);
        }
}