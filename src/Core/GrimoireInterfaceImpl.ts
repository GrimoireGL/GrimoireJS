import EEObject from "../Base/EEObject";
import GrimoireComponent from "../Component/GrimoireComponent";
import TemplateComponent from "../Component/TemplateComponent";
import ArrayConverter from "../Converter/ArrayConverter";
import BooleanConverter from "../Converter/BooleanConverter";
import ComponentConverter from "../Converter/ComponentConverter";
import EnumConverter from "../Converter/EnumConverter";
import NumberArrayConverter from "../Converter/NumberArrayConverter";
import NumberConverter from "../Converter/NumberConverter";
import ObjectConverter from "../Converter/ObjectConverter";
import StringArrayConverter from "../Converter/StringArrayConverter";
import StringConverter from "../Converter/StringConverter";
import Component from "../Core/Component";
import ComponentDeclaration from "../Core/ComponentDeclaration";
import GomlInterfaceImpl from "../Core/GomlInterfaceImpl";
import GomlLoader from "../Core/GomlLoader";
import GomlNode from "../Core/GomlNode";
import Namespace from "../Core/Namespace";
import NodeDeclaration from "../Core/NodeDeclaration";
import IAttributeConverterDeclaration from "../Interface/IAttributeConverterDeclaration";
import ILibraryPreference from "../Interface/ILibraryPreference";
import ITreeInitializedInfo from "../Interface/ITreeInitializedInfo";
import Ensure from "../Tool/Ensure";
import {
  ComponentIdentifier,
  ComponentRegistering,
  Ctor,
  Name,
  Nullable,
} from "../Tool/Types";
import Utility from "../Tool/Utility";
import Attribute from "./Attribute";
import { DEFAULT_NAMESPACE, EVENT_GOML_DID_ADDED, EVENT_GOML_DID_REMOVE, EVENT_GOML_WILL_ADD, EVENT_GOML_WILL_REMOVE, EVENT_ROOT_NODE_DID_ADDED, EVENT_ROOT_NODE_WILL_ADD, X_ROOT_NODE_ID } from "./Constants";
import Environment from "./Environment";
import GomlMutationObserver from "./GomlMutationObserver";
import Identity from "./Identity";
import IdentityMap from "./IdentityMap";
import NodeInterface from "./NodeInterface";

/**
 * implementation of GrimoireInterface
 */
export default class GrimoireInterfaceImpl extends EEObject {
  /**
   * manage all node declarations.
   */
  public nodeDeclarations: IdentityMap<NodeDeclaration> = new IdentityMap<NodeDeclaration>();

  /**
   * manage all converters
   */
  public converters: IdentityMap<IAttributeConverterDeclaration> = new IdentityMap<IAttributeConverterDeclaration>();

  /**
   * manage all component declaration.
   */
  public componentDeclarations: IdentityMap<ComponentDeclaration> = new IdentityMap<ComponentDeclaration>();

  /**
   * map rootNodeId to node.
   */
  public rootNodes: { [rootNodeId: string]: GomlNode } = {};

  /**
   * manage all loadtasks.
   */
  public loadTasks: ({ ns: string, task(): Promise<void> })[] = [];

  /**
   * this property is version infomation for logging
   */
  public lib: {
    [key: string]: {
      __VERSION__: string;
      __NAME__: string;
      [key: string]: any;
    },
  } = {};

  /**
   * manage all node in this context
   */
  public nodeDictionary: { [nodeId: string]: GomlNode } = {};

  /**
   * manage all components in this context
   */
  public componentDictionary: { [componentId: string]: Component } = {};

  /**
   * TODO
   */
  public libraryPreference?: ILibraryPreference;

  /**
   * debug-mode.
   * if this property is true, some error/worning message will output to console.
   * please disable this flag when you publish product application.
   */
  public debug = true;

  /**
   * Loading goml when page onload automaticaly or not.
   * @return {[type]} [description]
   */
  public autoLoading = true;

  /**
   * auto loading goml if added.
   * and remove GomlNode if goml is removed from DOM.
   */
  public shouldObserveGoml = true;

  /**
   * The object assigned to gr before loading grimoire.js
   * @type {any}
   */
  public noConflictPreserve: any;

  /**
   * whether already initialized.
   */
  public callInitializedAlready = false;

  /**
   * initialized event handlers
   */
  public initializedEventHandlers: (() => void)[] = [];

  private _registeringPluginNamespace: string;
  private _registrationContext: string = DEFAULT_NAMESPACE;

