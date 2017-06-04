import ITreeInitializedInfo from "./ITreeInitializedInfo";
import Utility from "../Base/Utility";
import Constants from "../Base/Constants";
import NodeUtility from "./NodeUtility";
import IAttributeDeclaration from "./IAttributeDeclaration";
import Attribute from "./Attribute";
import GomlNode from "./GomlNode";
import NSDictionary from "../Base/NSDictionary";
import NSIdentity from "../Base/NSIdentity";
import IDObject from "../Base/IDObject";
import {GomlInterface, Nullable} from "../Base/Types";

/**
 * Base class for any components
 * component must be attach to node before any operation.
 */
export default class Component extends IDObject {
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
  public isDefaultComponent = false;

  public disposed = false;

  /**
   * Flag that this component is activated or not.
   * @type {boolean}
   */
  private _enabled = true;
  private _awaked = false;
  private _handlers: ((component: Component) => void)[] = [];
  private _additionalAttributesNames: NSIdentity[] = [];
  private _initializedInfo: Nullable<ITreeInitializedInfo> = null;

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
    return this.node.companion;
  }
  /**
   * Tree interface for the tree this node is attached.
   * @return {GomlInterface} [description]
   */
  public get tree(): GomlInterface {
    return this.node.tree;
  }
  public get isActive(): boolean {
    return this.enabled && !!this.node && this.node.isActive;
  }

  /**
   * Set value of attribute
   * @param {string} name  [description]
   * @param {any}    value [description]
   */
  public setAttribute(name: string, value: any): void {
    const attr = this.attributes.get(name); // TODO:check readonly?
    if (attr) {
      attr.Value = value;
    }
  }

  public getAttribute(name: string): any {
    const attr = this.getAttributeRaw(name);
    if (attr) {
      return attr.Value;
    } else {
      throw new Error(`attribute ${name} is not defined in ${this.name.fqn}`);
    }
  }
  public getAttributeRaw(name: string): Attribute {
    return this.attributes.get(name);
  }

  public addEnabledObserver(observer: (component: Component) => void): void {
    this._handlers.push(observer);
  }

  public removeEnabledObserver(observer: (component: Component) => void): boolean {
    return Utility.remove(this._handlers, observer);
  }

  public resolveDefaultAttributes(nodeAttributes?: { [key: string]: string; } |null): any {
    const nodeAttr = nodeAttributes || {};
    if (this.isDefaultComponent) { // If this is default component, the default attribute values should be retrived from node DOM.
      this.attributes.forEach(attr => attr.resolveDefaultValue(nodeAttr));
    } else { // If not,the default value of attributes should be retrived from this element.
      const attrs = NodeUtility.getAttributes(this.element);
      for (let key in attrs) {
        if (key === Constants.x_gr_id) {
          continue;
        }
      }
      this.attributes.forEach(attr => attr.resolveDefaultValue(attrs));
    }
  }

  public dispose(): void {
    this.node.removeComponent(this);
  }

  public awake(): boolean {
    if (this._awaked) {
      return false;
    }
    this._awaked = true;
    let method = (<any>this)["$$awake"];
    if (typeof method === "function") {
      method();
    }
    return true;
  }

  public initialized(info: ITreeInitializedInfo): void {
    if (this._initializedInfo === info) {
      return;
    }
    this._initializedInfo = info;
    let method = (<any>this)["$$initialized"];
    if (typeof method === "function") {
      method(info);
    }
  }

  /**
   * Add additional attribute to this component.
   * @param {string}                name      [description]
   * @param {IAttributeDeclaration} attribute [description]
   */
  protected __addAtribute(name: string, attribute: IAttributeDeclaration): void {
    if (!attribute) {
      throw new Error("can not add attribute null or undefined.");
    }
    const attr = Attribute.generateAttributeForComponent(name, attribute, this);
    this.node.addAttribute(attr);
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
      this.node.removeAttribute(this.attributes.get(attrId));
      this.attributes.delete(attrId);
      this._additionalAttributesNames.splice(index, 1);
    } else {
      const arr = this._additionalAttributesNames.concat();
      arr.forEach(id => {
        this.__removeAttributes(id.name);
      });
    }
  }
  protected __bindAttributes(): void {
    this.attributes.forEach(attr => {
      const name = attr.name.name;
      attr.boundTo(name);
    });
  }
}
