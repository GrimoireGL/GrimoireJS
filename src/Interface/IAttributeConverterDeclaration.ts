import Attribute from "../Core/Attribute";
import { Name } from "../Tool/Types";

/**
 * interface for converter declaration
 */
export interface IAttributeConverterDeclaration<T = any> {
  name: Name;
  lazy?: false;
  [params: string]: any;
  verify?(attr: Attribute): void; // throw error if attribute is not satisfy condition converter needed.
  convert(val: any, attr: Attribute): T | undefined;
}

export interface ILazyAttributeConverterDeclaration<T = any> {
  name: Name;
  lazy: true;
  [params: string]: any;
  verify?(attr: Attribute): void; // throw error if attribute is not satisfy condition converter needed.
  convert(val: any, attr: Attribute): (() => T) | undefined;
}

export type IConverterDeclaration<T = any> = IAttributeConverterDeclaration<T> | ILazyAttributeConverterDeclaration<T>;
