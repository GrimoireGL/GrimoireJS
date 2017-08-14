import EEObject from "../Base/EEObject";
import IAttributeConverterDeclaration from "../Declaration/IAttributeConverterDeclaration";
import GomlLoader from "../Node/GomlLoader";
import EnumConverter from "../Converters/EnumConverter";
import NumberArrayConverter from "../Converters/NumberArrayConverter";
import ComponentConverter from "../Converters/ComponentConverter";
import NumberConverter from "../Converters/NumberConverter";
import ObjectConverter from "../Converters/ObjectConverter";
import ArrayConverter from "../Converters/ArrayConverter";
import NodeInterface from "../Interface/NodeInterface";
import Utility from "../Base/Utility";
import GomlInterfaceImpl from "../Interface/GomlInterfaceImpl";
import BooleanConverter from "../Converters/BooleanConverter";
import GrimoireComponent from "../Components/GrimoireComponent";
import StringArrayConverter from "../Converters/StringArrayConverter";
import StringConverter from "../Converters/StringConverter";
import Attribute from "../Node/Attribute";
import Constants from "../Base/Constants";
import ITreeInitializedInfo from "../Node/ITreeInitializedInfo";
import GomlNode from "../Node/GomlNode";
import ComponentDeclaration from "../Node/ComponentDeclaration";
import Component from "../Node/Component";
import NodeDeclaration from "../Node/NodeDeclaration";
import NSIdentity from "../Base/NSIdentity";
import Namespace from "../Base/Namespace";
import NSDictionary from "../Base/NSDictionary";
import Ensure from "../Base/Ensure";
import { Name, Nullable, Ctor, ComponentRegistering } from "../Base/Types";

export default class GrimoireInterfaceImpl extends EEObject {

  public nodeDeclarations: NSDictionary<NodeDeclaration> = new NSDictionary<NodeDeclaration>();

  public converters: NSDictionary<IAttributeConverterDeclaration> = new NSDictionary<IAttributeConverterDeclaration>();

  public componentDeclarations: NSDictionary<ComponentDeclaration> = new NSDictionary<ComponentDeclaration>();

  public rootNodes: { [rootNodeId: string]: GomlNode } = {};

  public loadTasks: ({ ns: string, task: () => Promise<void> })[] = [];

  public lib: {
    [key: string]: {
      __VERSION__: string;
      __NAME__: string;
      [key: string]: any;
    }
  } = {};

  public nodeDictionary: { [nodeId: string]: GomlNode } = {};
  public componentDictionary: { [componentId: string]: Component } = {};
  public debug = true;

  /**
   * The object assigned to gr before loading grimoire.js
   * @type {any}
   */
  public noConflictPreserve: any;

  private _registeringPluginNamespace: string;
  private _registrationContext: string = Constants.defaultNamespace;

  public get initializedEventHandler(): ((scriptTags: HTMLScriptElement[]) => void)[] {
    return GomlLoader.initializedEventHandlers;
  }

  public get callInitializedAlready(): boolean {
    return GomlLoader.callInitializedAlready;
  }

  /**
   * [obsolete] use `Namespace.define` instead of.
   * @param  {string} ns namespace URI to be used
   * @return {[type]}    the namespaced identity
   */
  public ns(ns: string): (name: string) => NSIdentity {
    return (name: string) => Namespace.define(ns).for(name);
  }

  public initialize(): void {
    this.registerConverter("String", StringConverter);
    this.registerConverter("StringArray", StringArrayConverter);
    this.registerConverter("Boolean", BooleanConverter);
    this.registerConverter(ArrayConverter);
    this.registerConverter("Object", ObjectConverter);
    this.registerConverter(EnumConverter);
    this.registerConverter("Number", NumberConverter);
    this.registerConverter(ComponentConverter);
    this.registerConverter("NumberArray", NumberArrayConverter);
    this.registerComponent(GrimoireComponent);
    this.registerNode("grimoire-node-base", ["GrimoireComponent"]);
  }

  /**
   * Register plugins
   * @param  {(}      loadTask [description]
   * @return {[type]}          [description]
   */
  public register(loadTask: () => Promise<void>): void {
    this.loadTasks.push({ ns: this._registeringPluginNamespace, task: loadTask });
    this._registeringPluginNamespace = Constants.defaultNamespace;
  }

  public async resolvePlugins(): Promise<void> {
    for (let i = 0; i < this.loadTasks.length; i++) {
      const obj = this.loadTasks[i];
      this._registrationContext = obj.ns;
      try {
        await obj.task();
      } catch (e) {
        console.error(`Error: loadTask of plugin '${obj.ns}' is failed.`);
        console.error(e);
      }
    }
    this._registrationContext = Constants.defaultNamespace;

    // resolveDependency
    this.componentDeclarations.forEach(dec => {
      dec.resolveDependency();
    });
    this.nodeDeclarations.forEach(dec => {
      dec.resolveDependency();
    });
  }

