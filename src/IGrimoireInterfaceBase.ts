import Attribute from "./Node/Attribute";
import Component from "./Node/Component";
import NSIdentity from "./Base/NSIdentity";
import ComponentDeclaration from "./Node/ComponentDeclaration";
import GomlNode from "./Node/GomlNode";
import AttributeConverter from "./Node/AttributeConverter";
import NodeDeclaration from "./Node/NodeDeclaration";
import NSDictionary from "./Base/NSDictionary";
interface IGrimoireInterfaceBase {
  nodeDeclarations: NSDictionary<NodeDeclaration>;
  converters: NSDictionary<AttributeConverter>;
  loadTasks: (() => Promise<void>)[];
  nodeDictionary: { [nodeId: string]: GomlNode };
  componentDictionary: { [componentId: string]: Component };
  componentDeclarations: NSDictionary<ComponentDeclaration>;
  ns(ns: string): (name: string) => NSIdentity;
  initialize(): void;
  register(loadTask: () => Promise<void>): void;
  resolvePlugins(): Promise<void>;
  addRootNode(tag: HTMLScriptElement, node: GomlNode): string;
  registerConverter(name: string | NSIdentity, converter: (this:Attribute, value: any) => any): void;
 registerComponent(name: string | NSIdentity, obj: Object | (new () => Component)): void;
 registerNode(name: string | NSIdentity,
  requiredComponents: (string | NSIdentity)[],
  defaultValues ?: { [key: string]: any } | NSDictionary < any >,
  superNode ?: string | NSIdentity): void;
}

export default IGrimoireInterfaceBase;
