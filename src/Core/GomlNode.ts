import EEObject from "../Base/EEObject";
import AttributeManager from "../Core/AttributeManager";
import GrimoireInterface from "../Core/GrimoireInterface";
import IGrimoireNodeModel from "../Interface/IGrimoireNodeModel";
import ITreeInitializedInfo from "../Interface/ITreeInitializedInfo";
import Ensure from "../Tool/Ensure";
import MessageException from "../Tool/MessageException";
import {
  ComponentIdentifier,
  Ctor,
  GomlInterface,
  Name,
  Nullable,
} from "../Tool/Types";
import * as Utility from "../Tool/Utility";
import XMLReader from "../Tool/XMLReader";
import { Attribute, LazyAttribute, StandardAttribute } from "./Attribute";
import Component from "./Component";
import { EVENT_MESSAGE_ERROR, X_GR_ID } from "./Constants";
import Environment from "./Environment";
import GomlParser from "./GomlParser";
import Identity from "./Identity";
import IdentityMap from "./IdentityMap";
import NodeDeclaration from "./NodeDeclaration";

type SystemMessage = "$$awake" | "$$mount" | "$$unmount" | "$$dispose" | "$$mounted" | "$$preunmount";

/**
 * This class is the most primitive element constitute Tree.
 * contain some Component, and send/recieve message to them.
 */
export default class GomlNode extends EEObject {

  /**
   * Get actual goml node from element of xml tree.
   * @param  {Element}  elem [description]
   * @return {GomlNode}      [description]
   */
  public static fromElement(elem: Element): GomlNode {
    const id = elem.getAttribute(X_GR_ID);
    if (id) {
      return GrimoireInterface.nodeDictionary[id];
    } else {
      throw new Error("element has not 'x-gr-id'");
    }
  }

  /**
   * Dom Element
   */
  public element: Element; // Dom Element

  /**
   * default attribute defined in GOML
   */
  public gomAttribute: { [key: string]: string } = {};

  /**
   * declaration infomation.
   */
  public declaration: NodeDeclaration;

  /**
   * children nodes.
   */
  public children: GomlNode[] = [];

  private _parent: Nullable<GomlNode> = null;
  private _components: Component[];
  private _tree: GomlInterface = GrimoireInterface([this]);
  private _companion: IdentityMap<any> = new IdentityMap<any>();
  private _attributeManager: AttributeManager;
  private _isActive = false;
  private _messageCache: { [message: string]: Component[] } = {};
  private _deleted = false;
  private _mounted = false;
  private _enabled = true;
  private _defaultValueResolved = false;
  private _initializedInfo: Nullable<ITreeInitializedInfo> = null;

  /**
   * Tag name.
   */
  public get name(): Identity {
    return this.declaration.name;
  }

  /**
   * GomlInterface that this node is bound to.
   * throw exception if this node is not mounted.
   * @return {GomlInterface} [description]
   */
  public get tree(): GomlInterface {
    if (!this.mounted) {
      throw new Error("this node is not mounted");
    }
    return this._tree;
  }

  /**
   * indicate this node is already deleted.
   * if this node is deleted once, this node will not be mounted.
   * @return {boolean} [description]
   */
  public get deleted(): boolean {
    return this._deleted;
  }

  /**
   * indicate this node is enabled in tree.
   * This value must be false when ancestor of this node is disabled.
   * @return {boolean} [description]
   */
  public get isActive(): boolean {
    return this._isActive;
  }

  /**
   * indicate this node is enabled.
   * this node never recieve any message if this node is not enabled.
   * @return {boolean} [description]
   */
  public get enabled(): boolean {
    return this._enabled;
  }
  public set enabled(value) {
    this.setAttribute("enabled", value);
  }

  /**
   * the shared object by all nodes in tree.
   * @return {IdentityMap<any>} [description]
   */
  public get companion(): IdentityMap<any> {
    return this._companion;
  }

  /**
   * parent node of this node.
   * if this node is root, return null.
   * @return {GomlNode} [description]
   */
  public get parent(): Nullable<GomlNode> {
    return this._parent;
  }

  /**
   * return true if this node has some child nodes.
   * @return {boolean} [description]
   */
  public get hasChildren(): boolean {
    return this.children.length > 0;
  }

