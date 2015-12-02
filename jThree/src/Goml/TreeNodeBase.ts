import JThreeObjectWithID = require("../Base/JThreeObjectWithID");
import Delegates = require("../Base/Delegates");
import GomlNodeEventList = require("./GomlNodeEventList");
/**
 * The most base class for GOML Tree
 */
class TreeNodeBase extends JThreeObjectWithID
{
	constructor()
	{
		super();
	}

	/**
	 * the parent node of this node
	 */
	protected parent:TreeNodeBase;

	/**
	 * the node array of this node
	 */
	protected children:TreeNodeBase[]=[];

	public events:GomlNodeEventList={};

	/**
	 * Add child to this node
	 */
	public addChild(child:TreeNodeBase):void
	{
	  child.parent = this;
    this.children.push(child);
	}

	/**
	 * Execute delegate in each nodes recursively.
	 */
	public callRecursive(act:Delegates.Action1<TreeNodeBase>)
	{
		act(this);
		this.children.forEach(v=>v.callRecursive(act));
	}

	public update()
	{

	}

	public bubbleEvent(eventName:string,eventParam:any)
	{
		eventParam.needPropagation = true;
		eventParam.stopPropagation = function()
		{
			eventParam.needPropagation = false;
		};
		this.bubblingEvent(eventName,eventParam);
	}

	private bubblingEvent(eventName:string,eventParam:any)
	{
		if(this.events[eventName])
		{
			var handlers = this.events[eventName];
			for(let i = 0; i < handlers.length; i++)
			{
				handlers[i](eventParam);
			}
		}
		if(eventParam.needPropagation&&this.parent)this.parent.bubblingEvent(eventName,eventParam);
	}
}

export = TreeNodeBase;
