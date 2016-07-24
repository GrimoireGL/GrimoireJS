import Component from "./Component";
import IDObject from "../Base/IDObject";
import NodeDeclaration from "./NodeDeclaration";
import NodeUtility from "./NodeUtility";
import Attribute from "./Attribute";
import NamespacedDictionary from "../Base/NamespacedDictionary";
import NamespacedIdentity from "../Base/NamespacedIdentity";

class GomlNode extends IDObject { // EEである必要がある
  public element: Element;
  public NodeDeclaration: NodeDeclaration;
  public children: GomlNode[] = [];
  public components: NamespacedDictionary<Component>;
  public attributes: NamespacedDictionary<Attribute>;

  private _parent: GomlNode;
  private _mounted: boolean = false;

  public get nodeName(): NamespacedIdentity {
    return this.NodeDeclaration.name;
  }

  public get parent(): GomlNode {
    return this._parent;
  }

  public get Mounted(): boolean {
    return this._mounted;
  }

  constructor(recipe: NodeDeclaration, element: Element, components: Component[], attributes: Attribute[]) {
    super();
    this.NodeDeclaration = recipe;
    this.element = element;

    this.components = new NamespacedDictionary<Component>();
    components.forEach((c) => {
      this.components.set(c.name, c);
    });

    this.attributes = new NamespacedDictionary<Attribute>();
    attributes.forEach((attr) => {
      this.attributes.set(attr.name, attr);
    });

  }


  public sendMessage(message: string, ...args: any[]): void {
    for (let component in this.components) {
      let method = component[message];
      if (typeof method === "function") {
        method(args);
      }
    }
  }
  public broadcastMessage(name: string, ...args: any[]): void {
    this.sendMessage(name, args);
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].broadcastMessage(name, args);
    }
  }

  /**
   * Add child.
   * @param {GomlNode} Target node to be inserted.
   * @param {number}   index Index of insert location in children. If this argument is null or undefined, target will be inserted in last. If this argument is negative number, target will be inserted in index from last.
   */
  public addChild(child: GomlNode, index?: number, elementSync = true): void {
    child._parent = this;
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
      const target = this.getAttribute(attrName);
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
}


export default GomlNode;