  /**
   * register custom component
   * @param  {string                |   NSIdentity} name          [description]
   * @param  {IAttributeDeclaration }} attributes           [description]
   * @param  {Object                |   (new                 (}           obj           [description]
   * @return {[type]}                       [description]
   */
  public registerComponent(obj: ComponentRegistering<Object | Ctor<Component>>, superComponent?: Name | Ctor<Component>): ComponentDeclaration;
  public registerComponent(name: Name, obj: ComponentRegistering<Object | Ctor<Component>>, superComponent?: Name | Ctor<Component>): ComponentDeclaration;
  public registerComponent(arg1: Name | ComponentRegistering<Object | Ctor<Component>>, arg2?: Name | Ctor<Component> | ComponentRegistering<Object | Ctor<Component>>, arg3?: Name | Ctor<Component>): ComponentDeclaration {
    let name: Name;
    let obj: ComponentRegistering<Object | Ctor<Component>>;
    let superComponent: Name | Ctor<Component> | undefined;
    if (typeof arg1 === "string" || arg1 instanceof NSIdentity) {
      name = arg1;
      obj = arg2 as ComponentRegistering<Object | Ctor<Component>>;
      superComponent = arg3;
    } else {
      obj = arg1 as ComponentRegistering<Object | Ctor<Component>>;
      superComponent = arg2 as Name | Ctor<Component>;
      if (obj.componentName == null) {
        throw new Error(`registering component has not 'componentName': ${obj}`);
      }
      name = obj.componentName;
    }
    name = this._ensureTobeNSIdentityOnRegister(name);
    if (this.componentDeclarations.get(name)) {
      throw new Error(`component ${name.fqn} is already registerd.`);
    }
    if (typeof obj === "function" && !(obj.prototype instanceof Component)) {
      throw new Error(`component constructor ${name.fqn} must be inherits Component`);
    }
    if (this.debug && !Utility.isCamelCase(name.name)) {
      console.warn(`component ${name.name} is registerd. but,it should be 'CamelCase'.`);
    }
    const attrs = obj.attributes;
    if (!attrs) {
      throw new Error("component must has 'attributes'");
    }
    for (let key in attrs) {
      if (attrs[key].default === void 0) {
        throw new Error(`default value of attribute ${key} in ${name.fqn} must be not 'undefined'.`);
      }
    }
    const dec = new ComponentDeclaration(name, obj, superComponent);
    this.componentDeclarations.set(name, dec);
    return dec;
  }

  public registerNode(name: Name, requiredComponents: Name[] = [],
    defaults?: { [key: string]: any } | NSDictionary<any>,
    superNode?: Name, freezeAttributes?: Name[]): NodeDeclaration {
    const registerId = this._ensureTobeNSIdentityOnRegister(name);
    if (this.nodeDeclarations.get(registerId)) {
      throw new Error(`gomlnode ${registerId.fqn} is already registerd.`);
    }
    if (this.debug && !Utility.isSnakeCase(registerId.name)) {
      console.warn(`node ${registerId.name} is registerd. but,it should be 'snake-case'.`);
    }

    const declaration = new NodeDeclaration(registerId, requiredComponents || [], defaults || {}, superNode, freezeAttributes);
    this.nodeDeclarations.set(registerId, declaration);
    return declaration;
  }
  public getCompanion(scriptTag: Element): NSDictionary<any> {
    const root = this.getRootNode(scriptTag);
    if (root) {
      return root.companion;
    } else {
      throw new Error("scriptTag is not goml");
    }
  }
  /**
   * Add specified nodes as root node managed by Grimoire.js
   * This method is typically used for internal.
   * @param tag the script element containing GOML source
   * @param rootNode root node of Goml
   */
  public addRootNode(tag: HTMLScriptElement, rootNode: GomlNode): string {
    if (!rootNode) {
      throw new Error("can not register null to rootNodes.");
    }
    tag.setAttribute("x-rootNodeId", rootNode.id);
    this.rootNodes[rootNode.id] = rootNode;
    rootNode.companion.set(this.ns(Constants.defaultNamespace)("scriptElement"), tag);

    // awake and mount tree.
    rootNode.setMounted(true);
    rootNode.broadcastMessage("treeInitialized", <ITreeInitializedInfo>{
      ownerScriptTag: tag,
      id: rootNode.id
    });
    rootNode.sendInitializedMessage(<ITreeInitializedInfo>{
      ownerScriptTag: tag,
      id: rootNode.id
    });
    // send events to catch root node appended
    this.emit("root-node-added", {
      ownerScriptTag: tag,
      rootNode: rootNode
    });
    return rootNode.id;
  }

  public getRootNode(scriptTag: Element): Nullable<GomlNode> {
    const id = scriptTag.getAttribute("x-rootNodeId");
    if (id) {
      let ret = this.rootNodes[id];
      if (!ret) {
        throw new Error(`threr is no rootNode has id ${id}`);
      }
      return ret;
    } else {
      return null;
    }
  }

