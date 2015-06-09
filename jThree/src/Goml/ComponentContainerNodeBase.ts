import TreeNodeBase = require('./TreeNodeBase');
import Delegates = require('../Delegates');
import GomlAttribute = require('./GomlAttribute');
import ComponentNode = require('./Nodes/Components/ComponentNode');
import GomlLoader = require('./GomlLoader');
class ComponentContainerNodeBase extends TreeNodeBase
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
     * components that is attached to this node.
     */
    protected components:ComponentNode[]=[];
    
        
    /**
     * Add component to this node.
     */
    public addComponent(component:ComponentNode):void
    {
        this.loader.componentRunner.addComponent(component,this);

    }
}

export = ComponentContainerNodeBase;