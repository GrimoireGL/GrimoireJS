import ContextManagerBase = require('../../ContextManagerBase')
import TargetTextureType = require('../../../Wrapper/TargetTextureType')
import BufferTexture = require('./BufferTexture')
import TextureWrapperBase = require('./TextureWrapperBase');
import TexImage2DTargetType = require("../../../Wrapper/Texture/TexImageTargetType");
import FramebufferAttachmentType = require("../../../Wrapper/FrameBufferAttachmentType");
import ElementType = require("../../../Wrapper/ElementType");
class BufferTextureWrapper extends TextureWrapperBase {
    constructor(ownerCanvas: ContextManagerBase, parent: BufferTexture) {
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

    public createImg()
    {
      var frameBuffer = this.GL.createFramebuffer();
      this.GL.bindFramebuffer(this.GL.FRAMEBUFFER,frameBuffer);
      this.GL.framebufferTexture2D(this.GL.FRAMEBUFFER,this.GL.COLOR_ATTACHMENT0,this.GL.TEXTURE_2D,this.TargetTexture,0);
      var width = (<any>this.Parent).Width,height = (<any>this.Parent).Height;
      var data = new Uint8Array( width * height *4);
      var parent = <BufferTexture>this.Parent;
      this.GL.readPixels(0,0,width,height,parent.TextureFormat,ElementType.UnsignedByte,data);
      this.GL.deleteFramebuffer(frameBuffer);
      // Create a 2D canvas to store the result
      var canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      var context = canvas.getContext('2d');

      // Copy the pixels to a 2D canvas
      var imageData = context.createImageData(width, height);
      (<any>imageData.data).set(<any>data);
      context.putImageData(imageData, 0, 0);
      var img = new Image();
      img.src = canvas.toDataURL();
      document.body.appendChild(img);
      return img;
    }
}

export = BufferTextureWrapper;
