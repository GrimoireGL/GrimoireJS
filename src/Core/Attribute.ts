import Environment from "../Core/Environment";
import Identity from "../Core/Identity";
import IdentityMap from "../Core/IdentityMap";
import IAttributeDeclaration from "../Interface/IAttributeDeclaration";
import Ensure from "../Tool/Ensure";
import IdResolver from "../Tool/IdResolver";
import { GomlInterface, Name, Nullable, Undef } from "../Tool/Types";
import Utility from "../Tool/Utility";
import Component from "./Component";

export type Subscription = {
  unsubscribe(): void,
};

/**
 * Manage a attribute attached to components.
 */
export default class Attribute<T = any> {

  /**
   * convert value by provided converter.
   * @param converter
   * @param self
   * @param val
   * @deprecated
   */
  public static convert(converter: Name, self: Attribute, val: any): any {
    const cname = Ensure.tobeIdentity(converter);
    const conv = Environment.GrimoireInterface.converters.get(cname);
    if (!conv) {
      throw new Error(`converter ${cname.name} is not defined.`);
    }
    return conv.convert(val, self);
  }

  /**
   * Construct a new attribute with name of key and any value with specified type. If constant flag is true, This attribute will be immutable.
   * If converter is not served, string converter will be set as default.
   * @param {string}        key       Key of this attribute.
   * @param {any}           value     Value of this attribute.
   * @param {ConverterBase} converter Converter of this attribute.
   * @param {boolean}       constant  Whether this attribute is immutable or not. False as default.
   */
  public static generateAttributeForComponent<T>(name: string, declaration: IAttributeDeclaration<T>, component: Component): Attribute<T> {
    const identity = Identity.fromFQN(`${component.name.fqn}.${name}`);
    if (component.attributes.get(identity)) {
      throw new Error(`attribute ${identity} is already exists in component`);
    }
    const attr = new Attribute<T>();
    attr.name = identity;
    attr.component = component;
    attr.declaration = declaration;
    const converterName = Ensure.tobeCnverterIdentity(declaration.converter);
    const converter = Environment.GrimoireInterface.converters.get(converterName);
    if (!converter) {
      // When the specified converter was not found
      const cn = typeof converterName === "string" ? converterName : converterName.name;
      throw new Error(`Specified converter ${cn} was not found from registered converters.\n Component: ${attr.component.name.fqn}\n Attribute: ${attr.name.name}`);
    }
    if (converter.lazy) {
      attr._isLazy = true;
    }
    attr.converter = converter;
    attr.component.attributes.set(attr.name, attr);
    if (attr.converter.verify) {
      attr.converter.verify(attr);
    }
    return attr;
  }

  /**
   * The name of attribute.
   * @type {Identity}
   */
  public name: Identity;

  /**
   * The declaration of attribute used for defining this attribute.
   * @type {IAttributeDeclaration}
   */
  public declaration: IAttributeDeclaration;

  /**
   * A function to convert any values into ideal type.
   * @type {AttributeConverter}
   */
  public converter: IAttributeConverterDeclaration<T>;

  /**
   * A component reference that this attribute is bound to.
   * @type {Component}
   */
  public component: Component;

  /**
   * Internal use!
   */
  public convertContext: any = {};
  /**
   * Cache of attribute value.
   * @type {any}
   */
  private _value: any;

  private _lastValuete: Nullable<T>;

  private _isLazy = false;

  /**
   * List of functions that is listening changing values.
   */
  private _observers: ((newValue: T, oldValue: Undef<T>, attr: Attribute) => void)[] = [];
  private _ignoireActivenessObservers: ((newValue: T, oldValue: Undef<T>, attr: Attribute) => void)[] = [];

  /**
   * Goml tree interface which contains the component this attribute bound to.
   * @return {GomlInterface} [description]
   */
  public get tree(): Nullable<GomlInterface> {
    return this.component.tree;
  }

  /**
   * Companion map which is bounding to the component this attribute bound to.
   * @return {IdentityMap<any>} [description]
   */
  public get companion(): Nullable<IdentityMap<any>> {
    return this.component.companion;
  }

  /**
   * Get a value with specified type.
   * @return {any} value with specified type.
   */
  public get Value(): any {
    if (this._isLazy) {
      return (this._lastValuete as any)();
    }
    return this._lastValuete;
  }

  /**
   * Set a value with any type.
   * @param {any} val Value with string or specified type.
   */
  public set Value(val: any) {
    if (val === undefined) {
      const node = this.component.node;
      throw new Error(`attribute ${this.name.name} value is undefined in ${node ? node.name.name : "undefined"}`);
    }
    if (this._value === val) {
      return;
    }

    this._value = val;
    const old = this._lastValuete;
    const evaluated = this._valuate(val);
    if (evaluated instanceof Promise) {
      evaluated.then(v => {
        this._lastValuete = v;
        this._notifyChange(old, v);
      });
    } else {
      this._lastValuete = evaluated;
      this._notifyChange(old, evaluated);
    }
  }

