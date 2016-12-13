import Attribute from "./Attribute";
import NSIdentity from "../Base/NSIdentity";

/**
 * The set of attribute converter.
 */
interface AttributeConverter {
  /**
   * Name of this converter.
   * @type {NSIdentity}
   */
  name: NSIdentity;

  /**
   * Actual converting function for this converter.
   * @param  {Attribute} this  [description]
   * @param  {any}       value [description]
   * @return {any}             [description]
   */
  convert(this: Attribute, value: any): any;
}

export default AttributeConverter;
