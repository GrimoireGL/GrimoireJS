import Attribute from "./Node/Attribute";
import Component from "./Node/Component";
import NSIdentity from "./Base/NSIdentity";
import ComponentDeclaration from "./Node/ComponentDeclaration";
import GomlNode from "./Node/GomlNode";
import AttributeConverter from "./Declaration/IAttributeConverterDeclaration";
import NodeDeclaration from "./Node/NodeDeclaration";
import NSDictionary from "./Base/NSDictionary";
import {Name} from "./Base/Types";

interface IGrimoireInterfaceBase {
  nodeDeclarations: NSDictionary<NodeDeclaration>;
  converters: NSDictionary<AttributeConverter>;
  loadTasks: (() => Promise<void>)[];
  nodeDictionary: { [nodeId: string]: GomlNode };
  lib: {
    [key: string]: {
      __VERSION__: string;
      __NAME__: string;
      [key: string]: any;
    }
  };
  componentDictionary: { [componentId: string]: Component };
  componentDeclarations: NSDictionary<ComponentDeclaration>;
  noConflictPreserve: any;
  debug: boolean;
  overrideDeclaration(targetDeclaration: Name, additionalComponents: (Name)[]): NodeDeclaration;
  overrideDeclaration(targetDeclaration: Name, defaults: { [attrName: string]: any }): NodeDeclaration;
  overrideDeclaration(targetDeclaration: Name, additionalComponents: (Name)[], defaults: { [attrName: string]: any }): NodeDeclaration;
  overrideDeclaration(targetDeclaration: Name, arg2: (Name)[] | { [attrName: string]: any }, defaults?: { [attrName: string]: any }): NodeDeclaration;
  ns(ns: string): (name: string) => NSIdentity;
  initialize(): void;
  register(loadTask: () => Promise<void>): void;
  resolvePlugins(): Promise<void>;
  addRootNode(tag: HTMLScriptElement, node: GomlNode): string;
  noConflict(): void;
  registerComponent(name: Name, obj: Object | (new () => Component)): void;
  registerNode(name: Name, requiredComponents: (Name)[], defaultValues?: { [key: string]: any } | NSDictionary<any>, superNode?: Name): void;
  registerConverter(name: Name, converter: (this: Attribute, value: any) => any): void;
}

export default IGrimoireInterfaceBase;