  private _gomlMutationObserber = new GomlMutationObserver();

  public import(path: string): any {
    const pathes = path.split("/");
    Utility.assert(pathes.length > 2 && pathes[1] === "ref", `invalid import path: ${path}`);
    const pluginName = pathes[0];
    const importPath = pathes.slice(2);
    if (pluginName === "grimoirejs") {
      let target = this as any;
      for (let i = 0; i < importPath.length; i++) {
        if (target[importPath[i]]) {
          target = target[importPath[i]];
        } else {
          throw new Error(`import path ${path} is not found in ${pluginName}`);
        }
      }
      return target;
    }
    for (const key in this.lib) {
      let target = this.lib[key];
      if (target.__NAME__ === pluginName) {
        for (let i = 0; i < importPath.length; i++) {
          if (target[importPath[i]]) {
            target = target[importPath[i]];
          } else {
            throw new Error(`import path ${path} is not found in ${pluginName}`);
          }
        }
        return target;
      }
    }
    throw new Error(`plugin ${pluginName} is not registered.`);
  }

  /**
   * start observation goml mutation.
   */
  public startObservation() {
    if (this._gomlMutationObserber.isObserving) {
      return;
    }
    this._gomlMutationObserber.startObservation(async added => {
      if (!this.shouldObserveGoml) {
        return;
      }
      this.emit(EVENT_GOML_WILL_ADD, added);
      await GomlLoader.loadFromScriptTag(added as HTMLScriptElement);
      this.emit(EVENT_GOML_DID_ADDED, added);
    }, removed => {
      if (!this.shouldObserveGoml) {
        return;
      }
      const root = this.getRootNode(removed);
      if (root) {
        this.emit(EVENT_GOML_WILL_REMOVE, removed);
        root.remove();
        this.emit(EVENT_GOML_DID_REMOVE, removed);
      }
    });
  }

  /**
   * stop observation
   */
  public stopObservation() {
    this._gomlMutationObserber.stopObservation();
  }

  /**
   * assert that specified plugin is registerd.
   * if not, throw an error.
   * @param pluginName namespace of plugin, e.g. 'fundamental','math'.
   * @param message error message used when plugin is not registerd.
   */
  public assertPlugin(pluginName: string, message?: string) {
    message = message || `required plugin '${pluginName}' is not registered.`;
    Utility.assert(!!this.lib[pluginName], message);
  }

  /**
   * initialize GrimoireInterface.
   * register primitive coverters/nodes.
   * if you want reset state. use GrimoireInterface.clear() instead of.
   */
  public registerBuiltinModule(): void {
    this.registerConverter(StringConverter);
    this.registerConverter("StringArray", StringArrayConverter);
    this.registerConverter(BooleanConverter);
    this.registerConverter(ObjectConverter);
    this.registerConverter(NumberConverter);
    this.registerConverter("NumberArray", NumberArrayConverter);
    this.registerConverter(ArrayConverter);
    this.registerConverter(EnumConverter);
    this.registerConverter(ComponentConverter);
    this.registerComponent(GrimoireComponent);
    this.registerComponent(TemplateComponent);
    this.registerNode("grimoire-node-base", ["GrimoireComponent"]);
    this.registerNode("template", [TemplateComponent]);
  }

  /**
   * internal use!
   * this called immediately afterwards settle `window.gr`.
   */
  public handlePreservedPreference() {
    if (!this.libraryPreference) {
      return;
    }
    const pref = this.libraryPreference.listen;

    const grEvents = [
      EVENT_ROOT_NODE_WILL_ADD,
      EVENT_ROOT_NODE_DID_ADDED,
    ];
    grEvents.forEach(event => {
      if (pref[event]) {
        this.on(event, pref[event]);
      }
    });
  }

  /**
   * Register plugins
   * @param  {(}      loadTask [description]
   * @return {[type]}          [description]
   */
  public register(loadTask: () => Promise<void>): void {
    this.loadTasks.push({ ns: this._registeringPluginNamespace, task: loadTask });
    this._registeringPluginNamespace = DEFAULT_NAMESPACE;
  }

