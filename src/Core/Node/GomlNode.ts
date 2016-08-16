import NamespacedSet from "../Base/NamespacedSet";
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
  public element: Element;
  public nodeDeclaration: NodeDeclaration;
  public children: GomlNode[] = [];
  public attributes: NamespacedDictionary<Attribute>; // デフォルトコンポーネントの属性
  public enable: boolean; // TODO: use this property!
  public sharedObject: NamespacedDictionary<any> = null;
  public componentsElement: Element;
  public treeInterface: IGomlInterface;

  private _parent: GomlNode = null;
  private _root: GomlNode = null;
  private _mounted: boolean = false;
  private _components: NamespacedDictionary<Component>;

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
    this.treeInterface = GomlInterfaceGenerator([this._root]);
    this.sharedObject = new NamespacedDictionary<any>();
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

    const attributes = defaultComponents.map((c) => c.attributes.toArray())
      .reduce((pre, current) => pre.concat(current), []); // map to attributes array.
    this.attributes = new NamespacedDictionary<Attribute>();
    attributes.forEach((attr) => {
      this.attributes.set(attr.name, attr);
    });
  }


  public sendMessage(message: string, args: any): void {
    const funcName = "$" + message;
    this._components.forEach((component) => {
      let method = component[funcName];
      if (typeof method === "function") {
        method.bind(component)(args);
      }
    });
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
  // public broadcastMessage(name: string, args: any): void {
  //   this.sendMessage(name, args);
  // for (let i = 0; i < this.children.length; i++) {
  //   this.children[i].broadcastMessage(name, args);
  // }
  // }

  /**
   * Add child.
   * @param {GomlNode} child            追加する子ノード
   * @param {number}   index            追加位置。なければ末尾に追加
   * @param {[type]}   elementSync=true trueのときはElementのツリーを同期させる。（Elementからパースするときはfalseにする）
   */
  public addChild(child: GomlNode, index?: number, elementSync = true): void {
    child._parent = this;
    child._root = this._root;
    child.treeInterface = this.treeInterface;
    child.sharedObject = this.sharedObject;
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
    if (this.mounted()) {
      child.setMounted(true);
    }
  }

  /**
   * Remove child.
   * @param {GomlNode} child Target node to be inserted.
   */
  public removeChild(child: GomlNode): void {
    for (let i = 0; i < this.children.length; i++) {
      let v = this.children[i];
      if (v === child) {
        child._parent = null;
        child._root = null;
        child.treeInterface = GomlInterfaceGenerator([]);
        child.sharedObject = null;
        this.children.splice(i, 1);
        if (this.mounted()) {
          child.setMounted(false);
          // this._onChildRemoved(child);
        }
        // html handling
        this.element.removeChild(child.element);
        break;
      }
    }
  }

  /**
   * remove myself
   */
  public remove(): void {
    if (this.parent) {
      this.parent.removeChild(this);
    } else {
      throw new Error("root Node cannot be removed.");
    }
  }

  public forEachAttr(callbackfn: (value: Attribute, fqn: string) => void): GomlNode {
    this.attributes.forEach(callbackfn);
    return this;
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
  // public emitChangeAll(): void {
  //   Object.keys(this.attributes).forEach((k) => {
  //     let v = this.attributes[k];
  //     v.forEach((attr) => {
  //       if (typeof attr.Value !== "undefined") {
  //         // attr.notifyValueChanged();
  //       }
  //     });
  //   });
  // }

  // public updateValue(attrName?: string): void { // ? すべてはemitChangeAllなのに,一つの場合はupdateValue?
  //   if (typeof attrName === "undefined") {
  //     Object.keys(this.attributes).forEach((k) => {
  //       let v = this.attributes[k];
  //       v.forEach((attr) => {
  //         // attr.notifyValueChanged();
  //       });
  //     });
  //   } else {
  //     // const target = this.getAttribute(attrName);
  //     // target.notifyValueChanged();
  //   }
  // }
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
    if (this._mounted === !mounted) {
      this._mounted = !!mounted;
      this.sendMessage(this._mounted ? "mount" : "unmount", this);
      this.attributes.forEach((value) => {
        if (value.responsively) {
          value.notifyMounted();
        }
      });
      this.children.forEach((child) => {
        child.setMounted(mounted);
      });
    }
  }


  /**
   * Get index of this node from parent.
   * @return {number} number of index.
   */
  public index(): number {
    return this._parent.children.indexOf(this);
  }

  public addComponent(component: Component): void {
    if (component.node) {
      throw new Error("component is already registrated other node. the Component could be add to node only once, and never move.");
    }
    this.componentsElement.appendChild(component.element);
    this._components.set(component.name, component);
    component.node = this;
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
        }
      });
    });
  }
}


export default GomlNode;
