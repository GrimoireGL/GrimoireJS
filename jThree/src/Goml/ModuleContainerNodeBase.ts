import TreeNodeBase = require('./TreeNodeBase');
import Delegates = require('../Delegates');
import GomlAttribute = require('./GomlAttribute');
import ModuleNode = require('./Nodes/Modules/ModuleNode');
import GomlLoader = require('./GomlLoader');
class ModuleContainerNodeBase extends TreeNodeBase
{
	constructor(elem:HTMLElement,parent?:TreeNodeBase,loader?:GomlLoader)
	{
		super(elem,parent);
        this.loader=loader;
	}
    
     /**
     * The GomlLoader instanciate this class
     */
    protected loader:GomlLoader;
	
	 /**
     * Modules that is attached to this node.
     */
    protected modules:ModuleNode[]=[];
    
        
    /**
     * Add module to this node.
     */
    public addModule(module:ModuleNode):void
    {
        this.loader.moduleRunner.addModule(module,this);

    }
}

export = ModuleContainerNodeBase;