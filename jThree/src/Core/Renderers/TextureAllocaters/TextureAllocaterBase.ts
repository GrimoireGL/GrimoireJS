import TextureAllocationInfoChunk = require('./TextureAllocationInfoChunk');
import RendererBase = require('../RendererBase');
import JThreeContextProxy = require('../../JThreeContextProxy');
class TextureAllocaterBase {
	protected parentRenderer: RendererBase;

	constructor(parent: RendererBase) {
		this.parentRenderer = parent;
	}

	public generate(name:string,texInfo: TextureAllocationInfoChunk) {

	}
	
	public get Context(){
		return JThreeContextProxy.getJThreeContext();
	}
}

export = TextureAllocaterBase;