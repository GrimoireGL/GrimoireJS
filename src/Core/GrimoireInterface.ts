import Constants from "./Base/Constants";
import ITreeInitializedInfo from "./Node/ITreeInitializedInfo";
import IGrimoireInterfaceBase from "./IGrimoireInterfaceBase";
import IGomlInterface from "./Interface/IGomlInterface";
import GomlNode from "./Node/GomlNode";
import ComponentDeclaration from "./Node/ComponentDeclaration";
import Component from "./Node/Component";
import IAttributeDeclaration from "./Node/IAttributeDeclaration";
import AttributeConverter from "./Node/AttributeConverter";
import NSSet from "./Base/NSSet";
import IGrimoireInterface from "./IGrimoireInterface";

import NodeDeclaration from "./Node/NodeDeclaration";
import NSIdentity from "./Base/NSIdentity";
import NSDictionary from "./Base/NSDictionary";
import GomlInterfaceGenerator from "./Interface/GomlInterfaceGenerator";
import Ensure from "./Base/Ensure";
import {inherits} from "util";

class GrimoireInterfaceImpl implements IGrimoireInterfaceBase {

  public nodeDeclarations: NSDictionary<NodeDeclaration> = new NSDictionary<NodeDeclaration>();

  public converters: NSDictionary<AttributeConverter> = new NSDictionary<AttributeConverter>();

  public componentDeclarations: NSDictionary<ComponentDeclaration> = new NSDictionary<ComponentDeclaration>();

  public rootNodes: { [rootNodeId: string]: GomlNode } = {};

  public loadTasks: (() => Promise<void>)[] = [];

  public nodeDictionary: { [nodeId: string]: GomlNode } = {};
  public componentDictionary: { [componentId: string]: Component } = {};
  public companion: NSDictionary<any> = new NSDictionary<any>();
  /**
   * Generate namespace helper function
   * @param  {string} ns namespace URI to be used
   * @return {[type]}    the namespaced identity
   */
  public ns(ns: string): (name: string) => NSIdentity {
    return (name: string) => new NSIdentity(ns, name);
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
   * @param  {string                |   NSIdentity} name          [description]
   * @param  {IAttributeDeclaration }} attributes           [description]
   * @param  {Object                |   (new                 (}           obj           [description]
   * @return {[type]}                       [description]
   */
  public registerComponent(name: string | NSIdentity, obj: Object | (new () => Component)): void {
    name = Ensure.ensureTobeNSIdentity(name);
    const attrs = obj["attributes"] as { [name: string]: IAttributeDeclaration };
    obj = this._ensureTobeComponentConstructor(obj);
    this.componentDeclarations.set(name as NSIdentity, new ComponentDeclaration(name as NSIdentity, attrs, obj as (new () => Component)));
  }

  public registerNode(name: string | NSIdentity,
    requiredComponents: (string | NSIdentity)[],
    defaultValues?: { [key: string]: any } | NSDictionary<any>,
    superNode?: string | NSIdentity): void {
    name = Ensure.ensureTobeNSIdentity(name);
    requiredComponents = Ensure.ensureTobeNSIdentityArray(requiredComponents);
    defaultValues = Ensure.ensureTobeNSDictionary<any>(defaultValues, (name as NSIdentity).ns);
    superNode = Ensure.ensureTobeNSIdentity(superNode);
    this.nodeDeclarations.set(name as NSIdentity,
      new NodeDeclaration(name as NSIdentity,
        NSSet.fromArray(requiredComponents as NSIdentity[]),
        defaultValues as NSDictionary<any>,
        superNode as NSIdentity)
    );
  }

  public registerConverter(name: string | NSIdentity, converter: (val: any) => any): void {
    name = Ensure.ensureTobeNSIdentity(name);
    this.converters.set(name as NSIdentity, { name: name as NSIdentity, convert: converter });
  }

  public addRootNode(tag: HTMLScriptElement, rootNode: GomlNode): string {
    if (!rootNode) {
      throw new Error("can not register null to rootNodes.");
    }
    this.rootNodes[rootNode.id] = rootNode;
    rootNode.companion.set(this.ns(Constants.defaultNamespace)("scriptElement"), tag);
    const errorMessages = rootNode.callRecursively(n => n.checkTreeConstraints())
      .reduce((list, current) => list.concat(current)).filter(error => error);
    if (errorMessages.length !== 0) {
      const message = errorMessages.reduce((m, current) => m + "\n" + current);
      throw new Error("tree constraint is not satisfied.\n" + message);
    }
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
      const newCtor = function() {
        Component.call(this);
        for (let key in obj) {
          this[key] = obj[key];
        }
      };
      inherits(newCtor, Component);
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
