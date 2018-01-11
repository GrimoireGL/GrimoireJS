import { Name } from "../Tool/Types";
import IAttributeConverterDeclaration from "./IAttributeConverterDeclaration";

/**
 * interface for attribute declaration
 */
export default interface IAttributeDeclaration<T = any> {
  converter: Name | IAttributeConverterDeclaration<T>;
  default: any;
  [parameters: string]: any;
}
