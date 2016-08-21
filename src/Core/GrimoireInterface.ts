import ITreeInitializedInfo from "./Node/ITreeInitializedInfo";
import IGrimoireInterfaceBase from "./IGrimoireInterfaceBase";
import IGomlInterface from "./Interface/IGomlInterface";
import GomlNode from "./Node/GomlNode";
import ComponentDeclaration from "./Node/ComponentDeclaration";
import Component from "./Node/Component";
import IAttributeDeclaration from "./Node/IAttributeDeclaration";
import AttributeConverter from "./Node/AttributeConverter";
import NamespacedSet from "./Base/NamespacedSet";
import IGrimoireInterface from "./IGrimoireInterface";

import NodeDeclaration from "./Node/NodeDeclaration";
import NamespacedIdentity from "./Base/NamespacedIdentity";
import NamespacedDictionary from "./Base/NamespacedDictionary";
import GomlInterfaceGenerator from "./Interface/GomlInterfaceGenerator";
import Ensure from "./Base/Ensure";
import {inherits} from "util";

class GrimoireInterfaceImpl implements IGrimoireInterfaceBase {

  public nodeDeclarations: NamespacedDictionary<NodeDeclaration> = new NamespacedDictionary<NodeDeclaration>();

  public converters: NamespacedDictionary<AttributeConverter> = new NamespacedDictionary<AttributeConverter>();

  public componentDeclarations: NamespacedDictionary<ComponentDeclaration> = new NamespacedDictionary<ComponentDeclaration>();

  public rootNodes: { [rootNodeId: string]: GomlNode } = {};

  public loadTasks: (() => Promise<void>)[] = [];

  public nodeDictionary: { [nodeId: string]: GomlNode } = {};
  public componentDictionary: { [componentId: string]: Component } = {};
  /**
   * Generate namespace helper function
   * @param  {string} ns namespace URI to be used
   * @return {[type]}    the namespaced identity
   */
  public ns(ns: string): (name: string) => NamespacedIdentity {
    return (name: string) => new NamespacedIdentity(ns, name);
  }

  /**
   * Register plugins
   * @param  {(}      loadTask [description]
   * @return {[type]}          [description]
   */
  public register(loadTask: () => Promise<void>): void {
    this.loadTasks.push(loadTask);
  }

  public async resolvePlugins(): Promise<void> {
    for (let i = 0; i < this.loadTasks.length; i++) {
      await this.loadTasks[i]();
    }
  }

  // TODO test
  /**
   * register custom component
   * @param  {string                |   NamespacedIdentity} name          [description]
   * @param  {IAttributeDeclaration }} attributes           [description]
   * @param  {Object                |   (new                 (}           obj           [description]
   * @return {[type]}                       [description]
   */
  public registerComponent(name: string | NamespacedIdentity, obj: Object | (new () => Component)): void {
    name = Ensure.ensureTobeNamespacedIdentity(name);
    const attrs = obj["attributes"] as { [name: string]: IAttributeDeclaration };
    obj = this._ensureTobeComponentConstructor(obj);
    this.componentDeclarations.set(name as NamespacedIdentity, new ComponentDeclaration(name as NamespacedIdentity, attrs, obj as (new () => Component)));
  }

  public registerNode(name: string | NamespacedIdentity,
    requiredComponents: (string | NamespacedIdentity)[],
    defaultValues?: { [key: string]: any } | NamespacedDictionary<any>,
    superNode?: string | NamespacedIdentity): void {
    name = Ensure.ensureTobeNamespacedIdentity(name);
    requiredComponents = Ensure.ensureTobeNamespacedIdentityArray(requiredComponents);
    defaultValues = Ensure.ensureTobeNamespacedDictionary<any>(defaultValues, (name as NamespacedIdentity).ns);
    superNode = Ensure.ensureTobeNamespacedIdentity(superNode);
    this.nodeDeclarations.set(name as NamespacedIdentity,
      new NodeDeclaration(name as NamespacedIdentity,
        NamespacedSet.fromArray(requiredComponents as NamespacedIdentity[]),
        defaultValues as NamespacedDictionary<any>,
        superNode as NamespacedIdentity)
    );
  }

  public registerConverter(name: string | NamespacedIdentity, converter: (val: any) => any): void {
    name = Ensure.ensureTobeNamespacedIdentity(name);
    this.converters.set(name as NamespacedIdentity, { name: name as NamespacedIdentity, convert: converter });
  }

  public addRootNode(tag: HTMLScriptElement, rootNode: GomlNode): string {
    if (!rootNode) {
      throw new Error("can not register null to rootNodes.");
    }
    this.rootNodes[rootNode.id] = rootNode;
    rootNode.callRecursively(n => n.resolveAttributesValue());
    rootNode.setMounted(true);
    rootNode.broadcastMessage("treeInitialized", <ITreeInitializedInfo>{
      ownerScriptTag: tag,
      id: rootNode.id
    });
    tag.setAttribute("x-rootNodeId", rootNode.id);
    return rootNode.id;
  }

  public getRootNode(scriptTag: Element): GomlNode {
    const id = scriptTag.getAttribute("x-rootNodeId");
    return this.rootNodes[id];
  }

  public queryRootNodes(query: string): GomlNode[] {
    const scriptTags = document.querySelectorAll(query);
    const nodes: GomlNode[] = [];
    for (let i = 0; i < scriptTags.length; i++) {
      const node = this.getRootNode(scriptTags.item(i));
      if (node) {
        nodes.push(node);
      }
    }
    return nodes;
  }

  /**
   * This method is not for users.
   * Just for unit testing.
   *
   * Clear all configuration that GrimoireInterface contain.
   */
  public clear(): void {
    this.nodeDeclarations.clear();
    this.componentDeclarations.clear();
    this.converters.clear();
    for (let key in this.rootNodes) {
      delete this.rootNodes[key];
    }
    this.loadTasks.splice(0, this.loadTasks.length);
  }

  /**
   * Ensure the given object or constructor to be an constructor inherits Component;
   * @param  {Object | (new ()=> Component} obj [The variable need to be ensured.]
   * @return {[type]}      [The constructor inherits Component]
   */
  private _ensureTobeComponentConstructor(obj: Object | (new () => Component)): new () => Component {
    if (typeof obj === "function") {
      if (!((obj as Function).prototype instanceof Component) && (obj as Function) !== Component) {
        throw new Error("Component constructor must extends Component class.");
      }
    } else if (typeof obj === "object") {
      const newCtor = () => { return; };
      inherits(newCtor, Component);
      for (let key in obj) {
        (newCtor as Function).prototype[key] = obj[key];
      }
      obj = newCtor;
    } else if (!obj) {
      obj = Component;
    }
    return obj as (new () => Component);
  }
}
const context = new GrimoireInterfaceImpl();
const obtainGomlInterface = function(query: string): IGomlInterface {
  return GomlInterfaceGenerator(context.queryRootNodes(query));
};
// const bindedFunction = obtainGomlInterface.bind(context);
Object.setPrototypeOf(obtainGomlInterface, context);
export default obtainGomlInterface as IGrimoireInterface;
