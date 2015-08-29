import JThreeObject = require('../../Base/JThreeObject');
import JThreeCollection = require('../../Base/JThreeCollection');
import BehaviorNode = require("../Nodes/Behaviors/BehaviorNode");
import BehaviorContainerNodeBase = require("../BehaviorContainerNodeBase");
import JThreeObjectWithID = require('../../Base/JThreeObjectWithID');
/**
 * container class for storeing ComponentNode and TargetNode
 */
class BehaviorNodePair extends JThreeObjectWithID
{
	/**
	 * ComponentNode contain the arguments of component
	 */
	private component:BehaviorNode;
	
	/**
	 * TargetNode contain the ComponentNode
	 */
	private targetNode:BehaviorContainerNodeBase;
	
	constructor(component:BehaviorNode,target:BehaviorContainerNodeBase)
	{
		super(component.ID);
		this.component=component;
		this.targetNode=target;
	}
	/**
	 * getter for component node
	 */
	public get Component():BehaviorNode
	{
		return this.component;
	}
	/**
	 * getter for target node
	 */
	public get Target():BehaviorContainerNodeBase
	{
		return this.targetNode;
	}
}

class BehaviorRunner extends JThreeObject
{
	private dictionary:JThreeCollection<BehaviorNodePair> = new JThreeCollection<BehaviorNodePair>();
	
	private sortedComponents:BehaviorNodePair[] = [];
	
	private sortComponents()
	{
		this.sortedComponents.sort((v1,v2)=>v1.Component.order-v2.Component.order);
	}
	
	public addComponent(node:BehaviorNode,target:BehaviorContainerNodeBase)
	{
		var componentPair =new BehaviorNodePair(node,target);
		this.dictionary.insert(componentPair);
		this.sortedComponents.push(componentPair);
		this.sortComponents();
		if(!node.awaken)node.awake.call(node,target);
		
	}
	
	public executeForAllComponents(componentName:string)
	{
		this.sortedComponents.forEach(v=>{
			if(v.Component.enabled)
			{
				v.Component[componentName](v.Target);
			}
		})
	}
}
export = BehaviorRunner;