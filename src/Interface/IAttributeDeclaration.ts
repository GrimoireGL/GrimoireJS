import { Name } from "../Tool/Types";
import { IConverterDeclaration, ILazyConverterDeclaration, IStandardConverterDeclaration } from "./IAttributeConverterDeclaration";

/**
 * interface for attribute declaration
 */
export interface IStandardAttributeDeclaration<T = any> {
  converter: Name | IStandardConverterDeclaration<T>;
  default: any;
  [parameters: string]: any;
}

/**
 * interface for lazy attribute declaration
 */
export interface ILazyAttributeDeclaration<T = any> {
  converter: Name | ILazyConverterDeclaration<T>;
  default: any;
  [parameters: string]: any;
}

export type IAttributeDeclaration<T= any> = IStandardAttributeDeclaration<T> | ILazyAttributeDeclaration<T>;
