import { Name } from "../Tool/Types";
import { IConverterDeclaration } from "./IAttributeConverterDeclaration";

/**
 * interface for attribute declaration
 */
export default interface IAttributeDeclaration<T = any> {
  converter: Name | IConverterDeclaration<T>;
  default: any;
  [parameters: string]: any;
}
