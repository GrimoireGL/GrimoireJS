import ResourceWrapper = require('../ResourceWrapper')
import CanvasManagerBase = require('../../ContextManagerBase')
import TargetTextureType = require('../../../Wrapper/TargetTextureType')
import TextureFormat = require('../../../Wrapper/TextureInternalFormatType');
import ElementFormat = require('../../../Wrapper/TextureType');
import BufferTexture = require('./BufferTexture')
import TextureParameterType = require('../../../Wrapper/Texture/TextureParameterType');
import TextureWrapperBase = require('./TextureWrapperBase');
class BufferTextureWrapper extends TextureWrapperBase {
	constructor(ownerCanvas: CanvasManagerBase, parent: BufferTexture) {
		super(ownerCanvas, parent);
	}

	public init() {
		if (this.Initialized) return;
		var parent = <BufferTexture>this.Parent;
		this.setTargetTexture(this.WebGLContext.CreateTexture());
		this.bind();
		this.WebGLContext.TexImage2D(TargetTextureType.Texture2D, 0, parent.TextureFormat, parent.Width, parent.Height, 0, parent.ElementFormat, null);
		this.applyTextureParameter();
		this.setInitialized();
	}

	public unbind() {
		//TODO consider is it really need to implement unbind
		this.WebGLContext.BindTexture(TargetTextureType.Texture2D, null);
	}

	public resize(width: number, height: number) {
		this.bind();
		if (this.WebGLContext.IsTexture(this.TargetTexture)) {
			var parent = <BufferTexture>this.Parent;
			this.WebGLContext.TexImage2D(TargetTextureType.Texture2D, 0, parent.TextureFormat, parent.Width, parent.Height, 0, parent.ElementFormat, null);
		}
	}

	public updateTexture(buffer: ArrayBufferView) {
		this.bind();
		if (this.WebGLContext.IsTexture(this.TargetTexture)) {
			var parent = <BufferTexture>this.Parent;
			this.WebGLContext.TexImage2D(TargetTextureType.Texture2D, 0, parent.TextureFormat, parent.Width, parent.Height, 0, parent.ElementFormat,buffer);
		}
	}

}

export = BufferTextureWrapper;