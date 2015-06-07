import TreeNodeBase = require('./TreeNodeBase');
import Delegates = require('../Delegates');
import GomlAttribute = require('./GomlAttribute');
import ModuleNode = require('./Nodes/Modules/ModuleNode');
class ModuleContainerNodeBase extends TreeNodeBase
{
	constructor(elem:HTMLElement,parent?:TreeNodeBase)
	{
		super(elem,parent);
	}
	
	 /**
     * Modules that is attached to this node.
     */
    protected modules:ModuleNode[]=[];
    
        
    /**
     * Add module to this node.
     */
    public addModule(module:ModuleNode):void
    {
      this.modules.push(module);
    }
    
    public update():void
    {
        this.modules.forEach(v=>
            {
                if(v.enabled)v.update();
            });
    }
}

export = ModuleContainerNodeBase;