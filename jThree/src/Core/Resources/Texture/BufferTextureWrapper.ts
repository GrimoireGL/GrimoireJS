import Canvas = require('../../Canvas')
import TargetTextureType = require('../../../Wrapper/TargetTextureType')
import BufferTexture = require('./BufferTexture')
import TextureWrapperBase = require('./TextureWrapperBase');
import TexImage2DTargetType = require("../../../Wrapper/Texture/TexImageTargetType");
import FramebufferAttachmentType = require("../../../Wrapper/FrameBufferAttachmentType");
import ElementType = require("../../../Wrapper/ElementType");
import Delegates = require("../../../Base/Delegates");
class BufferTextureWrapper extends TextureWrapperBase {
    constructor(ownerCanvas: Canvas, parent: BufferTexture) {
        super(ownerCanvas, parent);
    }

    public init() {
        if (this.Initialized) return;
        var parent = <BufferTexture>this.Parent;
        this.setTargetTexture(this.GL.createTexture());
        this.bind();
        this.GL.texImage2D(TexImage2DTargetType.Texture2D, 0, parent.TextureFormat, parent.Width, parent.Height, 0,parent.TextureFormat, parent.ElementFormat, null);
        this.setInitialized();
    }

    public unbind() {
        //TODO consider is it really need to implement unbind
        this.GL.bindTexture(TargetTextureType.Texture2D, null);
    }

    public resize(width: number, height: number) {
        this.bind();
        if (this.Initialized) {
            var parent = <BufferTexture>this.Parent;
            this.preTextureUpload();
            this.GL.texImage2D(TexImage2DTargetType.Texture2D, 0, parent.TextureFormat, parent.Width, parent.Height, 0,parent.TextureFormat, parent.ElementFormat, null);
        }
    }

    public updateTexture(buffer: ArrayBufferView) {
        this.bind();
        if (this.Initialized) {
            var parent = <BufferTexture>this.Parent;
            this.preTextureUpload();
            this.GL.texImage2D(TexImage2DTargetType.Texture2D, 0, parent.TextureFormat, parent.Width, parent.Height, 0,parent.TextureFormat, parent.ElementFormat, buffer);
        }
        this.unbind();
    }

    public generateHtmlImage(encoder?:Delegates.Func3<number,number,ArrayBufferView,Uint8Array>):HTMLImageElement
    {
      var parent = <BufferTexture>this.Parent;
      return this.encodeHtmlImage(parent.Width,parent.Height,encoder);
    }
}

export = BufferTextureWrapper;
