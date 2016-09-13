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

class GomlNode extends EEObject {
  public element: Element; // Dom Element
  public nodeDeclaration: NodeDeclaration;
  public children: GomlNode[] = [];
  public attributes: NSDictionary<Attribute>; // デフォルトコンポーネントの属性
  public enabled: boolean = true;
  public componentsElement: Element;

  private _parent: GomlNode = null;
  private _root: GomlNode = null;
  private _mounted: boolean = false;
  private _components: Component[];
  private _unAwakedComponent: Component[] = []; // awakeされてないコンポーネント群
  private _tree: IGomlInterface = null;
  private _companion: NSDictionary<any> = new NSDictionary<any>();
  private _deleted: boolean = false;

  /**
   * このノードの属するツリーのGomlInterface。unmountedならnull。
   * @return {IGomlInterface} [description]
   */
  public get tree(): IGomlInterface {
    return this._tree;
  }

  /**
   * ツリーで共有されるオブジェクト。マウントされていない状態ではnull。
   * @return {NSDictionary<any>} [description]
   */
  public get companion(): NSDictionary<any> {
    return this._companion;
  }

  public get nodeName(): NSIdentity {
    return this.nodeDeclaration.name;
  }

  public get parent(): GomlNode {
    return this._parent;
  }

  /**
   * 新しいインスタンスの作成
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
    const defaultComponentNames = recipe.defaultComponents;

    // instanciate default components
    defaultComponentNames.toArray().map((id) => {
      const declaration = GrimoireInterface.componentDeclarations.get(id);
      if (!declaration) {
        throw new Error(`component '${id.fqn}' is not found.`);
      }
      const component = declaration.generateInstance();
      component.isDefaultComponent = true;
      this.addComponent(component);
    });

    // デフォルトコンポーネント群の属性リスト作成
    const attributes: Attribute[] = this._components.map((c) => c.attributes.toArray())
      .reduce((pre, current) => pre.concat(current), []); // map attributes to array.
    // register attributes as node attributes
    attributes.forEach(attr => this.addAttribute(attr));

    // register to GrimoireInterface.
    GrimoireInterface.nodeDictionary[this.id] = this;
  }

  /**
   * ノードを削除する。使わなくなったら呼ぶ。子要素も再帰的に削除する。
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

  public sendMessage(message: string, args?: any): boolean {
    if (!this.enabled || !this.mounted) {
      return false;
    }
    this._components.forEach((component) => {
      this._sendMessageToComponent(component, message, args);
    });
    return true;
  }

  /**
   * [broadcastMessage description]
   * @param {number} range 0でそのノードのみ、1で子要素,2で孫...
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
   * 指定したノード名と属性で生成されたノードの新しいインスタンスを、このノードの子要素として追加
   * @param {string |   NSIdentity} nodeName      [description]
   * @param {any    }} attributes   [description]
   */
  public addNode(nodeName: string | NSIdentity, attributes: { [attrName: string]: any }): void {
    if (typeof nodeName === "string") {
      this.addNode(new NSIdentity(nodeName), attributes);
    } else {
      const nodeDec = GrimoireInterface.nodeDeclarations.get(nodeName);
      const node = new GomlNode(nodeDec, null);
      if (attributes) {
        for (let key in attributes) {
          const id = key.indexOf("|") !== -1 ? NSIdentity.fromFQN(key) : new NSIdentity(key);
          node.attr(id, attributes[key]);
        }
      }
      this.addChild(node);
    }
  }

  /**
   * Add child.
   * @param {GomlNode} child            追加する子ノード
   * @param {number}   index            追加位置。なければ末尾に追加
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
    child._tree = this.tree;
    child._companion = this.companion;
    // mounting
    if (this.mounted) {
      child.setMounted(true);
    }
  }

  public callRecursively<T>(func: (g: GomlNode) => T): T[] {
    return this._callRecursively(func, (n) => n.children);
  }

  /**
   * デタッチしてdeleteする。
   * @param {GomlNode} child Target node to be inserted.
   */
  public removeChild(child: GomlNode): void {
    const node = this.detachChild(child);
    if (node) {
      node.delete();
    }
  }