  /**
   * Add event handler to observe changing this attribute.
   * @param  {(attr: Attribute) => void} handler handler the handler you want to add.
   * @param {boolean = false} callFirst whether that handler should be called first time.
   */
  public watch(watcher: (newValue: T, oldValue: Undef<T>, attr: Attribute) => void, immedateCalls = false, ignoireActiveness = false): Subscription {
    if (ignoireActiveness) {
      this._ignoireActivenessObservers.push(watcher);
    } else {
      this._observers.push(watcher);
    }
    if (immedateCalls) {
      watcher(this.Value, undefined, this);
    }

    return {
      unsubscribe: () => {
        this.unwatch(watcher);
      },
    };
  }

  /**
   * Remove event handler you added.
   * @param  {Attribute} handler [description]
   * @return {[type]}            [description]
   */
  public unwatch(target: (newValue: any, oldValue: any, attr: Attribute) => void): void {
    let index = this._observers.findIndex(f => f === target);
    if (index >= 0) {
      this._observers.splice(index, 1);
      return;
    }
    index = this._ignoireActivenessObservers.findIndex(f => f === target);
    if (index >= 0) {
      this._ignoireActivenessObservers.splice(index, 1);
      return;
    }
  }

  /**
   * Bind converted value to specified field.
   * When target object was not specified, field of owner component would be assigned.
   * @param {string} variableName [description]
   * @param {any} targetObject [description]
   */
  public bindTo(variableName: string, targetObject: any = this.component): void {
    Utility.assert(!!variableName, `${this.name}: variableName cannot be null when call Attribute.bindTo.`);
    Utility.assert(!!targetObject, `${this.name}: targetObject cannot be null when call Attribute.bindTo.`);
    if (targetObject[variableName]) {
      console.warn(`component field ${variableName} is already defined.`);
    }
    Object.defineProperty(targetObject, variableName, {
      get: () => this.Value,
      set: (val) => { this.Value = val; },
      enumerable: true,
      configurable: true,
    });
  }

  /**
   * Apply default value to attribute from DOM values.
   * @param {string }} domValues [description]
   */
  public resolveDefaultValue(): void {
    if (this._value !== undefined) {// value is already exist.
      return;
    }
    let domValues;
    if (!this.component.isDefaultComponent) {
      domValues = this.component.gomAttribute;
    } else {// node is exists because this is default component.
      domValues = this.component.node.gomAttribute;
    }

    // resolve by goml value
    const resolver = new IdResolver();
    resolver.add(this.name);
    let tagAttrKey;
    for (const key in domValues) {
      if (Ensure.checkFQNString(key)) {
        if (this.name.fqn === key.substring(1)) {
          this.Value = domValues[key];
          return;
        }
        continue;
      }
      const get = resolver.get(key);
      if (get.length > 0) {
        if (tagAttrKey === undefined) {
          tagAttrKey = key;
        } else {
          throw new Error(`tag attribute is ambiguous for ${this.name.fqn}. It has the following possibilities ${tagAttrKey} ${get[0]}`);
        }
      }
    }
    if (tagAttrKey !== undefined) {
      this.Value = domValues[tagAttrKey];
      return;
    }

    // resolve by node defaults.
    const nodeDefaultValue = this.component.node.declaration.defaultAttributesActual.hasMatchingValue(this.name);
    if (nodeDefaultValue !== undefined) {
      this.Value = nodeDefaultValue; // Node指定値で解決
      return;
    }

    // resolve by component defaults.
    this.Value = this.declaration.default;
  }

  private _valuate(raw: any): Nullable<T> {
    if (raw !== null) {
      const v = this.converter.convert(raw, this);
      if (v === undefined) {
        const errorMessage = `Converting attribute value failed.\n\n* input : ${raw}\n* Attribute(Attribute FQN) : ${this.name.name}(${this.name.fqn})\n* Component : ${this.component.name.name}(${this.component.name.fqn})\n* Node(Node FQN) : ${this.component.node.name.name}(${this.component.node.name.fqn})\n* Converter : ${this.declaration.converter}\n\n* Structure map:\n${this.component.node.toStructualString(`--------------Error was thrown from '${this.name.name}' of this node.`)}`;
        throw new Error(errorMessage);
      }
      if (this._isLazy && typeof v !== "function") {
        throw new Error("lazy converter returns value must be function");
      }
      return v;
    }
    return null;
  }

  private _notifyChange(old: any, newValue: any): void {
    if (!this.component.isActive) {
      if (this._ignoireActivenessObservers.length === 0) {
        return;
      }
      this._ignoireActivenessObservers.forEach((watcher) => {
        watcher(newValue, old, this);
      });
    } else {
      this._observers.forEach((watcher) => {
        watcher(newValue, old, this);
      });
      this._ignoireActivenessObservers.forEach((watcher) => {
        watcher(newValue, old, this);
      });
    }
  }
}
