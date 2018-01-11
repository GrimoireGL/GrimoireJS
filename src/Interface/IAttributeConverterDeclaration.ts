import Attribute from "../Core/Attribute";
import { Name } from "../Tool/Types";

/**
 * interface for converter declaration
 */
export default interface IAttributeConverterDeclaration<T = any> {
  name: Name;
  [params: string]: any;
  verify?(attr: Attribute): void; // throw error if attribute is not satisfy condition converter needed.
  convert(val: any, attr: Attribute): T | undefined;
}
