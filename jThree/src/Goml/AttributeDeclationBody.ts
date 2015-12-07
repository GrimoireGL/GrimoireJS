import Delegates = require("../Base/Delegates");
import GomlAttribute = require("./GomlAttribute");

interface AttributeDeclarationBody {
	/**
	 * Converter name, jThree will interpret the value using this class.
	 */
  converter: string;

	/**
	 * default value of this attribute.
	 */
  value?: any;

  /**
   * Whether this attribute accept change by interface or not.
   * default: false
   */
  constant?: boolean;

  [other: string]: any;
}

export = AttributeDeclarationBody;