  /**
   * indicate mounted status.
   * this property to be true when treeroot registered to GrimoireInterface.
   * to be false when this node detachd from the tree.
   * @return {boolean} Whether this node is mounted or not.
   */
  public get mounted(): boolean {
    return this._mounted;
  }

  /**
   * Get index of this node from parent.
   * @return {number} number of index.
   */
  public get index(): number {
    if (!this._parent) {
      return -1;
    }
    return this._parent.children.indexOf(this);
  }

  /**
   * create new instance.
   * @param  {NodeDeclaration} declaration  作成するノードのDeclaration
   * @param  {Element}         element 対応するDomElement
   * @return {[type]}                  [description]
   */
  constructor(declaration: NodeDeclaration, element?: Element) {
    super();
    if (!declaration) {
      throw new Error("declaration must not be null");
    }
    if (!declaration.resolvedDependency) {
      declaration.resolveDependency();
    }
    this.declaration = declaration;
    this.element = element || Environment.document.createElementNS(declaration.name.ns.qualifiedName, declaration.name.name);
    this._components = [];
    this._attributeManager = new AttributeManager(declaration.name.name);

    this.element.setAttribute(X_GR_ID, this.id);
    const defaultComponentNames = declaration.defaultComponentsActual;

    // instanciate default components
    defaultComponentNames.forEach(id => {
      this.addComponent(id, null, true);
    });
  }

  /**
   * search from children node by class property.
   * return all nodes has same class as given.
   * @param  {string}     className [description]
   * @return {GomlNode[]}           [description]
   */
  public getChildrenByClass(className: string): GomlNode[] {
    const nodes = this.element.getElementsByClassName(className);
    const array = new Array(nodes.length);
    for (let i = 0; i < nodes.length; i++) {
      array[i] = GomlNode.fromElement(nodes.item(i));
    }
    return array;
  }

  /**
   * Query children from current node.
   * @param  {string}   query [description]
   * @return GomlNode[]       [description]
   */
  public queryChildren(query: string): GomlNode[] {
    const nodes = this.element.querySelectorAll(query);
    const array = new Array(nodes.length);
    for (let i = 0; i < nodes.length; i++) {
      array[i] = GomlNode.fromElement(nodes.item(i));
    }
    return array;
  }

  /**
   * search from children node by name property.
   * return all nodes has same name as given.
   * @param  {string}     nodeName [description]
   * @return {GomlNode[]}          [description]
   */
  public getChildrenByNodeName(nodeName: string): GomlNode[] {
    const nodes = this.element.getElementsByTagName(nodeName);
    const array = new Array(nodes.length);
    for (let i = 0; i < nodes.length; i++) {
      array[i] = GomlNode.fromElement(nodes.item(i));
    }
    return array;
  }

  /**
   * remove this node from tree.
   */
  public remove(): void {
    if (this._parent) {
      this._parent.detachChild(this);
    } else {
      this.setMounted(false);
      if (this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }
    }

    this.children.forEach((c) => {
      c.remove();
    });
    this._sendMessageForced("$$dispose");
    this.removeAllListeners();
    delete GrimoireInterface.nodeDictionary[this.id];
    this._deleted = true;
  }

  /**
   * send message to this node.
   * invoke component method has same name as message if this node isActive.
   * @param  {string}  message [description]
   * @param  {any}     args    [description]
   * @return {boolean}         is this node active.
   */
  public sendMessage(message: string, args?: any): boolean {
    if (!this.isActive) {
      return false;
    }
    message = Ensure.tobeMessage(message);
    this._sendMessage(message, args);
    return true;
  }

  /**
   * sendMessage recursively for children.
   * @param {number} range depth for recursive call.0 for only this node.1 for only children.
   * @param {string} name  [description]
   * @param {any}    args  [description]
   */
  public broadcastMessage(range: number, name: string, args?: any): void;
  public broadcastMessage(name: string, args?: any): void;
  public broadcastMessage(arg1: number | string, arg2?: any, arg3?: any): void {
    if (!this.enabled || !this.mounted) {
      return;
    }
    if (typeof arg1 === "number") {
      const range = arg1;
      const message = Ensure.tobeMessage(arg2 as string);
      const args = arg3;
      this._broadcastMessage(message, args, range);
    } else {
      const message = Ensure.tobeMessage(arg1);
      const args = arg2;
      this._broadcastMessage(message, args, -1);
    }
  }

