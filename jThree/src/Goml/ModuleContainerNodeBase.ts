import TreeNodeBase = require('./TreeNodeBase');
import Delegates = require('../Delegates');
import GomlAttribute = require('./GomlAttribute');


class ModuleContainerNodeBase extends TreeNodeBase
{
	constructor(elem:HTMLElement,parent?:TreeNodeBase)
	{
		super(elem,parent);
	}
	
	 /**
     * Modules that is attached to this node.
     */
    protected modules:G[]=[];
    
        
    /**
     * Add module to this node.
     */
    public addModule(module:Module):void
    {
      this.modules.push(module);
      $()
    }
}

export = ModuleContainerNodeBase;