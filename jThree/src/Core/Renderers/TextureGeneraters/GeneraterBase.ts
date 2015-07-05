import GeneraterInfoChunk = require('./GeneraterInfoChunk');
import RendererBase = require('../RendererBase');
import JThreeContextProxy = require('../../JThreeContextProxy');
class GeneraterBase {
	protected parentRenderer: RendererBase;

	constructor(parent: RendererBase) {
		this.parentRenderer = parent;
	}

	public generate(name:string,texInfo: GeneraterInfoChunk) {

	}
	
	public get Context(){
		return JThreeContextProxy.getJThreeContext();
	}
}

export = GeneraterBase;