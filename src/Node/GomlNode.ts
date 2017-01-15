import ITreeInitializedInfo from "./ITreeInitializedInfo";
import ComponentDeclaration from "./ComponentDeclaration";
import AttributeManager from "../Base/AttributeManager";
import GrimoireComponent from "../Components/GrimoireComponent";
import Utility from "../Base/Utility";
import Constants from "../Base/Constants";
import GomlParser from "./GomlParser";
import XMLReader from "../Base/XMLReader";
import GrimoireInterface from "../GrimoireInterface";
import EEObject from "../Base/EEObject";
import Component from "./Component";
import NodeDeclaration from "./NodeDeclaration";
import NodeUtility from "./NodeUtility";
import Attribute from "./Attribute";
import NSDictionary from "../Base/NSDictionary";
import NSIdentity from "../Base/NSIdentity";
import IGomlInterface from "../Interface/IGomlInterface";
import Ensure from "../Base/Ensure";

class GomlNode extends EEObject {
  /**
   * Get actual goml node from element of xml tree.
   * @param  {Element}  elem [description]
   * @return {GomlNode}      [description]
   */
  public static fromElement(elem: Element): GomlNode {
    return GrimoireInterface.nodeDictionary[elem.getAttribute(Constants.x_gr_id)];
  }

  public element: Element; // Dom Element
  public nodeDeclaration: NodeDeclaration;
  public children: GomlNode[] = [];
  public componentsElement: Element; //<.components>

  private _parent: GomlNode = null;
  private _root: GomlNode = null;
  private _components: Component[];
  private _tree: IGomlInterface = null;
  private _companion: NSDictionary<any> = new NSDictionary<any>();
  private _attributeManager: AttributeManager;
  private _isActive: boolean = false;

  private _messageCache: { [message: string]: Component[] } = {};
  private _attrBuffer: { [fqn: string]: any } = {};

  private _awaked: boolean = false;
  private _deleted: boolean = false;
  private _mounted: boolean = false;
  private _enabled: boolean = true;
  private _defaultValueResolved: boolean = false;
  private _initializedInfo: ITreeInitializedInfo = null;

  /**
   * Tag name.
   */
  public get name(): NSIdentity {
    return this.nodeDeclaration.name;
  }

  public get attributes(): NSDictionary<Attribute> {// デフォルトコンポーネントの属性
    return this._attributeManager.attributes;
  }