  public noConflict(): void {
    (window as any)["gr"] = this.noConflictPreserve;
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

  public registerConverter(name: Name, converter: ((val: any, attr: Attribute) => any)): void;
  public registerConverter(declaration: IAttributeConverterDeclaration): void;
  public registerConverter(arg1: Name | IAttributeConverterDeclaration, converter?: ((val: any, attr: Attribute) => any)): void {
    if (converter) {
      this.registerConverter({ name: this._ensureTobeNSIdentityOnRegister(arg1 as any), verify: () => true, convert: converter });
      return;
    }
    const dec = arg1 as IAttributeConverterDeclaration;
    this.converters.set(this._ensureTobeNSIdentityOnRegister(dec.name), dec);
  }

  public overrideDeclaration(targetDeclaration: Name, additionalComponents: Name[]): NodeDeclaration;
  public overrideDeclaration(targetDeclaration: Name, defaults: { [attrName: string]: any }): NodeDeclaration;
  public overrideDeclaration(targetDeclaration: Name, additionalComponents: Name[], defaults: { [attrName: string]: any }): NodeDeclaration;
  public overrideDeclaration(targetDeclaration: Name, arg2: Name[] | { [attrName: string]: any }, defaults?: { [attrName: string]: any }): NodeDeclaration {
    const dec = this.nodeDeclarations.get(targetDeclaration);
    if (!dec) {
      throw new Error(`attempt not-exist node declaration : ${Ensure.tobeNSIdentity(targetDeclaration).name}`);
    }
    if (!dec.resolvedDependency) {
      dec.resolveDependency();
    }
    if (defaults) {
      const additionalC = arg2 as Name[];
      for (let i = 0; i < additionalC.length; i++) {
        dec.addDefaultComponent(additionalC[i]);
      }
      dec.defaultAttributes.pushDictionary(Ensure.tobeNSDictionary(defaults));
    } else if (Array.isArray(arg2)) { // only additiona components.
      for (let i = 0; i < arg2.length; i++) {
        dec.addDefaultComponent(arg2[i]);
      }
    } else {
      dec.defaultAttributes.pushDictionary(Ensure.tobeNSDictionary(arg2));
    }
    return dec;
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
    for (let key in this.nodeDictionary) {
      delete this.nodeDictionary[key];
    }
    for (let key in this.componentDictionary) {
      delete this.componentDictionary[key];
    }
    this.loadTasks.splice(0, this.loadTasks.length);
    this._registeringPluginNamespace = Constants.defaultNamespace;
    this.initialize();
  }

  public extendGrimoireInterface(name: string, func: Function): void {
    if ((<any>this)[name]) {
      throw new Error(`gr.${name} can not extend.it is already exist.`);
    }
    (<any>this)[name] = func.bind(this);
  }
  public extendGomlInterface(name: string, func: Function): void {
    if ((GomlInterfaceImpl as any)[name]) {
      throw new Error(`gr.${name} can not extend.it is already exist.`);
    }
    (GomlInterfaceImpl as any)[name] = func.bind(this);
  }
  public extendNodeInterface(name: string, func: Function): void {
    if ((NodeInterface as any)[name]) {
      throw new Error(`gr.${name} can not extend.it is already exist.`);
    }
    (NodeInterface as any)[name] = func.bind(this);
  }

  /**
   * use for notify GrimoireInterface of plugin namespace to be ragister.
   * notified namespace will use when resolve loadTask of the plugin.
   * @param {string} namespace namespace of plugin to be ragister.
   */
  public notifyRegisteringPlugin(namespace: string): void {
    let res = /^[Gg]rimoire(?:js|JS)?-(.*)$/.exec(namespace);
    if (res) {
      namespace = res[1];
    }
    this._registeringPluginNamespace = namespace;
  }

  private _ensureNameTobeConstructor(component: Name | Ctor<Component>): Nullable<Ctor<Component>> {
    if (!component) {
      return null;
    }

    if (typeof component === "function") {
      return component;
    } else if (typeof component === "string") {
      return this._ensureNameTobeConstructor(Ensure.tobeNSIdentity(component));
    } else {
      // here NSIdentity.
      let c = this.componentDeclarations.get(component);
      if (!c) {
        return null;
      }
      return c.ctor;
    }
  }

  private _ensureTobeNSIdentityOnRegister(name: Name): NSIdentity;
  private _ensureTobeNSIdentityOnRegister(name: null | undefined): null;
  private _ensureTobeNSIdentityOnRegister(name: Name | null | undefined): Nullable<NSIdentity> {
    if (!name) {
      return null;
    }
    if (typeof name === "string") {
      if (name.indexOf("|") !== -1) {
        return NSIdentity.fromFQN(name);
      }
      return NSIdentity.fromFQN(Namespace.define(this._registrationContext), name);
    } else {
      return name;
    }
  }
}
