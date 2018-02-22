import { deprecate } from "util";
import IDObject from "../Base/IDObject";
import { IAttributeDeclaration, ILazyAttributeDeclaration, IStandardAttributeDeclaration } from "../Interface/IAttributeDeclaration";
import ITreeInitializedInfo from "../Interface/ITreeInitializedInfo";
import Ensure from "../Tool/Ensure";
import { GomlInterface, Name, Nullable } from "../Tool/Types";
import * as Utility from "../Tool/Utility";
import { Attribute, LazyAttribute, StandardAttribute } from "./Attribute";
import AttributeNamespace from "./AttributeNamespace";
import ComponentDeclaration from "./ComponentDeclaration";
import GomlNode from "./GomlNode";
import Identity from "./Identity";
import IdentityMap from "./IdentityMap";
import Namespace from "./Namespace";

/**
 * Base class for any components
 * component must be attach to node before any operation.
 */
export default class Component extends IDObject {
  /**
   * Name of this component
   * @type {Identity}
   */
  public identity!: Identity;
  /**
   * Attributes managed by this component
   * @type {IdentityMap<StandardAttribute>}
   */
  public attributes!: IdentityMap<Attribute>;
  /**
   * Node this component is attached
   * @type {GomlNode}
   */
  public node!: GomlNode;

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
  public declaration!: ComponentDeclaration;

  /**
   * called just before awake.
   */
  public hooks: { [message: string]: ((self: Component) => void)[] } = {};

  /**
   * Flag that this component is activated or not.
   * @type {boolean}
   */
  private _enabled = true;
  private _awaked = false;
  private _handlers: ((component: Component) => void)[] = [];
  private _additionalAttributesNames: Identity[] = [];
  private _initializedInfo: Nullable<ITreeInitializedInfo> = null;
  private _parametricContextMap: { [key: string]: AttributeNamespace } = {};

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
    const attr = this.getAttributeRaw(name as any);
    if (attr) {
      attr.Value = value;
    } else {
      throw new Error(`attribute ${name} is not defined in ${this.identity.fqn}`);
    }
  }

  /**
   * get attribute value.
   * @param name
   */
  public getAttribute<T = any>(name: Name | IAttributeDeclaration<T>): T {
    const attr = this.getAttributeRaw(name as any);
    if (attr) {
      return attr.Value;
    } else {
      throw new Error(`attribute ${name} is not defined in ${this.identity.fqn}`);
    }
  }

  /**
   * get attribute object instance.
   * @param name
   */
  public getAttributeRaw<T = any>(name: IStandardAttributeDeclaration<T>, mandatory?: true): StandardAttribute<T>;
  public getAttributeRaw<T = any>(name: IStandardAttributeDeclaration<T>, mandatory: false): Nullable<StandardAttribute<T>>;
  public getAttributeRaw<T = any>(name: ILazyAttributeDeclaration<T>, mandatory?: true): LazyAttribute<T>;
  public getAttributeRaw<T = any>(name: ILazyAttributeDeclaration<T>, mandatory: false): Nullable<LazyAttribute<T>>;
  public getAttributeRaw<T = any>(name: Name, mandatory?: true): StandardAttribute<T> | LazyAttribute<T>;
  public getAttributeRaw<T = any>(name: Name, mandatory: false): Nullable<StandardAttribute<T> | LazyAttribute<T>>;
  public getAttributeRaw<T = any>(name: Name | IAttributeDeclaration<T>, mandatory = true): Nullable<StandardAttribute<T> | LazyAttribute<T>> {
    if (Ensure.isName(name)) {
      const ret = this.attributes.get(name);
      if (mandatory && !ret) {
        throw new Error(`getAttributeRaw for attribute "${name}" with mandatory flag was called on ${this.identity.name}(${this.identity.fqn}) but specified attribute don't exist.`);
      }
      return ret;
    }
    for (const key in this.declaration.attributes) {
      if (this.declaration.attributes[key] === name) {
        return this.getAttributeRaw<T>(key, mandatory as any);
      }
    }
    if (mandatory) {
      throw new Error(`getAttributeRaw for attribute "${name}" with mandatory flag was called on ${this.identity.name}(${this.identity.fqn}) but specified attribute don't exist.`);
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
  public internalMount(): boolean {
    const awakeCalled = !this._awaked;
    if (!this._awaked) {
      this._awaked = true;
      this._resolveHooks("awake");
      const methodAwake = (this as any)["$$awake"];
      if (typeof methodAwake === "function") {
        methodAwake();
      }
    }
    const methodMount = (this as any)["$$mount"];
    if (typeof methodMount === "function") {
      methodMount();
    }
    return awakeCalled;
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
  protected __addAttribute(name: string, attribute: IStandardAttributeDeclaration): StandardAttribute;
  protected __addAttribute(name: string, attribute: ILazyAttributeDeclaration): LazyAttribute;
  protected __addAttribute(name: string, attribute: IAttributeDeclaration): Attribute {
    if (!attribute) {
      throw new Error("can not add attribute null or undefined.");
    }
    const attr = StandardAttribute.generateAttributeForComponent(name, attribute, this);
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

  /**
   * @deprecated
   */
  protected __bindAttributes(): void {
    Utility.w("Deprecated warning: Component#__bindAttributes() is deprecated. use @attribute decorator instead of.");
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
    this.companion.set(this.identity.ns.for(name), value);
  }

  protected __createParametricObject(baseName: string): AttributeNamespace {
    if (this._parametricContextMap[baseName]) {
      throw new Error(`AttributeNamespace for ${baseName} is already exists`);
    }

    const poc = new AttributeNamespace(this, baseName, this.__addAttribute);
    this._parametricContextMap[baseName] = poc;
    return poc;
  }

  /**
   * Call hooks before awaking
   */
  private _resolveHooks(hookMessage: string): void {
    Object.getPrototypeOf(this)._callHooks(this, hookMessage);
  }

  private _callHooks(instance: Component, hookMessage: string) {
    const parent = Object.getPrototypeOf(this);
    if (parent["_callHooks"]) {
      parent._callHooks(instance, hookMessage);
    }
    if (this.hooks) {
      const hooks = this.hooks[hookMessage];
      if (hooks) {
        for (let i = 0; i < hooks.length; i++) {
          hooks[i](instance);
        }
      }
    }
  }

}