  /**
   * 指定したノードが子要素なら子要素から外す。
   * @param  {GomlNode} child [description]
   * @return {GomlNode}       [description]
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
   * detach myself
   */
  public detach(): void {
    if (this.parent) {
      this.parent.detachChild(this);
    } else {
      throw new Error("root Node cannot be detached.");
    }
  }

  public attr(attrName: string | NSIdentity): any;
  public attr(attrName: string | NSIdentity, value: any): void;
  public attr(attrName: string | NSIdentity, value?: any): any | void {
    const attr = (typeof attrName === "string")
      ? this.attributes.get(attrName) : this.attributes.get(attrName);
    if (!attr) {
      console.warn(`attribute "${attrName}" is not found.`);
      return;
    }
    if (value !== void 0) {
      // setValue.
      attr.Value = value;
    } else {
      // getValue.
      return attr.Value;
    }
  }

  /**
   *  Add new attribute. In most of case, users no need to call this method.
   *  Use __addAttribute in Component should be used instead.
   */
  public addAttribute(attr: Attribute): void {
    this.attributes.set(attr.name, attr);
  }

  /**
   * Get mounted status.
   * @return {boolean} Whether this node is mounted or not.
   */
  public get mounted(): boolean {
    return this._mounted;
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
      this._attemptAwakeComponents();
      this.sendMessage("mount", this);
      this.children.forEach((child) => {
        child.setMounted(mounted);
      });
    } else {
      this.children.forEach((child) => {
        child.setMounted(mounted);
      });
      this.sendMessage("unmount", this);
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

  public removeAttribute(attr: Attribute): void {
    this.attributes.delete(attr.name);
  }
  /**
   * このノードにコンポーネントをアタッチする。
   * @param {Component} component [description]
   */
  public addComponent(component: Component): void;
  public addComponent(component: string): void;
  public addComponent(component: Component | string): void {
    if (typeof component === "string") {
      const declaration = GrimoireInterface.componentDeclarations.get(component);
      this.addComponent(declaration.generateInstance());
      return;
    }
    if (component.node) {
      throw new Error("component is already registrated other node. the Component could be add to node only once, and never move.");
    }
    const insertIndex = this._components.length;
    let referenceElement = this.componentsElement[NodeUtility.getNodeListIndexByElementIndex(this.componentsElement, insertIndex)];
    this.componentsElement.insertBefore(component.element, referenceElement);

    this._components.push(component);
    component.node = this;
    component.addEnabledObserver((c) => {
      const enable = c.enabled;
      if (enable) {
        const index = this._unAwakedComponent.indexOf(c);
        if (index !== -1) {
          this._unAwakedComponent.splice(index, 1);
          this._sendMessageToComponent(c, "awake");
        }
        this._sendMessageToComponent(c, "mount");
      } else {
        this._sendMessageToComponent(c, "unmount");
      }
    });

    if (this._mounted) {
      this._sendMessageToComponent(component, "awake");
    } else {
      this._unAwakedComponent.push(component);
    }
  }
  public getComponents(): Component[] {
    return this._components;
  }

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
   * すべてのコンポーネントの属性をエレメントかデフォルト値で初期化
   */
  public resolveAttributesValue(): void {
    this._components.forEach((component) => {
      component.resolveDefaultAttributes(NodeUtility.getAttributes(this.element));
    });
  }

  /**
   * このノードのtreeConstrainが満たされるか調べる
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
   * コンポーネントにメッセージを送る。ただしenableでなければ何もしない。
   * @param  {Component} targetComponent [description]
   * @param  {string}    message         [description]
   * @param  {any}       args            [description]
   * @return {boolean}                   コンポーネントがenableでなければfalse
   */
  private _sendMessageToComponent(targetComponent: Component, message: string, args?: any): boolean {
    if (!targetComponent.enabled) {
      return false;
    }
    if (!message.startsWith("$")) {
      message = "$" + message;
    }
    let method = targetComponent[message];
    if (typeof method === "function") {
      method.bind(targetComponent)(args);
    }
    return true;
  }

  /**
   * コンポーネントをawakeして、成功したらunawakedリストから削除
   */
  private _attemptAwakeComponents(): void {
    const nextUnAwaked: Component[] = [];
    this._unAwakedComponent.forEach((component) => {
      if (!this._sendMessageToComponent(component, "awake")) {
        nextUnAwaked.push(component);
      }
    });
    this._unAwakedComponent = nextUnAwaked;
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