  /**
   * add child node.
   * @param tag
   */
  public append(tag: string | IGrimoireNodeModel): GomlNode[] {
    const gom = typeof tag === "string" ? GomlParser.parseToGOM(XMLReader.parseXML(tag)) : tag;
    const ret: GomlNode[] = [];
    const child = GomlParser.parseGOMToGomlNode(gom);
    this.addChild(child);
    ret.push(child);
    return ret;
  }

  /**
   * add new instance created by given name and attributes for this node as child.
   * @param {string |   Identity} nodeName      [description]
   * @param {any    }} attributes   [description]
   */
  public addChildByName(nodeName: Name, attributes: { [attrName: string]: any } = {}): GomlNode {
    const nodeDec = GrimoireInterface.nodeDeclarations.get(nodeName);
    if (!nodeDec) {
      throw new Error(`In node ${this.name}: the node that attempted to add to child is not found.`);
    }
    const node = new GomlNode(nodeDec);
    if (attributes) {
      for (const key in attributes) {
        node.setAttribute(key, attributes[key]);
      }
    }
    this.addChild(node);
    return node;
  }

  /**
   * Add child for this node.
   * @param {GomlNode} child            child node to add.
   * @param {number}   index            index for insert.なければ末尾に追加
   */
  public addChild(child: GomlNode, index?: number | null): void {
    if (child._deleted) {
      throw new Error("deleted node never use.");
    }
    if (index != null && typeof index !== "number") {
      throw new Error("insert index should be number or null or undefined.");
    }

    // add process.
    const insertIndex = index == null ? this.children.length : index;
    this.children.splice(insertIndex, 0, child);
    child._parent = this;
    child._tree = this._tree; // TODO これは問題がある。再帰的に設定しなければ。
    child._companion = this._companion; // TODO これは問題がある。再帰的に設定しなければ。

    // sync html
    const referenceElement = (this.element as any)[Utility.getNodeListIndexByElementIndex(this.element, insertIndex)];
    this.element.insertBefore(child.element, referenceElement);

    // mounting
    if (this.mounted) {
      child.setMounted(true);
    }

    // send initializedInfo if needed
    if (this._initializedInfo) {
      child.sendInitializedMessage(this._initializedInfo);
    }
  }

  /**
   * Internal use!
   * @param func
   */
  public callRecursively<T>(func: (g: GomlNode) => T): T[] {
    return _callRecursively(this, func, (n) => n.children);

    function _callRecursively(self: GomlNode, f: (g: GomlNode) => T, nextGenerator: (n: GomlNode) => GomlNode[]): T[] {
      const val = f(self);
      const nexts = nextGenerator(self);
      const nextVals = nexts.map(c => _callRecursively(c, f, nextGenerator));
      const list = Utility.flat(nextVals);
      list.unshift(val);
      return list;
    }
  }

  /**
   * delete child node.
   * @param {GomlNode} child Target node to be inserted.
   */
  public removeChild(child: GomlNode): void {
    const node = this.detachChild(child);
    if (node) {
      node.remove();
    }
  }

  /**
   * detach given node from this node if target is child of this node.
   * return null if target is not child of this node.
   * @param  {GomlNode} child [description]
   * @return {GomlNode}       detached node.
   */
  public detachChild(target: GomlNode): Nullable<GomlNode> {
    const index = this.children.indexOf(target);
    if (index === -1) {
      return null;
    }

    target.setMounted(false);
    target._parent = null;
    this.children.splice(index, 1);
    // html sync
    this.element.removeChild(target.element);

    return target;
  }

  /**
   * detach this node from parent.
   */
  public detach(): void {
    if (this.parent) {
      this.parent.detachChild(this);
    } else {
      throw new Error("root Node cannot be detached.");
    }
  }

  /**
   * get attribute value.
   * @param attrName
   */
  public getAttribute<T = any>(attrName: Name): T {
    return this._attributeManager.getAttribute(attrName);
  }

  /**
   * get attribute object instance.
   * @param attrName
   */
  public getAttributeRaw(attrName: Name): Attribute {
    return this._attributeManager.getAttributeRaw(attrName);
  }

