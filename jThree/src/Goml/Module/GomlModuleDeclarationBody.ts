import Delegates = require('../../Delegates');
import GomlTreeNodeBase = require('../GomlTreeNodeBase');
import GomlAttributeDeclaration = require('../AttributeDeclaration');
interface GomlModuleDeclarationBody
{
	/**
	 * The number of order for execution.
	 * If this number is low, it will be executed faster.
	 * Default:1000
	 */
	order?:number;
	
	attributes?:GomlAttributeDeclaration;
	
	/**
	 * Is this module enabled or not.
	 * Default:True
	 */
	enabled?:boolean;	
	
	onEnabled?:Delegates.Action1<GomlTreeNodeBase>;
	
	onDisabled?:Delegates.Action1<GomlTreeNodeBase>;
	
	/**
	 * The handler to process when this module is loaded.
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
export = GomlModuleDeclarationBody;