import { LazyAttribute, StandardAttribute } from "../Core/Attribute";
import { Name } from "../Tool/Types";

/**
 * interface for converter declaration
 */
export interface IStandardConverterDeclaration<T = any> {
  name: Name;
  lazy?: false;
  [params: string]: any;
  verify?(attr: StandardAttribute): void; // throw error if attribute is not satisfy condition converter needed.
  convert(val: any, attr: StandardAttribute): T | undefined;
}

export interface ILazyConverterDeclaration<T = any> {
  name: Name;
  lazy: true;
  [params: string]: any;
  verify?(attr: LazyAttribute): void; // throw error if attribute is not satisfy condition converter needed.
  convert(val: any, attr: LazyAttribute): (() => T) | undefined;
}

export type IConverterDeclaration<T = any> = IStandardConverterDeclaration<T> | ILazyConverterDeclaration<T>;
