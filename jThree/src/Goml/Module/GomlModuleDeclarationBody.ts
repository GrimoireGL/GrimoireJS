import Delegates = require('../../Delegates');
import GomlAttribute = require('../GomlAttribute');
import GomlAttributeDeclaration = require('../AttributeDeclaration');
interface GomlModuleDeclarationBody
{
	/**
	 * The number of order for execution.
	 * If this number is low, it will be executed faster.
	 * Default:1000
	 */
	order?:number;
	
	attributes?:GomlAttributeDeclaration[];
	
	/**
	 * Is this module enabled or not.
	 * Default:True
	 */
	enabled?:boolean;	
	
	onEnabled?:Delegates.Action1<GomlAttribute>;
	
	onDisabled?:Delegates.Action1<GomlAttribute>;
	
	/**
	 * The handler to process when this module is loaded.
	 */
	awake?:Delegates.Action1<GomlAttribute>;
	
	
	start?:Delegates.Action1<GomlAttribute>;
	
	/**
	 * The handler to process when frame will be update.
	 */
	update?:Delegates.Action1<GomlAttribute>;
}
export = GomlModuleDeclarationBody;