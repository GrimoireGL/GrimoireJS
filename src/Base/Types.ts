import NSIdentity from "./NSIdentity";
import GomlInterfaceImpl from "../Interface/GomlInterfaceImpl";
import GomlNode from "../Node/GomlNode";
import GrimoireInterfaceImpl from "../GrimoireInterfaceImpl";
import NodeInterface from "../Interface/NodeInterface";

export type Name = string | NSIdentity;
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

export default null;
