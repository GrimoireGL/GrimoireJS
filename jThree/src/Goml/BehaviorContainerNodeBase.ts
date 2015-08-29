import TreeNodeBase = require('./TreeNodeBase');
import BehaviorNode = require("./Nodes/Behaviors/BehaviorNode");
import GomlLoader = require('./GomlLoader');
import AssociativeArray = require('../Base/Collections/AssociativeArray');
class BehaviorContainerNodeBase extends TreeNodeBase
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
    protected components:AssociativeArray<BehaviorNode[]>=new AssociativeArray<BehaviorNode[]>();
    
        
    /**
     * Add component to this node.
     */
    public addComponent(component:BehaviorNode):void
    {
        this.loader.componentRunner.addComponent(component,this);
        if(!this.components.has(component.ComponentName))this.components.set(component.ComponentName,[]);
        this.components.get(component.ComponentName).push(component);
    }
    
    public getComponents(componentName:string):BehaviorNode[]
    {
        return this.components.get(componentName);
    }
}

export = BehaviorContainerNodeBase;