import BooleanConverter from "./Converters/BooleanConverter";
import GrimoireComponent from "./Components/GrimoireComponent";
import StringArrayConverter from "./Converters/StringArrayConverter";
import StringConverter from "./Converters/StringConverter";
import Attribute from "./Node/Attribute";
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


class GrimoireInterfaceImpl implements IGrimoireInterfaceBase {

  public nodeDeclarations: NSDictionary<NodeDeclaration> = new NSDictionary<NodeDeclaration>();

  public converters: NSDictionary<AttributeConverter> = new NSDictionary<AttributeConverter>();

  public componentDeclarations: NSDictionary<ComponentDeclaration> = new NSDictionary<ComponentDeclaration>();

  public rootNodes: { [rootNodeId: string]: GomlNode } = {};

  public loadTasks: (() => Promise<void>)[] = [];

  public lib: { [key: string]: any } = {};

  public nodeDictionary: { [nodeId: string]: GomlNode } = {};
  public componentDictionary: { [componentId: string]: Component } = {};
  public companion: NSDictionary<any> = new NSDictionary<any>();

  public initializedEventHandler: ((id: string, className: string, tag: HTMLScriptElement) => void)[] = [];
  /**
   * Generate namespace helper function
   * @param  {string} ns namespace URI to be used
   * @return {[type]}    the namespaced identity
   */
  public ns(ns: string): (name: string) => NSIdentity {
    return (name: string) => new NSIdentity(ns, name);
  }

  public initialize(): void {
    this.registerConverter("String", StringConverter);
    this.registerConverter("StringArray", StringArrayConverter);
    this.registerConverter("Boolean", BooleanConverter);
    this.registerComponent("GrimoireComponent", GrimoireComponent);
    this.registerNode("GrimoireNodeBase", ["GrimoireComponent"]);
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

  public registerConverter(name: string | NSIdentity, converter: (this: Attribute, val: any) => any): void {
    name = Ensure.ensureTobeNSIdentity(name);
    this.converters.set(name as NSIdentity, { name: name as NSIdentity, convert: converter });
  }

  public addRootNode(tag: HTMLScriptElement, rootNode: GomlNode): string {
  if (!rootNode) {
    throw new Error("can not register null to rootNodes.");
  }
  this.rootNodes[rootNode.id] = rootNode;
  rootNode.companion.set(this.ns(Constants.defaultNamespace)("scriptElement"), tag);

  // check tree constraint.
  const errorMessages = rootNode.callRecursively(n => n.checkTreeConstraints())
    .reduce((list, current) => list.concat(current)).filter(error => error);
  if (errorMessages.length !== 0) {
    const message = errorMessages.reduce((m, current) => m + "\n" + current);
    throw new Error("tree constraint is not satisfied.\n" + message);
  }

  // awake and mount tree.
  rootNode.setMounted(true);
  rootNode.broadcastMessage("treeInitialized", <ITreeInitializedInfo>{
    ownerScriptTag: tag,
    id: rootNode.id
  });
  tag.setAttribute("x-rootNodeId", rootNode.id);
  this._onTreeInitialized(tag);
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
  for(let key in this.rootNodes) {
    delete this.rootNodes[key];
  }
    this.loadTasks.splice(0, this.loadTasks.length);
  this.initialize();
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
    };
    const properties = {};
    for (let key in obj) {
      if (key === "attributes") {
        continue;
      }
      properties[key] = { value: obj[key] };
    }
    newCtor.prototype = Object.create(Component.prototype, properties);
    Object.defineProperty(newCtor, "attributes", {
      value: obj["attributes"]
    });
    obj = newCtor;
  } else if (!obj) {
    obj = Component;
  }
  return obj as (new () => Component);
}

private _onTreeInitialized(tag:HTMLScriptElement):void {
  this.initializedEventHandler.forEach((h) => {
    h(tag.id, tag.className, tag);
  });
}
}
const context = new GrimoireInterfaceImpl();
const obtainGomlInterface = function(query: string | ((id: string, className: string, tag: HTMLScriptElement) => void)): IGomlInterface {
  if (typeof query === "string") {
    return GomlInterfaceGenerator(context.queryRootNodes(query));
  } else {
    context.initializedEventHandler.push(query);
  }
};
// const bindedFunction = obtainGomlInterface.bind(context);
Object.setPrototypeOf(obtainGomlInterface, context);
export default obtainGomlInterface as IGrimoireInterface;
