import Delegates = require("../../Base/Delegates");
import GomlTreeNodeBase = require("../GomlTreeNodeBase");
import GomlAttributeDeclaration = require("../AttributeDeclaration");
interface BehaviorDeclarationBody
{
	/**
	 * The number of order for execution.
	 * If this number is low, it will be executed faster.
	 * Default:1000
	 */
	order?:number;
	
	attributes?:GomlAttributeDeclaration;
	
	/**
	 * Is this component enabled or not.
	 * Default:True
	 */
	enabled?:boolean;	
	
	onEnabled?:Delegates.Action1<GomlTreeNodeBase>;
	
	onDisabled?:Delegates.Action1<GomlTreeNodeBase>;
	
	/**
	 * The handler to process when this component is loaded.
	 */
	awake?:Delegates.Action1<GomlTreeNodeBase>;
	
	/**
	 * This handler will be 
	 */
	start?:Delegates.Action1<GomlTreeNodeBase>;
	
	/**
	 * The handler to process when frame will be update.
	 */
	update?:Delegates.Action1<GomlTreeNodeBase>;
}
export = BehaviorDeclarationBody;