import GrimoireInterface from "../GrimoireInterface";
import EEObject from "../Base/EEObject";
import Component from "./Component";
import NodeDeclaration from "./NodeDeclaration";
import NodeUtility from "./NodeUtility";
import Attribute from "./Attribute";
import NamespacedDictionary from "../Base/NamespacedDictionary";
import NamespacedIdentity from "../Base/NamespacedIdentity";
import IGomlInterface from "../Interface/IGomlInterface";
import GomlInterfaceGenerator from "../Interface/GomlInterfaceGenerator";

class GomlNode extends EEObject { // EEである必要がある
  public element: Element; // Dom Element
  public nodeDeclaration: NodeDeclaration;
  public children: GomlNode[] = [];
  public attributes: NamespacedDictionary<Attribute>; // デフォルトコンポーネントの属性
  public enable: boolean = true;
  public componentsElement: Element;

  private _parent: GomlNode = null;
  private _root: GomlNode = null;
  private _mounted: boolean = false;
  private _components: NamespacedDictionary<Component>;
  private _unAwakedComponent: Component[] = []; // awakeされてないコンポーネント群
  private _treeInterface: IGomlInterface = null;
  private _sharedObject: NamespacedDictionary<any> = null;
  private _deleted: boolean = false;

  /**
   * このノードの属するツリーのGomlInterface。unmountedならnull。
   * @return {IGomlInterface} [description]
   */
  public get treeInterface(): IGomlInterface {
    if (this._treeInterface) {
      return this._treeInterface;
    }
    if (this.parent) {
      return this.parent.treeInterface;
    }
    return null;
  }

  /**
   * ツリーで共有されるオブジェクト。マウントされていない状態ではnull。
   * @return {NamespacedDictionary<any>} [description]
   */
  public get sharedObject(): NamespacedDictionary<any> {
    if (this._sharedObject) {
      return this._sharedObject;
    }
    if (this.parent) {
      return this.parent._sharedObject;
    }
    return null;
  }

  /**
   * 属するツリーのルート。マウント状態は関係ない
   * @return {IGomlInterface} [description]
   */
  public get rootNode(): IGomlInterface {
    if (this._treeInterface) {
      return this._treeInterface;
    }
    return this.parent.treeInterface;
  }

  public get nodeName(): NamespacedIdentity {
    return this.nodeDeclaration.name;
  }

  public get parent(): GomlNode {
    return this._parent;
  }

  public get Mounted(): boolean {
    return this._mounted;
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
    this.element = element ? element : document.createElementNS(recipe.name.ns, recipe.name.name);
    this.componentsElement = document.createElement("COMPONENTS");
    this._root = this;

    this.element.setAttribute("x-gr-id", this.id);
    const defaultComponentNames = recipe.defaultComponents;

    // instanciate default components
    let defaultComponents = defaultComponentNames.toArray().map((id) => {
      const declaration = GrimoireInterface.componentDeclarations.get(id);
      if (!declaration) {
        throw new Error(`component '${id.fqn}' is not found.`);
      }
      return declaration.generateInstance();
    });

    this._components = new NamespacedDictionary<Component>();
    defaultComponents.forEach((c) => {
      this.addComponent(c);
    });

    // デフォルトコンポーネント群の属性リスト作成
    const attributes = defaultComponents.map((c) => c.attributes.toArray())
      .reduce((pre, current) => pre.concat(current), []); // map attributes to array.
    this.attributes = new NamespacedDictionary<Attribute>();
    attributes.forEach((attr) => {
      this.attributes.set(attr.name, attr);
    });

    // register to GrimoireInterface.
    GrimoireInterface.nodeDictionary[this.id] = this;
  }

