import IDObject from "../Base/IDObject";
import IAttributeDeclaration from "../Interface/IAttributeDeclaration";
import ITreeInitializedInfo from "../Interface/ITreeInitializedInfo";
import Ensure from "../Tools/Ensure";
import { GomlInterface, Name, Nullable } from "../Tools/Types";
import Utility from "../Tools/Utility";
import Attribute from "./Attribute";
import Constants from "./Constants";
import GomlNode from "./GomlNode";
import Identity from "./Identity";
import IdentityMap from "./IdentityMap";

/**
 * Base class for any components
 * component must be attach to node before any operation.
 */
export default class Component extends IDObject {
  /**
   * Name of this component
   * @type {Identity}
   */
  public name: Identity;
  /**
   * Attributes managed by this component
   * @type {IdentityMap<Attribute>}
   */
  public attributes: IdentityMap<Attribute>;
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

  /**
   * this component has already disposed.
   */
  public disposed = false;

  /**
   * Flag that this component is activated or not.
   * @type {boolean}
   */
  private _enabled = true;
  private _awaked = false;
  private _handlers: ((component: Component) => void)[] = [];
  private _additionalAttributesNames: Identity[] = [];
  private _initializedInfo: Nullable<ITreeInitializedInfo> = null;

  /**
   * whether component enabled.
   * if this component disable, all message is not sended to this component.
   */
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
   * @return {IdentityMap<any>} [description]
   */
  public get companion(): IdentityMap<any> {
    return this.node.companion;
  }
  /**
   * Tree interface for the tree this node is attached.
   * @return {GomlInterface} [description]
   */
  public get tree(): GomlInterface {
    return this.node.tree;
  }

  /**
   * whether component is active.
   * component is active only when it is enabled and the node is active.
   */
  public get isActive(): boolean {
    return this.enabled && !!this.node && this.node.isActive;
  }

  /**
   * Set value of attribute
   * @param {string} name  [description]
   * @param {any}    value [description]
   */
  public setAttribute(name: Name, value: any): void {
    if (typeof name === "string" && Ensure.checkFQNString(name)) {
      name = `${this.name.fqn}.${name}`; // TODO: test
    }
    const attr = this.attributes.get(name);
    if (attr) {
      attr.Value = value;
    }
  }

  /**
   * get attribute value.
   * @param name
   */
  public getAttribute<T = any>(name: Name): T {
    if (typeof name === "string" && Ensure.checkFQNString(name)) {
      name = `${this.name.fqn}.${name}`; // TODO: test
    }
    const attr = this.getAttributeRaw(name);
    if (attr) {
      return attr.Value;
    } else {
      throw new Error(`attribute ${name} is not defined in ${this.name.fqn}`);
    }
  }

  /**
   * get attribute object instance.
   * @param name
   */
  public getAttributeRaw(name: Name): Attribute {
    if (typeof name === "string" && Ensure.checkFQNString(name)) {
      name = `${this.name.fqn}.${name}`; // TODO: test
    }
    return this.attributes.get(name);
  }

  /**
   * add enabled observer.
   * @param observer
   */
  public addEnabledObserver(observer: (component: Component) => void): void {
    this._handlers.push(observer);
  }

  /**
   * remove enabled observer.
   * @param observer
   */
  public removeEnabledObserver(observer: (component: Component) => void): boolean {
    return Utility.remove(this._handlers, observer);
  }

  /**
   * Interal use!
   * @param nodeAttributes
   */
  public resolveDefaultAttributes(nodeAttributes?: { [key: string]: string; } | null): any {
    const nodeAttr = nodeAttributes || {};
    if (this.isDefaultComponent) { // If this is default component, the default attribute values should be retrived from node DOM.
      this.attributes.forEach(attr => {
        attr.resolveDefaultValue(nodeAttr);
      });
    } else { // If not,the default value of attributes should be retrived from this element.
      const attrs = Utility.getAttributes(this.element);
      for (const key in attrs) {
        if (key === Constants.x_gr_id) {
          continue;
        }
      }
      this.attributes.forEach(attr => {
        attr.resolveDefaultValue(attrs);
      });
    }
  }

  /**
   * Interal use!
   */
  public dispose(): void {
    this.node.removeComponent(this);
  }

  /**
   * Interal use!
   */
  public awake(): boolean {
    if (this._awaked) {
      return false;
    }
    this._awaked = true;
    const method = (this as any)["$$awake"];
    if (typeof method === "function") {
      method();
    }
    return true;
  }

  /**
   * Internal use!
   * @param info
   */
  public initialized(info: ITreeInitializedInfo): void {
    if (this._initializedInfo === info) {
      return;
    }
    this._initializedInfo = info;
    const method = (this as any)["$$initialized"];
    if (typeof method === "function") {
      method(info);
    }
  }

  /**
   * Add additional attribute to this component.
   * @param {string}                name      [description]
   * @param {IAttributeDeclaration} attribute [description]
   */
  protected __addAttribute(name: string, attribute: IAttributeDeclaration): Attribute {
    if (!attribute) {
      throw new Error("can not add attribute null or undefined.");
    }
    const attr = Attribute.generateAttributeForComponent(name, attribute, this);
    this.node.addAttribute(attr);
    if (this.isDefaultComponent) { // If this is default component, the default attribute values should be retrived from node DOM.
      attr.resolveDefaultValue(Utility.getAttributes(this.node.element));
    } else { // If not,the default value of attributes should be retrived from this element.
      const attrs = Utility.getAttributes(this.element);
      attr.resolveDefaultValue(attrs);
    }
    this._additionalAttributesNames.push(attr.name);
    return attr;
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
      attr.bindTo(name);
    });
  }

  /**
   * set object to companion with identity that has same namespace as this component, and provided name.
   * @param name
   * @param value
   */
  protected __setCompanionWithSelfNS(name: string, value: any) {
    this.companion.set(this.name.ns.for(name), value);
  }
}
