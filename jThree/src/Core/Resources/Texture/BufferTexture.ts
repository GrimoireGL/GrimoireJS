import BufferTextureWrapper = require('./BufferTextureWrapper');
import TextureFormat = require('../../../Wrapper/TextureInternalFormatType');
import ElementFormat = require('../../../Wrapper/TextureType');
import TextureMinFilterType = require('../../../Wrapper/Texture/TextureMinFilterType');
import TextureMagFilterType = require('../../../Wrapper/Texture/TextureMagFilterType');
import Canvas = require('../../Canvas');
import TextureBase = require('./TextureBase');
/**
 * Buffer texture is a texture created from array programatically.
 */
class BufferTexture extends TextureBase {
	private width: number;

    public get Width(): number {
		return this.width;
	}

	private height: number;

    public get Height(): number {
		return this.height;
	}

	constructor(width: number, height: number, textureFormat: TextureFormat, elementFormat: ElementFormat,textureName:string) {
		super(textureName);
		this.width = width;
		this.height = height;
		this.textureFormat = textureFormat;
		this.elementFormat = elementFormat;
		if(this.elementFormat==ElementFormat.Float)
		{
			this.MinFilter = TextureMinFilterType.Nearest;
			this.MagFilter = TextureMagFilterType.Nearest;
		}
	}

	protected getInstanceForRenderer(contextManager: Canvas): BufferTextureWrapper {
		var textureWrapper = new BufferTextureWrapper(contextManager, this);
		return textureWrapper;
	}

	public resize(width:number,height:number)
	{
		if(this.width!==width||this.height!==height)
		{
			this.width=width;
			this.height=height;
			this.each(v=>(<BufferTextureWrapper>v).resize(width,height));
		}
	}

	public updateTexture(buffer:ArrayBufferView)
	{
		this.each(t=> {
			(<BufferTextureWrapper>t).updateTexture(buffer);
		});
	}

}

export = BufferTexture;