  /**
   * ノードを削除する。使わなくなったら呼ぶ。子要素も再帰的に削除する。
   */
  public delete(): void {
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
    if (!this.enable) {
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
    if (!this.enable) {
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
   * Add child.
   * @param {GomlNode} child            追加する子ノード
   * @param {number}   index            追加位置。なければ末尾に追加
   * @param {[type]}   elementSync=true trueのときはElementのツリーを同期させる。（Elementからパースするときはfalseにする）
   */
  public addChild(child: GomlNode, index?: number, elementSync = true): void {
    if (child._deleted) {
      throw new Error("deleted node never use.");
    }
    child._parent = this;
    if (index != null && typeof index !== "number") {
      throw new Error("insert index should be number or null or undefined.");
    }
    const insertIndex = index == null ? this.children.length : index;
    this.children.splice(insertIndex, 0, child);

    // handling html
    if (elementSync) {
      let referenceElement = this.element[NodeUtility.getNodeListIndexByElementIndex(this.element, insertIndex)];
      this.element.insertBefore(child.element, referenceElement);
    }

    // mounting
    if (this.mounted) {
      child.setMounted(true);
    }
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

    target._parent = null;
    this.children.splice(index, 1);
    target.setMounted(false);

    // html sync
    this.element.removeChild(target.element);
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

  public getValue(attrName: string): any {
    const attr = this.attributes.get(attrName);
    if (attr === undefined) {
      throw new Error(`attribute "${attrName}" is not found.`);
    } else {
      return attr.Value;
    }
  }

  public setValue(attrName: string, value: any): void {
    const attr = this.attributes.get(attrName);
    if (attr === undefined) {
      console.warn(`attribute "${attrName}" is not found.`);
    } else {
      throw new Error("root Node cannot be removed.");
    }
  }

  /**
   * Set attribute
   * @param {string} name  attribute name string.
   * @param {any}    value attribute value.
   */
  public setAttribute(name: string, value: any): void {
    this.attributes.get(name).Value = value;
  }

  /**
   * Get mounted status.
   * @return {boolean} Whether this node is mounted or not.
   */
  public mounted(): boolean {
    return this._mounted;
  }

  /**
   * Update mounted status and emit events
   * @param {boolean} mounted Mounted status.
   */
  public setMounted(mounted: boolean): void {
    mounted = !!mounted;
    if (this._mounted === mounted) {
      return;
    }
    this._mounted = mounted;
    if (this._mounted) {
      if (!this._parent) {
        this._treeInterface = GomlInterfaceGenerator([this]);
        this._sharedObject = new NamespacedDictionary<any>();
      }
      this._attemptAwakeComponents();
      this.sendMessage("mount", this);
    } else {
      this._treeInterface = null;
      this._sharedObject = null;
      this.sendMessage("unmount", this);
    }
    this.children.forEach((child) => {
      child.setMounted(mounted);
    });

  }


  /**
   * Get index of this node from parent.
   * @return {number} number of index.
   */
  public index(): number {
    return this._parent.children.indexOf(this);
  }

  /**
   * このノードにコンポーネントをアタッチする。
   * @param {Component} component [description]
   */
  public addComponent(component: Component): void {
    if (component.node) {
      throw new Error("component is already registrated other node. the Component could be add to node only once, and never move.");
    }
    this.componentsElement.appendChild(component.element);
    this._components.set(component.name, component);
    component.node = this;

    if (this._mounted) {
      this._sendMessageToComponent(component, "awake");
    } else {
      this._unAwakedComponent.push(component);
    }
  }
  public getComponents(): NamespacedDictionary<Component> {
    return this._components;
  }

  /**
   * すべてのコンポーネントの属性をエレメントかデフォルト値で初期化
   */
  public resolveAttributesValue(): void {
    // 優先度：Dom > Node > Attribute

    // Dom属性の辞書作成
    const attrDictionary: { [key: string]: string } = {};
    const domAttr = this.element.attributes;
    for (let i = 0; i < domAttr.length; i++) {
      const attrNode = domAttr.item(i);
      const name = attrNode.name.toUpperCase();
      attrDictionary[name] = attrNode.value;
    }

    this._components.forEach((component) => {
      component.attributes.forEach((attr) => {
        let tagAttrValue = attrDictionary[attr.name.name];
        if (!!tagAttrValue) {
          attr.Value = tagAttrValue; // Dom指定値で解決
          return;
        }
        const nodeDefaultValue = this.nodeDeclaration.defaultAttributes.get(attr.name);
        if (nodeDefaultValue !== void 0) {
          attr.Value = nodeDefaultValue; // Node指定値で解決
          return;
        }

        const attrDefaultValue = attr.declaration.defaultValue;
        attr.Value = attrDefaultValue;
      });
    });
  }

  /**
   * コンポーネントにメッセージを送る。ただしenableでなければ何もしない。
   * @param  {Component} targetComponent [description]
   * @param  {string}    message         [description]
   * @param  {any}       args            [description]
   * @return {boolean}                   コンポーネントがenableでなければfalse
   */
  private _sendMessageToComponent(targetComponent: Component, message: string, args?: any): boolean {
    if (!targetComponent.enable) {
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
}


export default GomlNode;
