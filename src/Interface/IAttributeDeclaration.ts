import { Name } from "../Tools/Types";

/**
 * interface for attribute declaration
 */
export default interface IAttributeDeclaration {
  converter: Name;
  default: any;
  [parameters: string]: any;
}