  /**
   * set attribute value
   * @param attrName
   * @param value
   * @param ignoireFreeze set value ignorering attribute freeze.
   */
  public setAttribute(attrName: Name, value: any, ignoireFreeze = false): void {
    const attrIds = this._attributeManager.guess(attrName);
    if (attrIds.length === 0) { // such attribute is not exists. set to Attribute buffer.
      this._attributeManager.setAttribute(typeof attrName === "string" ? attrName : attrName.fqn, value);
      return;
    }
    for (let i = 0; i < attrIds.length; i++) {
      const id = attrIds[i];
      if (!ignoireFreeze && this.isFreezeAttribute(id.fqn)) {
        throw new Error(`attribute ${id.fqn} can not set. Attribute is frozen. `);
      }
      this._attributeManager.setAttribute(id.fqn, value);
    }
  }

  /**
   *  Internal use!
   *  Add new attribute. In most of case, users no need to call this method.
   *  Use __addAttribute in Component should be used instead.
   */
  public addAttribute(attr: Attribute): Attribute {
    return this._attributeManager.addAttribute(attr);
  }

  /**
   * remove attribute from this node.
   * @param {StandardAttribute} attr [description]
   */
  public removeAttribute(attr: Attribute): boolean {
    return this._attributeManager.removeAttribute(attr);
  }

  /**
   * Internal use!
   * Update mounted status and emit events
   * @param {boolean} mounted Mounted status.
   */
  public setMounted(mounted: boolean): void {
    if (this._mounted === mounted) {
      return;
    }
    if (mounted) {
      this._mounted = true;

      // register to GrimoireInterface.
      GrimoireInterface.nodeDictionary[this.id] = this;

      const temp = this._components.concat();
      this.resolveAttributesValue();
      for (let i = 0; i < temp.length; i++) {
        const target = temp[i];
        target.awake();
        this._sendMessageForcedTo(target, "$$mount");
      }
      for (let i = 0; i < this.children.length; i++) {
        this.children[i].setMounted(true);
      }
      this._sendMessageForced("$$mounted");
    } else {
      this._sendMessageForced("$$preunmount");
      for (let i = 0; i < this.children.length; i++) {
        this.children[i].setMounted(false);
      }
      this._sendMessageForced("$$unmount");
      this._isActive = false;
      this._tree = GrimoireInterface([this]);
      this._companion = new IdentityMap<any>();
      this._mounted = false;
    }
  }

  /**
   * attach component to this node.
   * @param {Component} component [description]
   */
  public addComponent<T extends Component = Component>(component: (new () => T), attributes?: { [key: string]: any } | null, isDefaultComponent?: boolean): T;
  public addComponent<T extends Component = Component>(component: Name, attributes?: { [key: string]: any } | null, isDefaultComponent?: boolean): T;
  public addComponent(component: Name | (new () => Component), attributes?: { [key: string]: any } | null, isDefaultComponent = false): Component {
    component = Ensure.tobeComponentIdentity(component);
    const declaration = GrimoireInterface.componentDeclarations.get(component);
    if (!declaration) {
      throw new Error(`component '${Ensure.tobeIdentity(component).fqn}' is not defined.`);
    }
    const instance = declaration.generateInstance();
    attributes = attributes || {};

    for (const key in attributes) {
      instance.setAttribute(key, attributes[key]);
    }
    this._addComponentDirectly(instance, isDefaultComponent);
    return instance;
  }

  /**
   * Internal use!
   * Should not operate by users or plugin developpers
   * @param {Component} component          [description]
   * @param {boolean}   isDefaultComponent [description]
   */
  public _addComponentDirectly(component: Component, isDefaultComponent: boolean): void {
    if (component.node || component.disposed) {
      throw new Error("component never change attached node");
    }

    // resetting cache
    this._messageCache = {}; // TODO: optimize.

    component.isDefaultComponent = !!isDefaultComponent;
    component.node = this;

    this._components.push(component);

    // attributes should be exposed on node
    component.attributes.forEach(p => this.addAttribute(p));
    if (this._defaultValueResolved) {
      component.resolveDefaultAttributes();
    }

    if (this._mounted) {
      this._sendMessageForcedTo(component, "$$awake");
      this._sendMessageForcedTo(component, "$$mount");
    }

    // sending `initialized` message if needed.
    if (this._initializedInfo) {
      component.initialized(this._initializedInfo);
    }
  }

