import NodeUtility from "./NodeUtility";
import IAttributeDeclaration from "./IAttributeDeclaration";
import IGomlInterface from "../Interface/IGomlInterface";
import Attribute from "./Attribute";
import GomlNode from "./GomlNode";
import NSDictionary from "../Base/NSDictionary";
import NSIdentity from "../Base/NSIdentity";
import IDObject from "../Base/IDObject";
/**
 * Base class for any components
 */
class Component extends IDObject {
  /**
   * Name of this component
   * @type {NSIdentity}
   */
  public name: NSIdentity;
  /**
   * Attributes managed by this component
   * @type {NSDictionary<Attribute>}
   */
  public attributes: NSDictionary<Attribute>;
  /**
   * Node this component is attached
   * @type {GomlNode}
   */
  public node: GomlNode;
  /**
   * XMLElement of this component
   * @type {Element}
   */
  public element: Element;

  /**
   * Whether this component was created by nodeDeclaration
   * @type {boolean}
   */
  public isDefaultComponent: boolean = false;
  /**
   * Flag that this component is activated or not.
   * @type {boolean}
   */
  private _enabled: boolean = true;
  private _handlers: ((component: Component) => void)[] = [];
  private _additionalAttributesNames: NSIdentity[] = [];

  public get enabled(): boolean {
    return this._enabled;
  }
  public set enabled(val) {
    if (this._enabled === val) {
      return;
    }
    this._enabled = val;
    this._handlers.forEach((handler) => {
      handler(this);
    });
  }
  /**
   * The dictionary which is shared in entire tree.
   * @return {NSDictionary<any>} [description]
   */
  public get companion(): NSDictionary<any> {
    return this.node ? this.node.companion : null;
  }
  /**
   * Tree interface for the tree this node is attached.
   * @return {IGomlInterface} [description]
   */
  public get tree(): IGomlInterface {
    return this.node ? this.node.tree : null;
  }

  /**
   * Obtain value of attribute. When the attribute is not existing, this method would return undefined.
   * @param  {string} name [description]
   * @return {any}         [description]
   */
  public getValue(name: string): any {
    const attr = this.attributes.get(name);
    if (attr) {
      return attr.Value;
    } else {
      return undefined;
    }
  }
  /**
   * Set value of attribute
   * @param {string} name  [description]
   * @param {any}    value [description]
   */
  public setValue(name: string, value: any): void {
    const attr = this.attributes.get(name); // TODO:check readonly?
    if (attr) {
      attr.Value = value;
    }
  }

  public getAttribute(name: string): Attribute {
    return this.attributes.get(name);
  }

  public addEnabledObserver(observer: (component: Component) => void): void {
    this._handlers.push(observer);
  }

  public removeEnabledObserver(observer: (component: Component) => void): void {
    let index = -1;
    for (let i = 0; i < this._handlers.length; i++) {
      if (observer === this._handlers[i]) {
        index = i;
        break;
      }
    }
    if (index < 0) {
      return;
    }
    this._handlers.splice(index, 1);
  }

  public resolveDefaultAttributes(nodeAttributes: { [key: string]: string; }): any {
    if (this.isDefaultComponent) { // If this is default component, the default attribute values should be retrived from node DOM.
      this.attributes.forEach((attr) => attr.resolveDefaultValue(nodeAttributes));
    } else { // If not,the default value of attributes should be retrived from this element.
      const attrs = NodeUtility.getAttributes(this.element);
      this.attributes.forEach((attr) => attr.resolveDefaultValue(attrs));
    }
  }

  /**
   * Add attribute
   * @param {string}                name      [description]
   * @param {IAttributeDeclaration} attribute [description]
   */
  protected __addAtribute(name: string, attribute: IAttributeDeclaration): void {
    if (!attribute) {
      throw new Error("can not add attribute null or undefined.");
    }
    const attr = Attribute.generateAttributeForComponent(name, attribute, this);
    if (this.isDefaultComponent) {
      this.node.addAttribute(attr);
    }
    if (this.isDefaultComponent) { // If this is default component, the default attribute values should be retrived from node DOM.
      attr.resolveDefaultValue(NodeUtility.getAttributes(this.node.element));
    } else { // If not,the default value of attributes should be retrived from this element.
      const attrs = NodeUtility.getAttributes(this.element);
      attr.resolveDefaultValue(attrs);
    }
    this._additionalAttributesNames.push(attr.name);
  }
  protected __removeAttributes(name?: string): void {
    if (name) {
      const index = this._additionalAttributesNames.findIndex(id => id.name === name);
      if (index < 0) {
        throw new Error("can not remove attributes :" + name);
      }
      const attrId = this._additionalAttributesNames[index];
      if (this.isDefaultComponent) {
        this.node.removeAttribute(this.attributes.get(attrId));
      }
      this.attributes.delete(attrId);
      this._additionalAttributesNames.splice(index, 1);
    } else {
      this._additionalAttributesNames.forEach(id => {
        this.__removeAttributes(id.name);
      });
    }
  }
}

export default Component;
