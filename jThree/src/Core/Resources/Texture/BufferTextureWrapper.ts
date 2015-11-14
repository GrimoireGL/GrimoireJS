import ContextManagerBase = require('../../ContextManagerBase')
import TargetTextureType = require('../../../Wrapper/TargetTextureType')
import BufferTexture = require('./BufferTexture')
import TextureWrapperBase = require('./TextureWrapperBase');
import TexImage2DTargetType = require("../../../Wrapper/Texture/TexImageTargetType");
class BufferTextureWrapper extends TextureWrapperBase {
    constructor(ownerCanvas: ContextManagerBase, parent: BufferTexture) {
        super(ownerCanvas, parent);
    }

    public init() {
        if (this.Initialized) return;
        var parent = <BufferTexture>this.Parent;
        this.setTargetTexture(this.WebGLContext.CreateTexture());
        this.bind();
        this.WebGLContext.TexImage2D(TexImage2DTargetType.Texture2D, 0, parent.TextureFormat, parent.Width, parent.Height, 0, parent.ElementFormat, null);
        this.setInitialized();
    }

    public unbind() {
        //TODO consider is it really need to implement unbind
        this.WebGLContext.BindTexture(TargetTextureType.Texture2D, null);
    }

    public resize(width: number, height: number) {
        this.bind();
        if (this.Initialized) {
            var parent = <BufferTexture>this.Parent;
            this.preTextureUpload();
            this.WebGLContext.TexImage2D(TexImage2DTargetType.Texture2D, 0, parent.TextureFormat, parent.Width, parent.Height, 0, parent.ElementFormat, null);
        }
    }

    public updateTexture(buffer: ArrayBufferView) {
        this.bind();
        if (this.Initialized) {
            var parent = <BufferTexture>this.Parent;
            this.preTextureUpload();
            this.WebGLContext.TexImage2D(TexImage2DTargetType.Texture2D, 0, parent.TextureFormat, parent.Width, parent.Height, 0, parent.ElementFormat, buffer);
        }
        this.unbind();
    }

}

export = BufferTextureWrapper;
