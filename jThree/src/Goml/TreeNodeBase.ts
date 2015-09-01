import JThreeObjectWithID = require("../Base/JThreeObjectWithID");
import Delegates = require("../Base/Delegates");
/**
 * The most base class for GOML Tree
 */
class TreeNodeBase extends JThreeObjectWithID
{
	constructor(elem:HTMLElement,parent?:TreeNodeBase)
	{
		super();
		this.element=elem;
		if(parent!=null)parent.addChild(this);
	}
	
	/**
	 * The HTMLElement related to this element.
	 */
	protected element:HTMLElement;
	
    /**
     * HTMLElement related to this element.
     */
	public get Element():HTMLElement
	{
		return this.element;
	}
	
	/**
	 * the parent node of this node
	 */
	protected parent:TreeNodeBase;
	
	/**
	 * the node array of this node
	 */
	protected children:TreeNodeBase[]=[];
	
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
}

export = TreeNodeBase;