  /**
   * remove all component if exists.
   * @param component
   * @return remove one or more components.
   */
  public removeComponents(component: Name | (new () => Component)): boolean {
    let result = false;
    const removeTargets = this.getComponents(component);
    // component = Ensure.tobeComponentIdentity(component);
    // for (let i = 0; i < this._components.length; i++) {
    //   const c = this._components[i];
    //   if (c.name.fqn === component.fqn) {
    //     removeTargets.push(c);
    //   }
    // }
    removeTargets.forEach(c => {
      const b = this.removeComponent(c);
      result = result || b;
    });
    return result;
  }

  /**
   * remove component if exists.
   * @param component
   * @return success or not.
   */
  public removeComponent(component: Component): boolean {
    const index = this._components.indexOf(component);
    if (index !== -1) {
      this._sendMessageForcedTo(component, "$$unmount");
      this._sendMessageForcedTo(component, "$$dispose");
      component.attributes.forEach(attr => {
        this.removeAttribute(attr);
      });
      this._components.splice(index, 1);
      this._messageCache = {}; // TODO:optimize.
      delete component.node;
      component.disposed = true;
      delete GrimoireInterface.componentDictionary[component.id];
      return true;
    }
    return false;
  }

  /**
   * Get list of components in this node.
   * If you omit the parameter, return all component.
   * @param filter
   */
  public getComponents<T>(filter?: Name | Ctor<T>): T[] {
    if (!filter) {
      return this._components as any as T[];
    } else {
      const ctor = Ensure.tobeComponentConstructor(filter);
      if (!ctor) {
        return [];
      }
      return this._components.filter(c => c instanceof ctor) as any as T[];
    }
  }

  /**
   * search component by name from this node.
   * return null if component was not found.
   * @param  {Name}  name [description]
   * @return {Component}   component found first.
   */
  public getComponent<T extends Component = Component>(name: Name | Ctor<T>, mandatory?: true): T;
  public getComponent<T extends Component = Component>(name: Name | Ctor<T>, mandatory: false): Nullable<T>;
  public getComponent<T extends Component = Component>(name: Name | Ctor<T>, mandatory = true): Nullable<T> {
    if (!name) {
      throw new Error("name must not be null or undefined");
    } else if (typeof name === "function") {
      const component = this._components.find(c => c instanceof name) as any as (T | undefined);
      if (mandatory && !component) {
        throw new Error(`getComponent for component "${(name as ComponentIdentifier).componentName}" with mandatory flag was called on ${this.name.name}(${this.name.fqn}) but specified component don't exist.`);
      }
      return component || null;
    } else {
      const ctor = Ensure.tobeComponentConstructor(name);
      if (!ctor) {
        throw new Error(`component ${name} haven't been registered`);
      }
      return this.getComponent<T>(ctor as any as Ctor<T>, mandatory as any);
    }
  }

  /**
   * get all components for chilcren recursively.
   * @param name
   */
  public getComponentsInChildren<T extends Component = Component>(name: Name | Ctor<T>): T[] {
    if (name == null) {
      throw new Error("getComponentsInChildren recieve null or undefined");
    }
    return this.callRecursively(node => node.getComponent<T>(name, false)).filter(c => !!c) as any;
  }

  /**
   * search component in ancectors of this node.
   * return component that found first.
   * return null if component not found.
   * @param  {[type]} name==null [description]
   * @return {[type]}            [description]
   */
  public getComponentInAncestor<T extends Component = Component>(name: Name | Ctor<T>, mandatory?: true): T;
  public getComponentInAncestor<T extends Component = Component>(name: Name | Ctor<T>, mandatory: false): Nullable<T>;
  public getComponentInAncestor<T extends Component = Component>(name: Name | Ctor<T>, mandatory = true): Nullable<T> {
    if (name == null) {
      throw new Error("getComponentInAncestor recieve null or undefined");
    }
    if (this.parent) {
      const parentComponent = this.parent._getComponentInAncestor(name);
      if (mandatory && !parentComponent) {
        throw new Error(`getComponentInAncestor for component "${(name as ComponentIdentifier).componentName}" with mandatory flag was called on ${this.name.name}(${this.name.fqn}) but specified component don't exist in ancestor.`);
      }
      return parentComponent;
    }
    return null;
  }

