import IDObject from "../Base/IDObject";
import IAttributeDeclaration from "../Interface/IAttributeDeclaration";
import ITreeInitializedInfo from "../Interface/ITreeInitializedInfo";
import Ensure from "../Tool/Ensure";
import { GomlInterface, Name, Nullable } from "../Tool/Types";
import Utility from "../Tool/Utility";
import Attribute from "./Attribute";
import ComponentDeclaration from "./ComponentDeclaration";
import GomlNode from "./GomlNode";
import Identity from "./Identity";
import IdentityMap from "./IdentityMap";
import IParametricObject from "../Interface/IParametricObject";
import Namespace from "./Namespace";
import ParametricObjectContext from "./ParametricObjectContext";

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
   * default attribute defined in GOML
   */
  public gomAttribute: { [key: string]: string } = {};

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
   * component declaration object.
   */
  public declaration: ComponentDeclaration;

  /**
   * Flag that this component is activated or not.
   * @type {boolean}
   */
  private _enabled = true;
  private _awaked = false;
  private _handlers: ((component: Component) => void)[] = [];
  private _additionalAttributesNames: Identity[] = [];
  private _initializedInfo: Nullable<ITreeInitializedInfo> = null;
  private _parametricContextMap: { [key: string]: ParametricObjectContext } = {};

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
  public setAttribute<T = any>(name: Name | IAttributeDeclaration<T>, value: any): void {
    const attr = this.getAttributeRaw(name);
    if (attr) {
      attr.Value = value;
    } else {
      throw new Error(`attribute ${name} is not defined in ${this.name.fqn}`);
    }
  }

  /**
   * get attribute value.
   * @param name
   */
  public getAttribute<T = any>(name: Name | IAttributeDeclaration<T>): T {
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
  public getAttributeRaw<T = any>(name: Name | IAttributeDeclaration<T>): Nullable<Attribute<T>> {
    if (Ensure.isName(name)) {
      return this.attributes.get(name);
    }
    for (const key in this.declaration.attributes) {
      if (this.declaration.attributes[key] === name) {
        return this.getAttributeRaw(key);
      }
    }
    return null;
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
  public resolveDefaultAttributes(): void {
    this.attributes.forEach(attr => {
      attr.resolveDefaultValue();
    });
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
    attr.resolveDefaultValue();
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
      this.node.removeAttribute(this.attributes.get(attrId)!);
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

  /**
   * 
   * @param obj Parametric object that is managed in this component
   * @param baseName namespace base of this parametric object. Used for determining fqn.
   */
  protected __attachParametricObject(obj: IParametricObject, baseName: string): ParametricObjectContext {
    const decls = obj.getAttributeDeclarations();
    if (obj.owner) {
      throw new Error(`Parametric object is not attachable for multiple component.`);
    }
    if (this._parametricContextMap[baseName]) {
      throw new Error(`Parametric object for ${baseName} is already registered`);
    }
    obj.owner = this;
    const ns = Namespace.define(baseName);
    const nsMap: { [key: string]: string | ParametricObjectContext } = {};
    for (let key in decls) {
      const decl = decls[key];
      if (this._isParametricObject(decl)) {
        const poc = this.__attachParametricObject(decl, `${baseName}.${key}`);
        nsMap[key] = poc;
      } else {
        const identity = ns.for(key);
        this.__addAttribute(identity.fqn, decl);
        nsMap[key] = identity.fqn;
      }
    }
    const poc = new ParametricObjectContext(obj, this, baseName, nsMap);
    this._parametricContextMap[baseName] = poc;
    obj.onAttachComponent(this, poc);
    return poc;
  }

  /**
   * Remove specified parametric object if exists
   * @param baseName parametric object base name
   */
  protected __detachParametricObject(baseName: string): void {
    const poc = this._parametricContextMap[baseName];
    if (!poc) {
      return;
    }
    for (let name in poc.nameToKey) {
      const key = poc.nameToKey[name];
      if (typeof key === "string") {
        this.__removeAttributes(key);
      } else {
        this.__detachParametricObject(poc.baseName);
      }
    }
    poc.target.onDetachComponent(this, poc);
  }

  private _isParametricObject(obj: any): obj is IParametricObject {
    return obj && typeof obj.getAttributeDeclarations === "function";
  }
}
