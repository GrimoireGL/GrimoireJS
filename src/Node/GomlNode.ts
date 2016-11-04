import GomlInterfaceGenerator from "../Interface/GomlInterfaceGenerator";
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
    return GrimoireInterface.nodeDictionary[elem.getAttribute("x-gr-id")];
  }

  public element: Element; // Dom Element
  public nodeDeclaration: NodeDeclaration;
  public children: GomlNode[] = [];
  public attributes: NSDictionary<Attribute>; // デフォルトコンポーネントの属性
  public componentsElement: Element; //<.components>

  private _parent: GomlNode = null;
  private _root: GomlNode = null;
  private _mounted: boolean = false;
  private _components: Component[];
  private _messageBuffer: { message: string, target: Component }[] = [];
  private _tree: IGomlInterface = null;
  private _companion: NSDictionary<any> = new NSDictionary<any>();
  private _deleted: boolean = false;
  private _attrBuffer: { [fqn: string]: any } = {};
  private _defaultValueResolved: boolean = false;

  /**
   * Tag name.
   */
  public get name(): NSIdentity {
    return this.nodeDeclaration.name;
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
    if (this._parent) {
      return this._parent.isActive && this.enabled;
    } else {
      return this.enabled;
    }
  }

  /**
   * indicate this node is enabled.
   * this node never recieve any message if this node is not enabled.
   * @return {boolean} [description]
   */
  public get enabled(): boolean {
    return this.getAttribute("enabled");
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
    this._tree = GomlInterfaceGenerator([this]);
    this._components = [];
    this.attributes = new NSDictionary<Attribute>();

    this.element.setAttribute("x-gr-id", this.id);
    const defaultComponentNames = recipe.defaultComponentsActual;

    // instanciate default components
    defaultComponentNames.toArray().map((id) => {
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
    return (new Array(nodes.length)).map((v, i) => GomlNode.fromElement(nodes.item(i)));
  }

  /**
   * search from children node by name property.
   * return all nodes has same name as given.
   * @param  {string}     nodeName [description]
   * @return {GomlNode[]}          [description]
   */
  public getChildrenByNodeName(nodeName: string): GomlNode[] {
    const nodes = this.element.getElementsByTagName(nodeName);
    return (new Array(nodes.length)).map((v, i) => GomlNode.fromElement(nodes.item(i)));
  }

  /**
   * detach and delete this node and children.
   * call when this node will never use.
   */
  public delete(): void {
    this.children.forEach((c) => {
      c.delete();
    });
    GrimoireInterface.nodeDictionary[this.id] = null;
    if (this._parent) {
      this._parent.detachChild(this);
    } else {
      this.setMounted(false);
      if (this.element.parentNode) {// Dom sync TODO:必要？
        this.element.parentNode.removeChild(this.element);
      }
    }
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
    if (!this.enabled || !this.mounted) {
      return false;
    }
    this._components.forEach((component) => {
      this._sendMessageToComponent(component, message, false, false, args);
    });
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
      const range = <number>arg1;
      const message = <string>arg2;
      const args = arg3;
      this.sendMessage(message, args);
      if (range > 0) {
        for (let i = 0; i < this.children.length; i++) {
          this.children[i].broadcastMessage(range - 1, message, args);
        }
      }
    } else {
      const message = arg1;
      const args = arg2;
      this.sendMessage(message, args);
      for (let i = 0; i < this.children.length; i++) {
        this.children[i].broadcastMessage(message, args);
      }
    }
  }

  /**
   * add new instance created by given name and attributes for this node as child.
   * @param {string |   NSIdentity} nodeName      [description]
   * @param {any    }} attributes   [description]
   */
  public addChildByName(nodeName: string | NSIdentity, attributes: { [attrName: string]: any }): GomlNode {
    if (typeof nodeName === "string") {
      this.addChildByName(new NSIdentity(nodeName), attributes);
    } else {
      const nodeDec = GrimoireInterface.nodeDeclarations.get(nodeName);
      const node = new GomlNode(nodeDec, null);
      if (attributes) {
        for (let key in attributes) {
          const id = key.indexOf("|") !== -1 ? NSIdentity.fromFQN(key) : new NSIdentity(key);
          node.setValue(id, attributes[key]);
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
    child._parent = this;
    const insertIndex = index == null ? this.children.length : index;
    this.children.splice(insertIndex, 0, child);

    const checkChildConstraints = child.checkTreeConstraints();
    const checkAncestorConstraint = this._callRecursively(n => n.checkTreeConstraints(), n => n._parent ? [n._parent] : [])
      .reduce((list, current) => list.concat(current));
    const errors = checkChildConstraints.concat(checkAncestorConstraint).filter(m => m);
    if (errors.length !== 0) {
      const message = errors.reduce((m, current) => m + "\n" + current);
      throw new Error("tree constraint is not satisfied.\n" + message);
    }

    // handling html
    if (elementSync) {
      let referenceElement = this.element[NodeUtility.getNodeListIndexByElementIndex(this.element, insertIndex)];
      this.element.insertBefore(child.element, referenceElement);
    }
    child._tree = this._tree;
    child._companion = this._companion;
    // mounting
    if (this.mounted) {
      child.setMounted(true);
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
      node.delete();
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

    // check ancestor constraint.
    const errors = this._callRecursively(n => n.checkTreeConstraints(), n => n._parent ? [n._parent] : [])
      .reduce((list, current) => list.concat(current))
      .filter(m => m);
    if (errors.length !== 0) {
      const message = errors.reduce((m, current) => m + "\n" + current);
      throw new Error("tree constraint is not satisfied.\n" + message);
    }
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
    attrName = Ensure.ensureTobeNSIdentity(attrName);
    const attr = this.attributes.get(attrName);
    if (!attr) {
      const attrBuf = this._attrBuffer[attrName.fqn];
      if (attrBuf !== void 0) {
        return attrBuf;
      }
      console.warn(`attribute "${attrName.name}" is not found.`);
      return;
    } else {
      return attr.Value;
    }
  }

  /**
   * set value to selected attribute.
   * @param {string |     NSIdentity}  attrName [description]
   * @param {any}       value [description]
   */
  public setValue(attrName: string | NSIdentity, value: any): void {
    console.warn("setValue is obsolate. please use setAttribute instead of");
    this.setAttribute(attrName, value);
  }
  public setAttribute(attrName: string | NSIdentity, value: any): void {
    attrName = Ensure.ensureTobeNSIdentity(attrName);
    const attr = this.attributes.get(attrName);
    if (!attr) {
      console.warn(`attribute "${attrName.name}" is not found.`);
      this._attrBuffer[attrName.fqn] = value;
    } else {
      attr.Value = value;
    }
  }

  /**
   *  Add new attribute. In most of case, users no need to call this method.
   *  Use __addAttribute in Component should be used instead.
   */
  public addAttribute(attr: Attribute): void {
    this.attributes.set(attr.name, attr);

    // check buffer value.
    const attrBuf = this._attrBuffer[attr.name.fqn];
    if (attrBuf !== void 0) {
      attr.Value = attrBuf;
      delete this._attrBuffer[attr.name.fqn];
    }
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
      this._mounted = mounted;
      this._clearMessageBuffer("unmount");
      this._sendMessage("awake", true, false);
      this._sendMessage("mount", false, true);
      this.children.forEach((child) => {
        child.setMounted(mounted);
      });
    } else {
      this._clearMessageBuffer("mount");
      this.children.forEach((child) => {
        child.setMounted(mounted);
      });
      this._sendMessage("unmount", false, true);
      this._sendMessage("dispose", true, false);
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
    return this._parent.children.indexOf(this);
  }

  /**
   * remove attribute from this node.
   * @param {Attribute} attr [description]
   */
  public removeAttribute(attr: Attribute): void {
    this.attributes.delete(attr.name);
  }

  /**
   * attach component to this node.
   * @param {Component} component [description]
   */
  public addComponent(component: string | NSIdentity, attributes: { [key: string]: any } = null, isDefaultComponent = false): Component {
    const declaration = GrimoireInterface.componentDeclarations.get(component as NSIdentity);
    const instance = declaration.generateInstance();
    attributes = attributes || {};
    for (let key in attributes) {
      instance.setValue(key, attributes[key]);
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
    if (isDefaultComponent) {
      component.isDefaultComponent = true;
    }
    const insertIndex = this._components.length;
    let referenceElement = this.componentsElement[NodeUtility.getNodeListIndexByElementIndex(this.componentsElement, insertIndex)];
    this.componentsElement.insertBefore(component.element, referenceElement);

    this._components.push(component);
    component.node = this;
    component.addEnabledObserver((c) => {
      if (c.enabled) {
        // TODO ??
        this._sendBufferdMessageToComponent(c, "mount", false, true);
        this._sendBufferdMessageToComponent(c, "unmount", false, true);
      }
    });
    if (isDefaultComponent) {
      // attributes should be exposed on node
      component.attributes.forEach(p => this.addAttribute(p));
      if (this._defaultValueResolved) {
        component.attributes.forEach(p => p.resolveDefaultValue(NodeUtility.getAttributes(this.element)));
      }
    }
    if (this._mounted) {
      this._sendMessageToComponent(component, "awake", true, false);
      this._sendMessageToComponent(component, "mount", false, true);
    }
  }

  public getComponents(): Component[] {
    return this._components;
  }

  /**
   * search component by name from this node.
   * @param  {string | NSIdentity}  name [description]
   * @return {Component}   component found first.
   */
  public getComponent(name: string | NSIdentity): Component {
    if (typeof name === "string") {
      for (let i = 0; i < this._components.length; i++) {
        if (this._components[i].name.name === name) {
          return this._components[i];
        }
      }
    } else {
      for (let i = 0; i < this._components.length; i++) {
        if (this._components[i].name.fqn === name.fqn) {
          return this._components[i];
        }
      }
    }
    return null;
  }

  /**
   * resolve default attribute value for all component.
   * すべてのコンポーネントの属性をエレメントかデフォルト値で初期化
   */
  public resolveAttributesValue(): void {
    this._defaultValueResolved = true;
    this._components.forEach((component) => {
      component.resolveDefaultAttributes(NodeUtility.getAttributes(this.element));
    });
  }

  /**
   * check tree constraint for this node.
   * @return {string[]} [description]
   */
  public checkTreeConstraints(): string[] {
    const constraints = this.nodeDeclaration.treeConstraints;
    if (!constraints) {
      return [];
    }
    const errorMesasges = constraints.map(constraint => {
      return constraint(this);
    }).filter(message => message !== null);
    if (errorMesasges.length === 0) {
      return null;
    }
    return errorMesasges;
  }

  /**
   * バッファしていたmount,unmountが送信されるかもしれない.アクティブなら
   */
  public notifyActivenessUpdate(): void {
    if (this.isActive) {
      this._sendBufferdMessage(this.mounted ? "mount" : "unmount", false);
      this.children.forEach(child => {
        child.notifyActivenessUpdate();
      })
    }
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
  private _sendMessageToComponent(targetComponent: Component, message: string, forced: boolean, toBuffer: boolean, args?: any): boolean {
    message = Ensure.ensureTobeMessage(message);
    const bufferdIndex = this._messageBuffer.findIndex(obj => obj.message === message && obj.target === targetComponent);
    if (!forced && (!targetComponent.enabled || !this.isActive)) {
      if (toBuffer && bufferdIndex < 0) {
        this._messageBuffer.push({ message: Ensure.ensureTobeMessage(message), target: targetComponent });
      }
      return false;
    }
    message = Ensure.ensureTobeMessage(message);
    let method = targetComponent[message];
    if (typeof method === "function") {
      method.bind(targetComponent)(args);
    }
    if (bufferdIndex >= 0) {
      this._messageBuffer.splice(bufferdIndex, 1);
    }
    return true;
  }
  /**
   * バッファからメッセージを送信。成功したらバッファから削除
   * @param  {Component} target  [description]
   * @param  {string}    message [description]
   * @param  {boolean}   forced  [description]
   * @param  {any}       args    [description]
   * @return {boolean}           成功したか
   */
  private _sendBufferdMessageToComponent(target: Component, message: string, forced: boolean, sendToRemove: boolean, args?: any): boolean {
    if (!forced && (!target.enabled || !this.isActive)) {
      return false;
    }
    message = Ensure.ensureTobeMessage(message);
    const bufferdIndex = this._messageBuffer.findIndex(obj => obj.message === message && obj.target === target);
    if (bufferdIndex >= 0) {
      let method = target[message];
      if (typeof method === "function") {
        method.bind(target)(args);
      }
      if (sendToRemove) {
        this._messageBuffer.splice(bufferdIndex, 1);
      }
      return true;
    }
    return false;
  }

  private _sendMessage(message: string, forced: boolean, toBuffer: boolean, args?: any): void {
    this._components.forEach((component) => {
      this._sendMessageToComponent(component, message, forced, toBuffer, args);
    });
  }

  /**
   * バッファのメッセージを送信可能なら送信してバッファから削除
   */
  private _sendBufferdMessage(message: string, forced: boolean, args?: any): void {
    const next: { message: string, target: Component }[] = [];
    message = Ensure.ensureTobeMessage(message);
    this._messageBuffer.forEach((obj) => {
      if (obj.message !== message || !this._sendBufferdMessageToComponent(obj.target, message, forced, false, args)) {
        next.push(obj);
      }
    });
    this._messageBuffer = next;
  }

  private _clearMessageBuffer(message: string): void {
    message = Ensure.ensureTobeMessage(message);
    this._messageBuffer = this._messageBuffer.filter(obj => obj.message !== message)
  }

  private _callRecursively<T>(func: (g: GomlNode) => T, nextGenerator: (n: GomlNode) => GomlNode[]): T[] {
    const val = func(this);
    const nexts = nextGenerator(this);
    const nextVals = nexts.map(c => c.callRecursively(func));
    const list = nextVals.reduce((clist, current) => clist.concat(current), []);
    list.unshift(val);
    return list;
  }
}


export default GomlNode;
