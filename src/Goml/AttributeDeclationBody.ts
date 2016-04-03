import GomlAttribute from "./GomlAttribute";

interface AttributeDeclarationBody {
	/**
	 * Converter name, jThree will interpret the value using this class.
	 */
  converter?: string;

	/**
	 * default value of this attribute.
	 */
  value?: any;

  /**
   * Whether this attribute accept change by interface or not.
   * default: false
   */
  constant?: boolean;

  /**
   * If this is true, override attribute except value.
   * @type {[type]}
   */
  reserved?: boolean;

  [other: string]: any;

  /**
   * apply to event listener when attribute changed
   */
  onchanged?: (attr: GomlAttribute) => void;
}

export default AttributeDeclarationBody;
