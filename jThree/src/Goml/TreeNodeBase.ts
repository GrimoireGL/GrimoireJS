import JThreeObjectWithID = require('../Base/JThreeObjectWithId');
import Delegates = require('../Delegates');
class TreeNodeBase extends JThreeObjectWithID
{
	constructor(elem:HTMLElement,parent?:TreeNodeBase)
	{
		super();
		this.element=elem;
		if(parent!=null)parent.addChild(this);
	}
	
	protected element:HTMLElement;
	
	protected parent:TreeNodeBase;
	
	protected children:TreeNodeBase[]=[];
	
	public addChild(child:TreeNodeBase):void
	{
	    child.parent = this;
        this.children.push(child);
		console.log(`children changed this:${this} child:${child}`);
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