import GeneraterInfoChunk = require('./GeneraterInfoChunk');
import RendererBase = require('../RendererBase');
import GeneraterBase = require('./GeneraterBase');
import TextureInternalFormatType = require('../../../Wrapper/TextureInternalFormatType');
import TextureType = require('../../../Wrapper/TextureType');
class RendererFit extends GeneraterBase {
	constructor(parent: RendererBase) {
		super(parent);
	}

	public generate(name:string,texInfo: GeneraterInfoChunk) {
		var width=512,height=512;
		var internalFormat: TextureInternalFormatType;
		texInfo["internalFormat"] = texInfo["internalFormat"] || "RGBA";
		switch ((new String(texInfo["internalFormat"])).toUpperCase()) {
			case "ALPHA":
				internalFormat = TextureInternalFormatType.Alpha;
				break;
			case "RGB":
				internalFormat = TextureInternalFormatType.RGB;
				break;
			case "DEPTH":
				internalFormat = TextureInternalFormatType.DEPTH_COMPONENT;
				break;
			case "LUMINANCE":
				internalFormat = TextureInternalFormatType.Luminance;
				break;
			case "LUMINANCE_ALPHA":
				internalFormat = TextureInternalFormatType.LuminanceAlpha;
				break;
			case "DEPTH_STENCIL":
				internalFormat = TextureInternalFormatType.DEPTH_STENCIL;
				break;
			case "RGBA":
				internalFormat = TextureInternalFormatType.RGBA;
				break;
			default:
				console.error("the given parameter was invalid : texture format " + texInfo["internalFormat"]);
		}
		var elementFormat:TextureType;
		texInfo["element"]=texInfo["element"]||"UBYTE";
				switch ((new String(texInfo["element"])).toUpperCase()) {
			case "UBYTE":
				elementFormat=TextureType.UnsignedByte;
				break;
			case "FLOAT":
				elementFormat=TextureType.Float;
				break;
			case "USHORT565":
				elementFormat=TextureType.UnsignedShort565;
				break;
			case "USHORT4444":
				elementFormat=TextureType.UnsignedShort4444;
				break;
			case "USHORT5551":
				elementFormat=TextureType.UnsignedShort5551;
				break;
			case "UINT":
				elementFormat=TextureType.UnsignedInt;
				break;
			case "USHORT":
				elementFormat=TextureType.UnsignedShort;
				break;
			case "UINT24_8":
				elementFormat=TextureType.UnsignedInt24_8WebGL;
				break;
			default:
				console.error("the given parameter was invalid : element format " + texInfo["element"]);
		}
		return this.Context.ResourceManager.createTexture(this.parentRenderer.ID+"."+name,width,height,internalFormat,elementFormat);
	}
}

export = RendererFit;