  /**
   * GomlInterface that this node is bound to.
   * throw exception if this node is not mounted.
   * @return {IGomlInterface} [description]
   */
  public get tree(): IGomlInterface {
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
   * @return {NSDictionary<any>} [description]
   */
  public get companion(): NSDictionary<any> {
    return this._companion;
  }

  /**
   * parent node of this node.
   * if this node is root, return null.
   * @return {GomlNode} [description]
   */
  public get parent(): GomlNode {
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
   * create new instance.
   * @param  {NodeDeclaration} recipe  作成するノードのDeclaration
   * @param  {Element}         element 対応するDomElement
   * @return {[type]}                  [description]
   */
  constructor(recipe: NodeDeclaration, element: Element) {
    super();
    if (!recipe) {
      throw new Error("recipe must not be null");
    }
    this.nodeDeclaration = recipe;
    this.element = element ? element : document.createElementNS(recipe.name.ns, recipe.name.name); // TODO Could be undefined or null?
    this.componentsElement = document.createElement("COMPONENTS");
    this._root = this;
    this._tree = GrimoireInterface([this]);
    this._components = [];
    this._attributeManager = new AttributeManager(recipe.name.name, new NSDictionary<Attribute>());

    this.element.setAttribute(Constants.x_gr_id, this.id);
    const defaultComponentNames = recipe.defaultComponentsActual;

    // instanciate default components
    defaultComponentNames.forEach(id => {
      this.addComponent(id, null, true);
    });
    // register to GrimoireInterface.
    GrimoireInterface.nodeDictionary[this.id] = this;
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

  public remove(): void {
    this.children.forEach((c) => {
      c.remove();
    });
    GrimoireInterface.nodeDictionary[this.id] = null;
    if (this._parent) {
      this._parent.detachChild(this);
    } else {
      this.setMounted(false);
      if (this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }
    }
    this._sendMessageForced("$$dispose");
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
    message = Ensure.ensureTobeMessage(message);
    this._sendMessage(message, args);
    return true;
  }
  private _sendMessage(message: string, args?: any): void {
    if (this._messageCache[message] === void 0) {
      this._messageCache[message] = this._components.filter(c => typeof c[message] === "function");
    }
    const targetList = this._messageCache[message];
    for (let i = 0; i < targetList.length; i++) {
      if (targetList[i].disposed) {
        continue;
      }
      this._sendMessageToComponent(targetList[i], message, args);
    }
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
      const message = Ensure.ensureTobeMessage(<string>arg2);
      const args = arg3;
      this._broadcastMessage(message, args, range);
    } else {
      const message = Ensure.ensureTobeMessage(arg1);
      const args = arg2;
      this._broadcastMessage(message, args, -1);
    }
  }
  private _broadcastMessage(message: string, args: any, range: number): void {
    //message is already ensured.-1 to unlimited range.
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

  public append(tag: string): GomlNode[] {
    const elems = XMLReader.parseXML(tag);
    let ret: GomlNode[] = [];
    elems.forEach(elem => {
      let child = GomlParser.parse(elem, null, null);
      this.addChild(child);
      ret.push(child);
    });
    return ret;
  }

  /**
   * add new instance created by given name and attributes for this node as child.
   * @param {string |   NSIdentity} nodeName      [description]
   * @param {any    }} attributes   [description]
   */
  public addChildByName(nodeName: string | NSIdentity, attributes: { [attrName: string]: any }): GomlNode {
    if (typeof nodeName === "string") {
      return this.addChildByName(NSIdentity.from(nodeName), attributes);
    } else {
      const nodeDec = GrimoireInterface.nodeDeclarations.get(nodeName);
      const node = new GomlNode(nodeDec, null);
      if (attributes) {
        for (let key in attributes) {
          const id = Ensure.ensureTobeNSIdentity(key);
          node.setAttribute(id, attributes[key]);
        }
      }
      this.addChild(node);
      return node;
    }
  }

  /**
   * Add child for this node.
   * @param {GomlNode} child            child node to add.
   * @param {number}   index            index for insert.なければ末尾に追加
   * @param {[type]}   elementSync=true trueのときはElementのツリーを同期させる。（Elementからパースするときはfalseにする）
   */
  public addChild(child: GomlNode, index?: number, elementSync = true): void {
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
    child._tree = this._tree;
    child._companion = this._companion;

    // sync html
    if (elementSync) {
      let referenceElement = this.element[NodeUtility.getNodeListIndexByElementIndex(this.element, insertIndex)];
      this.element.insertBefore(child.element, referenceElement);
    }

    // mounting
    if (this.mounted) {
      child.setMounted(true);
    }

    // send initializedInfo if needed
    if (this._initializedInfo) {
      child.sendInitializedMessage(this._initializedInfo);
    }
  }


  public callRecursively<T>(func: (g: GomlNode) => T): T[] {
    return this._callRecursively(func, (n) => n.children);
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
  public detachChild(target: GomlNode): GomlNode {
    // search child.
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
   * [[[OBSOLETE!]]]get value of attribute.
   * @param  {string | NSIdentity}  attrName [description]
   * @return {any}         [description]
   */
  public getValue(attrName: string | NSIdentity): any {
    console.warn("getValue is obsolate. please use getAttribute instead of");
    return this.getAttribute(attrName);
  }
  public getAttribute(attrName: string | NSIdentity): any {
    return this._attributeManager.getAttribute(attrName);
  }

  public getAttributeRaw(attrName: string | NSIdentity): Attribute {
    return this._attributeManager.attributes.get(attrName as string);
  }

  public setAttribute(attrName: string | NSIdentity, value: any, ignoireFreeze = true): void {
    if (!ignoireFreeze && this.isFreezeAttribute(Ensure.ensureTobeNSIdentity(attrName).name)) {
      throw new Error(`attribute ${Ensure.ensureTobeNSIdentity(attrName).name} can not set. Attribute is frozen. `);
    }
    return this._attributeManager.setAttribute(attrName, value);
  }

  /**
   *  Add new attribute. In most of case, users no need to call this method.
   *  Use __addAttribute in Component should be used instead.
   */
  public addAttribute(attr: Attribute): Attribute {
    return this._attributeManager.addAttribute(attr);
  }

  /**
   * Update mounted status and emit events
   * @param {boolean} mounted Mounted status.
   */
  public setMounted(mounted: boolean): void {
    if (this._mounted === mounted) {
      return;
    }
    if (mounted) {
      this._mount();
      for (let i = 0; i < this.children.length; i++) {
        this.children[i].setMounted(mounted);
      }
    } else {
      for (let i = 0; i < this.children.length; i++) {
        this.children[i].setMounted(mounted);
      }
      this._sendMessageForced("unmount");
      this._isActive = false;
      this._tree = null;
      this._companion = null;
      this._mounted = mounted;
    }
  }


  /**
   * Get index of this node from parent.
   * @return {number} number of index.
   */
  public index(): number {
    if (!this._parent) {
      return -1;
    }
    return this._parent.children.indexOf(this);
  }

  /**
   * remove attribute from this node.
   * @param {Attribute} attr [description]
   */
  public removeAttribute(attr: Attribute): boolean {
    return this._attributeManager.removeAttribute(attr);
  }

  /**
   * attach component to this node.
   * @param {Component} component [description]
   */
  public addComponent(component: string | NSIdentity | (new () => Component), attributes: { [key: string]: any } = null, isDefaultComponent = false): Component {
    if (typeof component === "function") { // TODO:test
      const obj = ComponentDeclaration.ctorMap.find(obj => obj.ctor === component);
      component = obj.name;
    }
    const declaration = GrimoireInterface.componentDeclarations.get(component as NSIdentity);
    const instance = declaration.generateInstance();
    attributes = attributes || {};

    for (let key in attributes) {
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
    this._messageCache = {};//TODO:optimize.
    component.isDefaultComponent = !!isDefaultComponent;
    component.node = this;
    let referenceElement = this.componentsElement[NodeUtility.getNodeListIndexByElementIndex(this.componentsElement, this._components.length)];
    this.componentsElement.insertBefore(component.element, referenceElement);
    let propNames: string[] = [];
    let o = component;
    while (o) {
      propNames = propNames.concat(Object.getOwnPropertyNames(o));
      o = Object.getPrototypeOf(o);
    }
    propNames.filter(name => name.startsWith("$") && typeof component[name] === "function").forEach(method => {
      component["$" + method] = component[method].bind(component);
    });
    this._components.push(component);

    if (isDefaultComponent) {
      // attributes should be exposed on node
      component.attributes.forEach(p => this.addAttribute(p));
      if (this._defaultValueResolved) {
        component.attributes.forEach(p => p.resolveDefaultValue(NodeUtility.getAttributes(this.element)));
      }
    }
    if (this._mounted) {
      component.resolveDefaultAttributes(null); // here must be optional component.should not use node element attributes.
      this._sendMessageForcedTo(component, "awake");
      this._sendMessageForcedTo(component, "mount");
    }

    // sending `initialized` message if needed.
    if (this._initializedInfo) {
      component.initialized(this._initializedInfo);
    }
  }

  public removeComponent(component: Component): boolean {
    const index = this._components.indexOf(component);
    if (index != -1) {
      this._sendMessageForcedTo(component, "unmount");
      this._sendMessageForcedTo(component, "dispose");
      this.componentsElement.removeChild(component.element);
      this._components.splice(index, 1);
      this._messageCache = {}; // TODO:optimize.
      component.node = null;
      component.disposed = true;
      return true;
    }
    return false;
  }

  public getComponents<T>(filter?: string | NSIdentity | (new () => T)): T[] {
    if (!filter) {
      return this._components as any as T[];
    } else {
      const ctor = Ensure.ensureTobeComponentConstructor(filter);
      return this._components.filter(c => c instanceof ctor) as any as T[];
    }
  }

  /**
   * search component by name from this node.
   * @param  {string | NSIdentity}  name [description]
   * @return {Component}   component found first.
   */
  public getComponent<T>(name: string | NSIdentity | (new () => T)): T {
    // 事情により<T extends Component>とはできない。
    // これはref/Node/Componentによって参照されるのが外部ライブラリにおけるコンポーネントであるが、
    // src/Node/Componentがこのプロジェクトにおけるコンポーネントのため、別のコンポーネントとみなされ、型の制約をみたさなくなるからである。
    if (!name) {
      throw new Error("name must be not null or undefined");
    } else if (typeof name === "function") {
      return this._components.find(c => c instanceof name) as any as T || null;
    } else {
      const ctor = Ensure.ensureTobeComponentConstructor(name);
      if (!ctor) {
        throw new Error(`component ${name} is not exist`);
      }
      return this.getComponent<T>(ctor as any as (new () => T));
    }
  }

  public getComponentsInChildren<T>(name: string | NSIdentity | (new () => T)): T[] {
    return this.callRecursively(node => node.getComponent<T>(name)).filter(c => !!c);
  }
  public getComponentInAncesotor<T>(name: string | NSIdentity | (new () => T)): T {
    if (this.parent) {
      return this.parent._getComponentInAncesotor(name);
    }
    return null;
  }

  public sendInitializedMessage(info: ITreeInitializedInfo) {
    if (this._initializedInfo === info) {
      return;
    }
    let components = this._components.concat();
    for (let i = 0; i < components.length; i++) {
      components[i].initialized(info);
    }
    this._initializedInfo = info;
    let children = this.children.concat();
    children.forEach(child => {
      child.sendInitializedMessage(info);
    });
  }



  private _getComponentInAncesotor<T>(name: string | NSIdentity | (new () => T)): T {
    const ret = this.getComponent(name);
    if (ret) {
      return ret;
    }
    if (this.parent) {
      return this.parent._getComponentInAncesotor(name);
    }
    return null;
  }

  /**
   * resolve default attribute value for all component.
   * すべてのコンポーネントの属性をエレメントかデフォルト値で初期化
   */
  public resolveAttributesValue(): void {
    this._defaultValueResolved = true;
    const attrs = NodeUtility.getAttributes(this.element);
    for (let key in attrs) {
      if (key === Constants.x_gr_id) continue;
      if (this.isFreezeAttribute(key)) {
        throw new Error(`attribute ${key} can not change from GOML. Attribute is frozen. `);
      }
      // if (!this.attributes.get(key)) {
      //   Utility.w(`attribute '${key}' is not exist in this node '${this.name.fqn}'`);
      // }
    }
    this._components.forEach((component) => {
      component.resolveDefaultAttributes(attrs);
    });
  }

  public isFreezeAttribute(attributeName: string): boolean {
    return !!this.nodeDeclaration.freezeAttributes.find(name => attributeName === name)
  }

  public notifyActivenessUpdate(activeness: boolean): void {
    if (this.isActive !== activeness) {
      this._isActive = activeness;
      this.children.forEach(child => {
        child.notifyActivenessUpdate(activeness && child.enabled);
      });
    }
  }

  public watch(attrName: string | NSIdentity, watcher: ((newValue: any, oldValue: any, attr: Attribute) => void), immediate: boolean = false) {
    this._attributeManager.watch(attrName, watcher, immediate);
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
    let method = targetComponent[message];
    if (typeof method === "function") {
      method(args);
      return true;
    }
    return false;
  }

  private _sendMessageForced(message: string): void {
    let componentsBuffer = this._components.concat();
    for (let i = 0; i < componentsBuffer.length; i++) {
      let target = componentsBuffer[i];
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
  private _sendMessageForcedTo(target: Component, message: string): void {
    message = Ensure.ensureTobeMessage(message);
    let method = target[message];
    if (typeof method === "function") {
      method();
    }
  }

  /**
   * sending mount and awake message if needed to all components.
   */
  private _mount(): void {
    this._mounted = true;
    let componentsBuffer = this._components.concat();
    for (let i = 0; i < componentsBuffer.length; i++) {
      let target = componentsBuffer[i];
      if (target.disposed) {
        continue;
      }
      target.awake();
      this._sendMessageForcedTo(target, "$$mount");
    }
  }

  private _callRecursively<T>(func: (g: GomlNode) => T, nextGenerator: (n: GomlNode) => GomlNode[]): T[] {
    const val = func(this);
    const nexts = nextGenerator(this);
    const nextVals = nexts.map(c => c.callRecursively(func));
    const list = Utility.flat(nextVals);
    list.unshift(val);
    return list;
  }
}


export default GomlNode;
