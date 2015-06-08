import JThreeObject = require('../../Base/JThreeObject');
import JThreeCollection = require('../../Base/JThreeCollection');
import ModuleNode = require('../Nodes/Modules/ModuleNode');
import Delegates = require('../../Delegates');
import ModuleContainerNodeBase = require('../ModuleContainerNodeBase');
import JThreeObjectWithID = require('../../Base/JThreeObjectWithID');
class ModuleNodePair extends JThreeObjectWithID
{
	private module:ModuleNode;
	
	private targetNode:ModuleContainerNodeBase;
	
	constructor(module:ModuleNode,target:ModuleContainerNodeBase)
	{
		super(module.ID);
		this.module=module;
		this.targetNode=target;
	}
	
	public get Module():ModuleNode
	{
		return this.module;
	}
	
	public get Target():ModuleContainerNodeBase
	{
		return this.targetNode;
	}
}

class ModuleRunner extends JThreeObject
{
	private dictionary:JThreeCollection<ModuleNodePair> = new JThreeCollection<ModuleNodePair>();
	
	private sortedModules:ModuleNodePair[] = [];
	
	private sortModules()
	{
		this.sortedModules.sort((v1,v2)=>v1.Module.order-v2.Module.order);
	}
	
	public addModule(node:ModuleNode,target:ModuleContainerNodeBase)
	{
		var modulePair =new ModuleNodePair(node,target);
		this.dictionary.insert(modulePair);
		this.sortedModules.push(modulePair);
		this.sortModules();
		if(!node.awaken)node.awake.call(node,target);
	}
	
	public executeForAllModules(methodName:string)
	{
		this.sortedModules.forEach(v=>{
			if(v.Module.enabled)
			{
				v.Module[methodName](v.Target);
			}
		})
	}
}
export = ModuleRunner;