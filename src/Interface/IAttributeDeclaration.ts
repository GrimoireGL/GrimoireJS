import { Name } from "../Tool/Types";
import { IConverterDeclaration, ILazyConverterDeclaration, IStandardConverterDeclaration } from "./IAttributeConverterDeclaration";

export interface IAttributeDeclarationBase {
  default: any;
  notNull?: boolean;
  [parameters: string]: any;
}

/**
 * interface for attribute declaration
 */
export interface IStandardAttributeDeclaration<T = any> extends IAttributeDeclarationBase {
  converter: Name | IStandardConverterDeclaration<T>;
}

/**
 * interface for lazy attribute declaration
 */
export interface ILazyAttributeDeclaration<T = any> extends IAttributeDeclarationBase {
  converter: Name | ILazyConverterDeclaration<T>;
}

export type IAttributeDeclaration<T= any> = IStandardAttributeDeclaration<T> | ILazyAttributeDeclaration<T>;
