import TreeNodeBase = require('./TreeNodeBase');
import Delegates = require('../Delegates');
import GomlAttribute = require('./GomlAttribute');
import GomlModule = require('./Module/GomlModule')

class ModuleContainerNodeBase extends TreeNodeBase
{
	constructor(elem:HTMLElement,parent?:TreeNodeBase)
	{
		super(elem,parent);
        this.addModule({
            name:"hello"
        });
	}
	
	 /**
     * Modules that is attached to this node.
     */
    protected modules:GomlModule[]=[];
    
        
    /**
     * Add module to this node.
     */
    public addModule(module:GomlModule):void
    {
      this.modules.push(module);
      $()
    }
}

export = ModuleContainerNodeBase;