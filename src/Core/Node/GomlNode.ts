import ComponentBase from "./ComponentBase";
import AttributeContainer from "./AttributeContainer";
import IDObject from "../Base/IDObject";
import NodeUtility from "./NodeUtility";
import isNumber from "lodash.isnumber";

class GomlNode extends IDObject { // EEである必要はないかも？
  public element: HTMLElement;
  public children: GomlNode[];
  public components: ComponentBase[];

  private _attributes: AttributeContainer;
  private _nodeName: string;
  private _parent: GomlNode;
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


  constructor(name: string, components: ComponentBase[]) {
      super();
      this._nodeName = name;
      this.components = components;
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
    if (!isNumber(index) && index != null) {
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
        }
        // html handling
        this.element.removeChild(child.element);
        // console.log(this.element.outerHTML);
        // console.log(this.element.childNodes);
        // console.log(child.element.parentNode);
        break;
      }
    }
  }

  /**
   * Remove myself.
   */
  public remove(): void {
    if (this._parent) {
      this._parent.removeChild(this);
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
}


export default GomlNode;