  /**
   * Internal use!
   * @param info
   */
  public sendInitializedMessage(info: ITreeInitializedInfo) {
    if (this._initializedInfo === info) {
      return;
    }
    const components = this._components.concat(); // copy
    for (let i = 0; i < components.length; i++) {
      components[i].initialized(info);
    }
    this._initializedInfo = info;
    const children = this.children.concat();
    children.forEach(child => {
      child.sendInitializedMessage(info);
    });
  }

  /**
   * resolve default attribute value for all component.
   * すべてのコンポーネントの属性をエレメントかデフォルト値で初期化
   */
  public resolveAttributesValue(): void {
    if (this._defaultValueResolved) {
      return;
    }
    this._defaultValueResolved = true;
    for (const key in (this.gomAttribute || {})) {
      if (this.isFreezeAttribute(key)) {
        throw new Error(`attribute ${key} can not change from GOML. Attribute is frozen. `);
      }
    }
    this._components.forEach((component) => {
      component.resolveDefaultAttributes();
    });
  }

  /**
   * whether provided name is freeze attribute.
   * @param attributeName
   */
  public isFreezeAttribute(attributeName: string): boolean {
    return !!this.declaration.freezeAttributes.toArray().find(name => attributeName === name.fqn);
  }

  /**
   * Internal use!
   * @param activeness
   */
  public notifyActivenessUpdate(activeness: boolean): void {
    if (this.isActive !== activeness) {
      this._isActive = activeness;
      this.children.forEach(child => {
        child.notifyActivenessUpdate(activeness && child.enabled);
      });
    }
  }

  /**
   * watch attribute.
   * @param attrName
   * @param watcher
   * @param immediate
   */
  public watch(attrName: Name, watcher: ((newValue: any, oldValue: any, attr: Attribute) => void), immediate = false) {
    this._attributeManager.watch(attrName, watcher, immediate);
  }

  /**
   * clear message cache.
   * call if dynamic change message reciever.
   */
  public clearMessageRecieverCache() {
    this._messageCache = {};
  }

  /**
   * to string
   */
  public toString(): string {
    let name = this.name.fqn;
    const id = this.getAttribute("id");
    if (id !== null) {
      name += ` id: ${id}`;
    }
    const classValue = this.getAttribute("class");
    if (classValue !== null) {
      name += ` class: ${classValue}`;
    }
    return name;
  }

  /**
   * Get detailed node structure with highlighting node.
   * @return {string} [description]
   */
  public toStructualString(message = ""): string {
    if (this.parent) {
      const open = this.parent._openTreeString();
      const content = this._currentSiblingsString(this._layer * 2, `<${this.toString()}/>`, true, message);
      const close = this.parent._closeTreeString();
      return `\n${open}${content} ${close}}`;
    } else {
      return "\n" + this._currentSiblingsString(0, `<${this.toString()}/>`, true, message);
    }
  }

  /**
   * Fetch layer of this node. Root must be 1.
   * @return {number} [description]
   */
  private get _layer(): number {
    if (!this.parent) {
      return 1;
    } else {
      return this.parent._layer + 1;
    }
  }

  private _openTreeString(): string {
    let spaces = "";
    for (let i = 0; i < this._layer * 2; i++) {
      spaces += " ";
    }
    let ancestor = "";
    let abbr = "";
    if (this.parent) {
      ancestor = this.parent._openTreeString();
      if (this.index !== 0) {
        abbr = `${spaces}...\n`;
      }
    }
    return `${ancestor}${abbr}${spaces}<${this.toString()}>\n`;
  }

  private _closeTreeString(): string {
    let spaces = "";
    for (let i = 0; i < this._layer * 2; i++) {
      spaces += " ";
    }
    let ancestor = "";
    let abbr = "";
    if (this.parent) {
      ancestor = this.parent._closeTreeString();
      if (this.index !== this.parent.children.length - 1) {
        abbr = `${spaces}...\n`;
      }
    }
    return `${spaces}</${this.name.fqn}>\n${abbr}${ancestor}`;
  }

