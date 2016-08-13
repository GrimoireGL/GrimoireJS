import NamespacedSet from "../Base/NamespacedSet";
import GrimoireInterface from "../GrimoireInterface";
import EEObject from "../Base/EEObject";
import Component from "./Component";
import NodeDeclaration from "./NodeDeclaration";
import NodeUtility from "./NodeUtility";
import Attribute from "./Attribute";
import NamespacedDictionary from "../Base/NamespacedDictionary";
import NamespacedIdentity from "../Base/NamespacedIdentity";

class GomlNode extends EEObject { // EEである必要がある
  public element: Element;
  public nodeDeclaration: NodeDeclaration;
  public children: GomlNode[] = [];
  public attributes: NamespacedDictionary<Attribute>;
  public enable: boolean; // TODO: use this property!
  public sharedObject: NamespacedDictionary<any>;

  private _parent: GomlNode;
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

  constructor(recipe: NodeDeclaration, element: Element, components: NamespacedSet) {
    super();
    this.nodeDeclaration = recipe;
    this.element = element;

    // instanciate default components
    let componentsArray = components.toArray().map((id) => {
      const declaration = GrimoireInterface.componentDeclarations.get(id);
      if (!declaration) {
        throw new Error(`component '${id.fqn}' is not found.`);
      }
      return declaration.generateInstance(this);
    });
    const attributes = componentsArray.map((c) => c.attributes.toArray())
      .reduce((pre, current) => pre === undefined ? current : pre.concat(current), []);
    this._components = new NamespacedDictionary<Component>();
    componentsArray.forEach((c) => {
      this._components.set(c.name, c);
    });

    this.attributes = new NamespacedDictionary<Attribute>();
    attributes.forEach((attr) => {
      this.attributes.set(attr.name, attr);
    });

  }


  public sendMessage(message: string, args: any): void {
    this._components.forEach((component) => {
      let method = component[message];
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
   * @param {GomlNode} Target node to be inserted.
   * @param {number}   index Index of insert location in children. If this argument is null or undefined, target will be inserted in last. If this argument is negative number, target will be inserted in index from last.
   */
  public addChild(child: GomlNode, index?: number, elementSync = true): void {
    child._parent = this;
    child.sharedObject = this.sharedObject;
    if (index != null && typeof index !== "number") {
      throw new Error("insert index should be number or null or undefined.");
    }
    const insertIndex = index == null ? this.children.length : index;
    this.children.splice(insertIndex, 0, child);

    // handling html
    if (elementSync) {
      let referenceElement: HTMLElement = null;
      if (index != null) {
        referenceElement = this.element[NodeUtility.getNodeListIndexByElementIndex(this.element, index)];
      }
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
    const attr = this.getAttribute(attrName);
    if (attr === undefined) {
      throw new Error(`attribute "${attrName}" is not found.`);
    } else {
      return attr.Value;
    }
  }

  public setValue(attrName: string, value: any): void {
    // TODO: 引数が名前空間を含むかどうかで分岐
    const attr = this.getAttribute(attrName);
    if (attr === undefined) {
      console.warn(`attribute "${attrName}" is not found.`);
    } else {
      throw new Error("root Node cannot be removed.");
    }
  }

  public getAttribute(attrName: string): Attribute {
    let attr = this.attributes.get(attrName);
    if (!attr) {
      throw new Error(`attribute "${attrName}" is not found.`);
    }
    return attr;
  }

  /**
   * Set attribute
   * @param {string} name  attribute name string.
   * @param {any}    value attribute value.
   */
  public setAttribute(name: string, value: any): void {
    this.attributes.get(name).Value = value;
  }

  // /**
  //  * Get attribute.
  //  * @param  {string} name attribute name string.
  //  * @return {any}         attribute value.
  //  */
  // public getAttribute(name: string): any {
  //   return this._attributes.get(name);
  // }

  /**
   * Get mounted status.
   * @return {boolean} Whether this node is mounted or not.
   */
  public emitChangeAll(): void {
    Object.keys(this.attributes).forEach((k) => {
      let v = this.attributes[k];
      v.forEach((attr) => {
        if (typeof attr.Value !== "undefined") {
          // attr.notifyValueChanged();
        }
      });
    });
  }

  public updateValue(attrName?: string): void { // ? すべてはemitChangeAllなのに,一つの場合はupdateValue?
    if (typeof attrName === "undefined") {
      Object.keys(this.attributes).forEach((k) => {
        let v = this.attributes[k];
        v.forEach((attr) => {
          // attr.notifyValueChanged();
        });
      });
    } else {
      // const target = this.getAttribute(attrName);
      // target.notifyValueChanged();
    }
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
    if ((mounted && !this._mounted) || (!mounted && this._mounted)) {
      this._mounted = mounted;
      this.attributes.forEach((value) => {
        value.responsively = true;
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
    this._components.set(component.name, component);
  }
  public getComponents(): NamespacedDictionary<Component> {
    return this._components;
  }
}


export default GomlNode;
