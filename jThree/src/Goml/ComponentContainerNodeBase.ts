import TreeNodeBase = require('./TreeNodeBase');
import Delegates = require('../Delegates');
import GomlAttribute = require('./GomlAttribute');
import ComponentNode = require('./Nodes/Components/ComponentNode');
import GomlLoader = require('./GomlLoader');
import AssociativeArray = require('../Base/Collections/AssociativeArray');
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
    protected components:AssociativeArray<ComponentNode[]>=new AssociativeArray<ComponentNode[]>();
    
        
    /**
     * Add component to this node.
     */
    public addComponent(component:ComponentNode):void
    {
        this.loader.componentRunner.addComponent(component,this);
        if(!this.components.has(component.ComponentName))this.components.set(component.ComponentName,[]);
        this.components.get(component.ComponentName).push(component);
    }
    
    public getComponents(componentName:string):ComponentNode[]
    {
        return this.components.get(componentName);
    }
}

export = ComponentContainerNodeBase;