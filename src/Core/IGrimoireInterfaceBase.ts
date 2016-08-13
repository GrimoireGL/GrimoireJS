import Component from "./Node/Component";
import NamespacedIdentity from "./Base/NamespacedIdentity";
import ComponentDeclaration from "./Node/ComponentDeclaration";
import GomlNode from "./Node/GomlNode";
import AttributeConverter from "./Node/AttributeConverter";
import NodeDeclaration from "./Node/NodeDeclaration";
import NamespacedDictionary from "./Base/NamespacedDictionary";
interface IGrimoireInterfaceBase {
  nodeDeclarations: NamespacedDictionary<NodeDeclaration>;
  converters: NamespacedDictionary<AttributeConverter>;
  loadTasks: (() => Promise<void>)[];
  nodeDictionary: { [nodeId: string]: GomlNode };
  componentDictionary: { [componentId: string]: Component };
  componentDeclarations: NamespacedDictionary<ComponentDeclaration>;
  ns(ns: string): (name: string) => NamespacedIdentity;
  register(loadTask: () => Promise<void>): void;
  resolvePlugins(): Promise<void>;
  addRootNode(tag: HTMLScriptElement, node: GomlNode): string;
  registerConverter(name: string | NamespacedIdentity, converter: (any) => any): void;
  registerComponent(name: string | NamespacedIdentity, obj: Object | (new () => Component)): void;
  registerNode(name: string | NamespacedIdentity,
    requiredComponents: (string | NamespacedIdentity)[],
    defaultValues?: { [key: string]: any } | NamespacedDictionary<any>,
    superNode?: string | NamespacedIdentity): void;
}

export default IGrimoireInterfaceBase;
