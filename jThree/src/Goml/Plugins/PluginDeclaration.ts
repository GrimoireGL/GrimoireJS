import Delegates=require("../../Base/Delegates");
import GomlLoader = require("../GomlLoader");
import JThreeContext= require("../../Core/JThreeContext");
import PluginRequest = require("./PluginRequest");
interface PluginDeclaration
{
	/**
	 * Identical ID to identify plugins
	 */
	name:string;
	id:string;
	versionId:number;
	dependencies:PluginRequest[];
	source?:string;
	url?:string;
	load?:Delegates.Action2<GomlLoader,JThreeContext>;
	afterLoad?:Delegates.Action2<GomlLoader,JThreeContext>;
}
export = PluginDeclaration;
