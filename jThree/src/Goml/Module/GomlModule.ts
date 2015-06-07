import Delegates = require('../../Delegates');
import GomlAttribute = require('../GomlAttribute');

interface GomlModule
{
	/**
	 * The name of this module.
	 * REQUIRED
	 */
	name:string;
	
	/**
	 * The number of order for execution.
	 * If this number is low, it will be executed faster.
	 * Default:1000
	 */
	order?:number;
	
	/**
	 * Is this module enabled or not.
	 * Default:True
	 */
	enabled?:boolean;	
	
	/**
	 * The handler to process when this module is loaded.
	 */
	awake?:Delegates.Action1<GomlAttribute>;
	
	/**
	 * The handler to process when frame will be update.
	 */
	update?:Delegates.Action1<GomlAttribute>;
	
	
}

export = GomlModule;