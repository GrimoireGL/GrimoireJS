import ComponentBase from "./ComponentBase";
import AttributeContainer from "./AttributeContainer";
import IDObject from "../Base/IDObject";
import NodeRecipe from "./NodeRecipe";
import NodeUtility from "./NodeUtility";
import GomlAttribute from "./GomlAttribute";

class GomlNode extends IDObject { // EEである必要はないかも？
  public element: HTMLElement;
  public children: GomlNode[];
  public components: ComponentBase[];
  public attributes: { [key: string]: GomlAttribute[] }; // 同一名は配列で格納。名前空間で区別

  private _attributes: AttributeContainer;
  private _nodeName: string;
  private _parent: GomlNode;
  private _nodeRecipe: NodeRecipe;
  private _mounted: boolean = false; // mountされてるかはキャッシュしといたほうがいいかも？

  public get nodeName(): string {
    return this._nodeName;
  }

  public get parent(): GomlNode {
    return this._parent;
  }

  public get Mounted(): boolean {
    return this._mounted;
  }
  public get Recipe(): NodeRecipe {
    return this._nodeRecipe;
  }

  constructor(recipe: NodeRecipe, components: ComponentBase[], attributes: { [key: string]: GomlAttribute[] }) {
    super();
    this._nodeName = recipe.Name;
    this._nodeRecipe = recipe;
    this.components = components;
    this.attributes = attributes;
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
   * Connect element to node.
   * This method is expected to be called just once.
   * @param {HTMLElement} element [description]
   */
  public setElement(element: HTMLElement): void { // コンストラクタへ移動したい
    if (!this._attributes) {
      this._attributes = new AttributeContainer(element);
      this.element = element;
    } else {
      throw new Error("This method is expected to be called just once.");
    }
  }

  /**
   * Add child.
   * @param {GomlNode} Target node to be inserted.
   * @param {number}   index Index of insert location in children. If this argument is null or undefined, target will be inserted in last. If this argument is negative number, target will be inserted in index from last.
   */
  public addChild(child: GomlNode, index?: number): void {
    child._parent = this;
    if (index != null) {
      throw new Error("insert index should be number or null or undefined.");
    }
    const insertIndex = index == null ? this.children.length : index;
    this.children.splice(insertIndex, 0, child);
    if (this.mounted()) {
      child.setMounted(true);
    }
    // handling html
    let referenceElement: HTMLElement = null;
    if (index != null) {
      referenceElement = this.element[NodeUtility.getNodeListIndexByElementIndex(this.element, index)];
    }
    this.element.insertBefore(child.element, referenceElement);
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

  public forEachAttr(callbackfn: (value: GomlAttribute, key: string) => void): GomlNode {
    Object.keys(this.attributes).forEach((k) => {
      let v = this.attributes[k];
      v.forEach((attr) => { callbackfn(attr, k); });
    }, this);
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

  public getValueStr(attrName: string): string {
    const attr = this.getAttribute(attrName);
    if (attr === undefined) {
      throw new Error(`attribute "${attrName}" is not found.`);
    } else {
      return attr.ValueStr;
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

  public getAttribute(attrName: string): GomlAttribute {
    let reg = /^(\w+):(\w+)$/gm;
    let match = attrName.match(reg);
    const namespace = match.length === 3 ? this._getNamespace(match[1]) : undefined;
    const name = match.length === 3 ? match[2] : attrName;

    let attrList = this.attributes[name];
    if (!attrList) {
      throw new Error(`attribute "${attrName}" is not found.`);
    }
    if (attrList.length === 1) {
      return attrList[0];
    }
    const ret = attrList.find((attr) => attr.Namespace === namespace);
    if (!ret) {
      throw new Error(`attribute "${attrName}" is not found.`);
    }
    return ret;
  }

  /**
   * Set attribute
   * @param {string} name  attribute name string.
   * @param {any}    value attribute value.
   */
  public setAttribute(name: string, value: any): void {
    this._attributes.set(name, value);
  }

  /**
   * Get attribute.
   * @param  {string} name attribute name string.
   * @return {any}         attribute value.
   */
  public getAttribute(name: string): any {
    return this._attributes.get(name);
  }

  /**
   * Get attribute.
   * @param  {string} name attribute name string.
   * @return {string}      attribute value with string.
   */
  public getAttributeString(name: string): string {
    return this._attributes.getStr(name);
  }

  /**
   * Get mounted status.
   * @return {boolean} Whether this node is mounted or not.
   */
  public emitChangeAll(): void {
    Object.keys(this.attributes).forEach((k) => {
      let v = this.attributes[k];
      v.forEach((attr) => {
        if (typeof attr.Value !== "undefined") {
          attr.notifyValueChanged();
        }
      });
    });
  }

  public updateValue(attrName?: string): void { // ? すべてはemitChangeAllなのに,一つの場合はupdateValue?
    if (typeof attrName === "undefined") {
      Object.keys(this.attributes).forEach((k) => {
        let v = this.attributes[k];
        v.forEach((attr) => {
          attr.notifyValueChanged();
        });
      });
    } else {
      const target = this.getAttribute(attrName);
      target.notifyValueChanged();
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
      this._attributes.setResponsive(true);
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

  private _getNamespace(alias: string): string {
    // TODO: implement!!!
    return undefined;
  }
}


export default GomlNode;
