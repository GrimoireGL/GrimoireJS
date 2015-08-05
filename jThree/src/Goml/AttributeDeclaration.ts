import Delegates = require("../Base/Delegates");
import GomlAttribute = require("./GomlAttribute");
/**
 * The interface for declare attribute speciied in GOML.
 */
interface AttributeDeclation
{
	/**
	 * Attribute name, user will use this name as tagname in GOML.
	 */
	[name:string]:AttributeBody;
}

interface AttributeBody
{
	/**
	 * Converter name, jThree will interpret the value using this class.
	 */
	converter:string;
	
	/**
	 * call back method, if the value of this attribute changed, this method will be fired.
	 */
	handler?:Delegates.Action1<GomlAttribute>;
	
	/**
	 * default value of this attribute.
	 */
	value?:any;
}

export = AttributeDeclation;