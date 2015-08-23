import Delegates = require("../Base/Delegates");
import GomlAttribute = require("GomlAttribute");

interface AttributeDeclarationBody
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
    value?: any;

    /**
     * Whether this attribute accept change by interface or not.
     * default: false
     */
    constant?:boolean;
}

 export = AttributeDeclarationBody;