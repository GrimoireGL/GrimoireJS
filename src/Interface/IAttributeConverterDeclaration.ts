import Attribute from "../Core/Attribute";
import { Name } from "../Tools/Types";

/**
 * interface for converter declaration
 */
export default interface IAttributeConverterDeclaration {
  name: Name;
  [params: string]: any;
  verify(attr: Attribute): void; // throw error if attribute is not satisfy condition converter needed.
  convert(val: any, attr: Attribute): any;
}
