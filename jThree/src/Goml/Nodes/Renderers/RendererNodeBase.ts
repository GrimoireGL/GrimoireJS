import GomlTreeNodeBase = require('../../GomlTreeNodeBase');
import GomlLoader = require('../../GomlLoader');
class RendererNodeBase extends GomlTreeNodeBase
{
	    constructor(elem:HTMLElement,loader:GomlLoader,parent:GomlTreeNodeBase) 
		{
			super(elem,loader,parent);
			
		}
}

export = RendererNodeBase;