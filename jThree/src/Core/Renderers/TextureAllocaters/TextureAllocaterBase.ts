import TextureAllocationInfoChunk = require('./TextureAllocationInfoChunk');
import RendererBase = require('../RendererBase');

class TextureAllocaterBase {
	protected parentRenderer: RendererBase;

	constructor(parent: RendererBase) {
		this.parentRenderer = parent;
	}

	public generate(texInfo: TextureAllocationInfoChunk) {

	}
}

export = TextureAllocaterBase;