  /**
   * call all plugin register functions.
   */
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
    this._registrationContext = DEFAULT_NAMESPACE;

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
   * @param  {string                |   Identity} name          [description]
   * @param  {IAttributeDeclaration }} attributes           [description]
   * @param  {Object                |   (new                 (}           obj           [description]
   * @return {[type]}                       [description]
   */
  public registerComponent(obj: ComponentRegistering<Object | Ctor<Component>>, superComponent?: ComponentIdentifier): ComponentDeclaration {
    Utility.assert(obj.componentName != null, `registering component has not 'componentName': ${obj}`);
    const name = this._ensureTobeNSIdentityOnRegister(obj.componentName);
    Utility.assert(!this.componentDeclarations.get(name), `component ${name.fqn} is already registerd.`);
    Utility.assert(typeof obj !== "function" || obj.prototype instanceof Component, `component constructor ${name.fqn} must be inherits Component`);
    if (this.debug && !Utility.isCamelCase(name.name)) {
      Utility.w(`component ${name.name} is registerd. but,it should be 'CamelCase'.`);
    }

    const attrs = obj.attributes || {};
    for (const key in attrs) {
      Utility.assert(attrs[key].default !== undefined, `default value of attribute ${key} in ${name.fqn} must be not 'undefined'.`);
    }

    const dec = new ComponentDeclaration(name, obj, superComponent);
    this.componentDeclarations.set(name, dec);
    return dec;
  }

  /**
   * register new node to context.
   * throw error if already registerd.
   * @param name
   * @param defaultComponents
   * @param defaults
   * @param superNode
   * @param freezeAttributes
   */
  public registerNode(
    name: Name,
    defaultComponents: ComponentIdentifier[] = [],
    defaults?: { [key: string]: any },
    superNode?: Name,
    freezeAttributes?: Name[]): NodeDeclaration {

    const registerId = this._ensureTobeNSIdentityOnRegister(name);
    Utility.assert(!this.nodeDeclarations.get(registerId), `gomlnode ${registerId.fqn} is already registerd.`);
    if (!Utility.isKebabCase(registerId.name)) {
      Utility.w(`node ${registerId.name} is registerd. but,it should be 'snake-case'.`);
    }
    const declaration = new NodeDeclaration(registerId, defaultComponents || [], defaults || {}, superNode, freezeAttributes);
    this.nodeDeclarations.set(registerId, declaration);
    return declaration;
  }

  /**
   * get companion object from Element.
   * @param scriptTag
   */
  public getCompanion(scriptTag: Element): IdentityMap<any> {
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
  public addRootNode(tag: Nullable<HTMLScriptElement>, rootNode: GomlNode): string {
    Utility.assert(!!rootNode, "can not register null to rootNodes.");
    Utility.assert(rootNode instanceof GomlNode, "rootNode must be instance of `GomlNode`");
    Utility.assert(!this.rootNodes[rootNode.id], "this node is already registered.");

    this.emit(EVENT_ROOT_NODE_WILL_ADD, {
      ownerScriptTag: tag,
      rootNode,
    });

    if (tag) {
      tag.setAttribute(X_ROOT_NODE_ID, rootNode.id);
    }
    this.rootNodes[rootNode.id] = rootNode;
    rootNode.companion.set(Namespace.define(DEFAULT_NAMESPACE).for("scriptElement"), tag);

    // awake and mount tree.
    rootNode.setMounted(true);
    rootNode.broadcastMessage("treeInitialized", {
      ownerScriptTag: tag,
      id: rootNode.id,
    } as ITreeInitializedInfo);
    rootNode.sendInitializedMessage({
      ownerScriptTag: tag,
      id: rootNode.id,
    } as ITreeInitializedInfo);

    // send events to catch root node appended

    this.emit(EVENT_ROOT_NODE_DID_ADDED, {
      ownerScriptTag: tag,
      rootNode,
    });
    return rootNode.id;
  }

  /**
   * get root node with script-tag element.
   * return null if not exist.
   * @param scriptTag
   */
  public getRootNode(scriptTag: Element): Nullable<GomlNode> {
    const id = scriptTag.getAttribute(X_ROOT_NODE_ID);
    if (id) {
      const ret = this.rootNodes[id];
      if (ret) {
        return ret;
      }
    }
    return null;
  }

  /**
   * restore global 'gr' variable by original value.
   */
  public noConflict(): void {
    (window as any)["gr"] = this.noConflictPreserve;
  }

  /**
   * Internal use!
   * @param query
   */
  public queryRootNodes(query: string): GomlNode[] {
    const scriptTags = Environment.document.querySelectorAll(query);
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
   * register converter to GrimoireInterface.
   * converter must be function or IAttributeConverterDeclaration.
   * @param name
   * @param converter
   */
  public registerConverter(name: Name, converter: ((val: any, attr: Attribute) => any)): void;
  public registerConverter(declaration: IAttributeConverterDeclaration): void;
  public registerConverter(arg1: Name | IAttributeConverterDeclaration, converter?: ((val: any, attr: Attribute) => any)): void {
    if (converter) {
      this.registerConverter({
        name: this._ensureTobeNSIdentityOnRegister(arg1 as Name),
        verify: () => true,
        convert: converter,
      });
      return;
    }
    const dec = arg1 as IAttributeConverterDeclaration;
    this.converters.set(this._ensureTobeNSIdentityOnRegister(dec.name), dec);
  }

  /**
   * override node declaration.
   * you can add default component or change default attributes.
   * @param targetDeclaration
   * @param additionalComponents
   */
  public overrideDeclaration(targetDeclaration: Name, additionalComponents: Name[]): NodeDeclaration;
  public overrideDeclaration(targetDeclaration: Name, defaults: { [attrName: string]: any }): NodeDeclaration;
  public overrideDeclaration(targetDeclaration: Name, additionalComponents: Name[], defaults: { [attrName: string]: any }): NodeDeclaration;
  public overrideDeclaration(targetDeclaration: Name, arg2: Name[] | { [attrName: string]: any }, defaults?: { [attrName: string]: any }): NodeDeclaration {
    const dec = this.nodeDeclarations.get(targetDeclaration);
    if (!dec) {
      throw new Error(`attempt not-exist node declaration : ${Ensure.tobeIdentity(targetDeclaration).name}`);
    }
    if (!dec.resolvedDependency) {
      dec.resolveDependency();
    }
    if (defaults) {
      const additionalC = arg2 as Name[];
      for (let i = 0; i < additionalC.length; i++) {
        dec.addDefaultComponent(additionalC[i]);
      }
      dec.defaultAttributes.pushDictionary(Ensure.tobeIdentityMap(defaults));
    } else if (Array.isArray(arg2)) { // only additiona components.
      for (let i = 0; i < arg2.length; i++) {
        dec.addDefaultComponent(arg2[i]);
      }
    } else {
      dec.defaultAttributes.pushDictionary(Ensure.tobeIdentityMap(arg2));
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
    ComponentDeclaration.clear();
    this.nodeDeclarations.clear();
    this.componentDeclarations.clear();
    this.converters.clear();
    for (const key in this.rootNodes) {
      delete this.rootNodes[key];
    }
    for (const key in this.nodeDictionary) {
      delete this.nodeDictionary[key];
    }
    for (const key in this.componentDictionary) {
      delete this.componentDictionary[key];
    }
    this.loadTasks.splice(0, this.loadTasks.length);
    this._registeringPluginNamespace = DEFAULT_NAMESPACE;
    this.registerBuiltinModule();
  }

  /**
   * add method to GrimoireInterface.
   * throw error if name has already exists.
   * @param name
   * @param func
   */
  public extendGrimoireInterface(name: string, func: Function): void {
    if ((this as any)[name]) {
      throw new Error(`gr.${name} can not extend.it is already exist.`);
    }
    (this as any)[name] = func.bind(this);
  }

  /**
   * add method to GomlInterface.
   * throw error if name has already exists.
   * @param name
   * @param func
   */
  public extendGomlInterface(name: string, func: Function): void {
    if ((GomlInterfaceImpl as any)[name]) {
      throw new Error(`gr.${name} can not extend.it is already exist.`);
    }
    (GomlInterfaceImpl as any)[name] = func.bind(this);
  }

  /**
   * add method to NodeInterface.
   * throw error if name has already exists.
   * @param name
   * @param func
   */
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
    const res = /^[Gg]rimoire(?:js|JS)?-(.*)$/.exec(namespace);
    if (res) {
      namespace = res[1];
    }
    this._registeringPluginNamespace = namespace;
  }

  private _ensureTobeNSIdentityOnRegister(name: Name): Identity;
  private _ensureTobeNSIdentityOnRegister(name: null | undefined): null;
  private _ensureTobeNSIdentityOnRegister(name: Name | null | undefined): Nullable<Identity> {
    if (!name) {
      return null;
    }
    if (typeof name === "string") {
      const fqn = Ensure.tobeFQN(name);
      if (fqn) {
        return Identity.fromFQN(fqn);
      }
      return Namespace.define(this._registrationContext).for(name);
    } else {
      return name;
    }
  }
}
