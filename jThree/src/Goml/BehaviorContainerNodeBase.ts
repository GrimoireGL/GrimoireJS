import TreeNodeBase = require('./TreeNodeBase');
import BehaviorNode = require("./Nodes/Behaviors/BehaviorNode");
import AssociativeArray = require('../Base/Collections/AssociativeArray');

class BehaviorContainerNodeBase extends TreeNodeBase
{
	constructor(elem:HTMLElement,parent?:TreeNodeBase)
	{
		super(elem,parent);
	}

	 /**
     * components that is attached to this node.
     */
    protected behaviors:AssociativeArray<BehaviorNode[]>=new AssociativeArray<BehaviorNode[]>();

    /**
     * Add component to this node.
     */
    public addBehavior(behaviors:BehaviorNode):void {
        this.loader.componentRunner.addBehavior(behaviors,this);
        if(!this.behaviors.has(behaviors.BehaviorName))this.behaviors.set(behaviors.BehaviorName,[]);
        this.behaviors.get(behaviors.BehaviorName).push(behaviors);
    }

    public getBehaviors(behaviorName:string):BehaviorNode[]
    {
        return this.behaviors.get(behaviorName);
    }
}

export = BehaviorContainerNodeBase;
