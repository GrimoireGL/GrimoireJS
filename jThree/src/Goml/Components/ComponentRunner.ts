import JThreeObject = require('../../Base/JThreeObject');
import JThreeCollection = require('../../Base/JThreeCollection');
import ComponentNode = require('../Nodes/Components/ComponentNode');
import Delegates = require('../../Base/Delegates');
import ComponentContainerNodeBase = require('../ComponentContainerNodeBase');
import JThreeObjectWithID = require('../../Base/JThreeObjectWithID');
/**
 * container class for storeing ComponentNode and TargetNode
 */
class ComponentNodePair extends JThreeObjectWithID
{
	/**
	 * ComponentNode contain the arguments of component
	 */
	private component:ComponentNode;
	
	/**
	 * TargetNode contain the ComponentNode
	 */
	private targetNode:ComponentContainerNodeBase;
	
	constructor(component:ComponentNode,target:ComponentContainerNodeBase)
	{
		super(component.ID);
		this.component=component;
		this.targetNode=target;
	}
	/**
	 * getter for component node
	 */
	public get Component():ComponentNode
	{
		return this.component;
	}
	/**
	 * getter for target node
	 */
	public get Target():ComponentContainerNodeBase
	{
		return this.targetNode;
	}
}

class ComponentRunner extends JThreeObject
{
	private dictionary:JThreeCollection<ComponentNodePair> = new JThreeCollection<ComponentNodePair>();
	
	private sortedComponents:ComponentNodePair[] = [];
	
	private sortComponents()
	{
		this.sortedComponents.sort((v1,v2)=>v1.Component.order-v2.Component.order);
	}
	
	public addComponent(node:ComponentNode,target:ComponentContainerNodeBase)
	{
		var componentPair =new ComponentNodePair(node,target);
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
export = ComponentRunner;