import Identity from "../Core/Identity";
import GomlInterfaceImpl from "../Core/GomlInterfaceImpl";
import GomlNode from "../Core/GomlNode";
import GrimoireInterfaceImpl from "../Core/GrimoireInterfaceImpl";
import NodeInterface from "../Core/NodeInterface";
import IAttributeDeclaration from "../Interface/IAttributeDeclaration";

export type Name = string | Identity;
export type GomlInterface = GomlInterfaceImpl & IGomlInterface;
export type IGrimoireInterface = {
  (query: string): GomlInterface;
  (query: GomlNode[]): GomlInterface;
  (callback: (scriptTags: HTMLScriptElement[]) => void): void;
};
export type IGomlInterface = {
  (query: string): NodeInterface;
};
export type GrimoireInterface = IGrimoireInterface & GrimoireInterfaceImpl;
export type Nullable<T> = T | null;
export type Undef<T> = Nullable<T> | undefined;
export type Ctor<T> = (new () => T);
export type ComponentRegistering<T> = T & {
  attributes: { [key: string]: IAttributeDeclaration };
  componentName?: Name;
  [key: string]: any;
};

export default null;
