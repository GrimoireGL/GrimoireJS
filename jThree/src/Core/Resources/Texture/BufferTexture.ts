import ContextSafeResourceContainer = require('../ContextSafeResourceContainer');
import BufferTextureWrapper = require('./BufferTextureWrapper');
import TextureFormat = require('../../../Wrapper/TextureInternalFormatType');
import ElementFormat = require('../../../Wrapper/TextureType');
import JThreeContext = require('../../JThreeContext');
import TextureParameterType = require('../../../Wrapper/Texture/TextureParameterType');
import TextureMinFilterType = require('../../../Wrapper/Texture/TextureMinFilterType');
import TextureMagFilterType = require('../../../Wrapper/Texture/TextureMagFilterType');
import ContextManagerBase = require('../../ContextManagerBase');
import TextureWrapType = require('../../../Wrapper/Texture/TextureWrapType');
import TextureBase = require('./TextureBase');
class BufferTexture extends TextureBase {
	private width: number;

	get Width(): number {
		return this.width;
	}

	private height: number;

	get Height(): number {
		return this.height;
	}

	private textureFormat: TextureFormat;

	get TextureFormat(): TextureFormat {
		return this.textureFormat;
	}

	private elementFormat: ElementFormat;

	get ElementFormat(): ElementFormat {
		return this.elementFormat;
	}

	constructor(context: JThreeContext, width: number, height: number, textureFormat: TextureFormat, elementFormat: ElementFormat) {
		super(context);
		this.width = width;
		this.height = height;
		this.textureFormat = textureFormat;
		this.elementFormat = elementFormat;
	}

	protected getInstanceForRenderer(contextManager: ContextManagerBase): BufferTextureWrapper {
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

}

export = BufferTexture;