  /**
   * Generate display string for siblings of this node.
   */
  private _currentSiblingsString(spaceCount: number, current: string, emphasis = false, message = ""): string {
    let spaces = "";
    for (let i = 0; i < spaceCount; i++) {
      spaces += " ";
    }
    let emphasisStr = "";
    if (emphasis) {
      emphasisStr = `${spaces}`;
      for (let i = 0; i < current.length; i++) {
        emphasisStr += "^";
      }
    }
    const targets: string[] = [];
    if (!this.parent) {
      targets.push(`${spaces}${current}`);
      if (emphasis) {
        targets.push(emphasisStr + message);
      }
    } else {
      let putDots = false;
      for (let i = 0; i < this.parent.children.length; i++) {
        if (i === this.index) {
          targets.push(`${spaces}${current}・・・(${i})`);
          if (emphasis) {
            targets.push(emphasisStr + message);
          }
          putDots = false;
        } else if ((i > 0 && this.index - 1 > i) || (i > this.index + 1 && this.parent.children.length - 1 > i)) {
          if (!putDots) {
            targets.push(`${spaces}...`);
            putDots = true;
          }
        } else {
          targets.push(`${spaces}<${this.parent.children[i].toString()}/>・・・(${i})`);
        }
      }
    }
    return targets.join("\n") + "\n";
  }

  private _sendMessage(message: string, args?: any): void {
    if (this._messageCache[message] === undefined) {
      this._messageCache[message] = this._components.filter(c => typeof (c as any)[message] === "function");
    }
    const targetList = this._messageCache[message];
    for (let i = 0; i < targetList.length; i++) {
      if (targetList[i].disposed) {
        continue;
      }
      this._sendMessageToComponent(targetList[i], message, args);
    }
  }
  private _broadcastMessage(message: string, args: any, range: number): void {
    // message is already ensured.-1 to unlimited range.
    if (!this.isActive) {
      return;
    }
    this._sendMessage(message, args);
    if (range === 0) {
      return;
    }
    const nextRange = range - 1;
    for (let i = 0; i < this.children.length; i++) {
      this.children[i]._broadcastMessage(message, args, nextRange);
    }
  }

  private _getComponentInAncestor<T extends Component>(name: Name | (new () => T)): Nullable<T> {
    const ret = this.getComponent(name, false);
    if (ret) {
      return ret;
    }
    if (this.parent) {
      return this.parent._getComponentInAncestor(name);
    }
    return null;
  }

  /**
   * コンポーネントにメッセージを送る。送信したらバッファからは削除される.
   * @param  {Component} targetComponent 対象コンポーネント
   * @param  {string}    message         メッセージ
   * @param  {boolean}   forced          trueでコンポーネントのenableを無視して送信
   * @param  {boolean}   toBuffer        trueで送信失敗したらバッファに追加
   * @param  {any}       args            [description]
   * @return {boolean}                   送信したか
   */
  private _sendMessageToComponent(targetComponent: Component, message: string, args?: any): boolean {
    if (!targetComponent.enabled) {
      return false;
    }
    const method = (targetComponent as any)[message];
    if (typeof method === "function") {
      try {
        method(args);
      } catch (e) {
        const wrappedError = new MessageException(this, targetComponent, message.substr(1), e);
        this.emit(EVENT_MESSAGE_ERROR, wrappedError);
        if (!wrappedError.handled) {
          GrimoireInterface.emit(EVENT_MESSAGE_ERROR, wrappedError);
          if (!wrappedError.handled) {
            throw wrappedError;
          }
        }
      }
      return true;
    }
    return false;
  }

  private _sendMessageForced(message: SystemMessage): void {
    const componentsBuffer = this._components.concat();
    for (let i = 0; i < componentsBuffer.length; i++) {
      const target = componentsBuffer[i];
      if (target.disposed) {
        continue;
      }
      this._sendMessageForcedTo(target, message);
    }
  }

  /**
   * for system messages.
   * @param {Component} target  [description]
   * @param {string}    message [description]
   */
  private _sendMessageForcedTo(target: Component, message: SystemMessage): void {
    const method = (target as any)[message];
    if (typeof method === "function") {
      method();
    }
  }
}
