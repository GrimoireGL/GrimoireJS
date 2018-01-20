import Environment from "../Core/Environment";
import Identity from "../Core/Identity";
import IdentityMap from "../Core/IdentityMap";
import { IConverterDeclaration, ILazyConverterDeclaration, IStandardConverterDeclaration } from "../Interface/IAttributeConverterDeclaration";
import { IAttributeDeclaration, ILazyAttributeDeclaration, IStandardAttributeDeclaration } from "../Interface/IAttributeDeclaration";
import Ensure from "../Tool/Ensure";
import IdResolver from "../Tool/IdResolver";
import { GomlInterface, Name, Nullable, Undef } from "../Tool/Types";
import Utility from "../Tool/Utility";
import Component from "./Component";

export type Subscription = {
  unsubscribe(): void,
};

/**
 * internal use!
 */
export class AttributeBase<T, V, D extends IAttributeDeclaration, C extends IConverterDeclaration<T>, A extends StandardAttribute<T> | LazyAttribute<T>> {
  /**
   * The name of attribute.
   * @type {Identity}
   */
  public name: Identity;

  /**
   * A component reference that this attribute is bound to.
   * @type {Component}
   */
  public component: Component;

  /**
   * The declaration of attribute used for defining this attribute.
   * @type {IAttributeDeclaration}
   */
  public declaration: D;

  /**
   * A function to convert any values into ideal type.
   * @type {AttributeConverter}
   */
  public converter: C;

  protected __observers: ((newValue: V, oldValue: Undef<V>, attr: A) => void)[] = [];
  protected __ignoireActivenessObservers: ((newValue: V, oldValue: Undef<V>, attr: A) => void)[] = [];

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

  protected __notifyChange(old: any, newValue: any, self: A): void {
    if (!this.component.isActive) {
      if (this.__ignoireActivenessObservers.length === 0) {
        return;
      }
      this.__ignoireActivenessObservers.forEach((watcher) => {
        watcher(newValue, old, self);
      });
    } else {
      this.__observers.forEach((watcher) => {
        watcher(newValue, old, self);
      });
      this.__ignoireActivenessObservers.forEach((watcher) => {
        watcher(newValue, old, self);
      });
    }
  }
}

/**
 * lazy attribute is lazy-evaluated attribute.
 */
export class LazyAttribute<T = any> extends AttributeBase<T, () => Nullable<T>, ILazyAttributeDeclaration, ILazyConverterDeclaration<T>, LazyAttribute<T>> {

  /**
   * Cache of attribute value.
   * @type {any}
   */
  private _value: any;

  private _lastValuete: () => Nullable<T>;

  /**
   * Get a value with specified type.
   * @return {any} value with specified type.
   */
  public get Value(): T {
    if (this._lastValuete === undefined) {
      const node = this.component.node;
      throw new Error(`attribute ${this.name.name} value is undefined in ${node ? node.name.name : "undefined"}`);
    }
    return (this._lastValuete as any)();
  }

  /**
   * Set a value with specified type.
   * @param {any} val Value with string or specified type.
   */
  public set Value(val: T) {
    this.setValue(val);
  }

  /**
   * Set a value with any type.
   * @param val
   */
  public setValue(val: any) {
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
        this.__notifyChange(old, v, this);
      });
    } else {
      this._lastValuete = evaluated;
      this.__notifyChange(old, evaluated, this);
    }

  }

  /**
   * Add event handler to observe changing this attribute.
   * @param  {(attr: StandardAttribute) => void} handler handler the handler you want to add.
   * @param {boolean = false} callFirst whether that handler should be called first time.
   */
  public watch(watcher: (newValue: () => Nullable<T>, oldValue: Undef<() => Nullable<T>>, attr: LazyAttribute) => void, immedateCalls = false, ignoireActiveness = false): Subscription {
    if (ignoireActiveness) {
      this.__ignoireActivenessObservers.push(watcher);
    } else {
      this.__observers.push(watcher);
    }
    if (immedateCalls) {
      watcher(this._lastValuete, undefined, this);
    }

    return {
      unsubscribe: () => {
        this.unwatch(watcher);
      },
    };
  }

  /**
   * Remove event handler you added.
   * @param  {StandardAttribute} handler [description]
   * @return {[type]}            [description]
   */
  public unwatch(target: (newValue: () => Nullable<T>, oldValue: Undef<() => Nullable<T>>, attr: LazyAttribute) => void): void {
    let index = this.__observers.findIndex(f => f === target);
    if (index >= 0) {
      this.__observers.splice(index, 1);
      return;
    }
    index = this.__ignoireActivenessObservers.findIndex(f => f === target);
    if (index >= 0) {
      this.__ignoireActivenessObservers.splice(index, 1);
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
          this.setValue(domValues[key]);
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
      this.setValue(domValues[tagAttrKey]);
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

  private _valuate(raw: any): () => Nullable<T> {
    if (raw === null) {
      return () => null;
    }
    const v = this.converter.convert(raw, this);
    Utility.assert(v !== undefined, () => `Converting attribute value failed.\n\n* input : ${raw}\n* Attribute(Attribute FQN) : ${this.name.name}(${this.name.fqn})\n* Component : ${this.component.name.name}(${this.component.name.fqn})\n* Node(Node FQN) : ${this.component.node.name.name}(${this.component.node.name.fqn})\n* Converter : ${this.declaration.converter}\n\n* Structure map:\n${this.component.node.toStructualString(`--------------Error was thrown from '${this.name.name}' of this node.`)}`);
    if (typeof v !== "function") {
      throw new Error("lazy converter returns value must be function");
    }
    return v;
  }

}

/**
 * Manage a attribute attached to components.
 */
export class StandardAttribute<T = any> extends AttributeBase<T, T, IStandardAttributeDeclaration, IStandardConverterDeclaration<T>, StandardAttribute<T>> {

  /**
   * convert value by provided converter.
   * @param converter
   * @param self
   * @param val
   * @deprecated
   */
  public static convert(converter: Name, self: StandardAttribute, val: any): any;
  public static convert(converter: Name, self: LazyAttribute, val: any): any;
  public static convert(converter: Name, self: Attribute, val: any): any {
    const cname = Ensure.tobeIdentity(converter);
    const conv = Environment.GrimoireInterface.converters.get(cname);
    if (!conv) {
      throw new Error(`converter ${cname.name} is not defined.`);
    }
    return (conv.convert as any)(val, self);
  }

  /**
   * Construct a new attribute with name of key and any value with specified type. If constant flag is true, This attribute will be immutable.
   * If converter is not served, string converter will be set as default.
   * @param {string}        key       Key of this attribute.
   * @param {any}           value     Value of this attribute.
   * @param {ConverterBase} converter Converter of this attribute.
   * @param {boolean}       constant  Whether this attribute is immutable or not. False as default.
   */
  public static generateAttributeForComponent<T>(name: string, declaration: IAttributeDeclaration<T>, component: Component): StandardAttribute<T> | LazyAttribute<T> {
    const identity = Identity.fromFQN(`${component.name.fqn}.${name}`);
    if (component.attributes.get(identity)) {
      throw new Error(`attribute ${identity} is already exists in component`);
    }
    const converterName = Ensure.tobeCnverterName(declaration.converter);
    const converter = Environment.GrimoireInterface.converters.get(converterName);
    if (!converter) {
      // When the specified converter was not found
      const cn = typeof converterName === "string" ? converterName : converterName.name;
      throw new Error(`Specified converter ${cn} was not found from registered converters.\n Component: ${component.name.fqn}\n Attribute: ${identity.name}`);
    }
    if (converter.lazy) {
      const attr = new LazyAttribute<T>();
      attr.name = identity;
      attr.component = component;
      attr.declaration = declaration as ILazyAttributeDeclaration<T>;
      attr.converter = converter;
      attr.component.attributes.set(attr.name, attr);
      if (attr.converter.verify) {
        attr.converter.verify(attr);
      }
      return attr;
    } else {
      const attr = new StandardAttribute<T>();
      attr.name = identity;
      attr.component = component;
      attr.declaration = declaration as IStandardAttributeDeclaration<T>;
      attr.converter = converter as IStandardConverterDeclaration<T>;
      attr.component.attributes.set(attr.name, attr);
      if (attr.converter.verify) {
        attr.converter.verify(attr);
      }
      return attr;
    }

  }

  /**
   * Cache of set attribute value.
   * @type {any}
   */
  private _value: any;

  private _lastValuete: null | T;

  /**
   * Get a value with specified type.
   * @return {any} value with specified type.
   */
  public get Value(): Nullable<T> {
    if (this._lastValuete === undefined) {
      const node = this.component.node;
      throw new Error(`attribute ${this.name.name} value is undefined in ${node ? node.name.name : "undefined"}`);
    }
    return this._lastValuete;
  }

  /**
   * Set value with strict type.
   */
  public set Value(val: Nullable<T>) {
    this.setValue(val);
  }

  /**
   * Set a value with any type.
   * @param {any} val Value with string or specified type.
   */
  public setValue(val: any) {
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
        this.__notifyChange(old, v, this);
      });
    } else {
      this._lastValuete = evaluated;
      this.__notifyChange(old, evaluated, this);
    }
  }

  /**
   * Add event handler to observe changing this attribute.
   * @param  {(attr: StandardAttribute) => void} handler handler the handler you want to add.
   * @param {boolean = false} callFirst whether that handler should be called first time.
   */
  public watch(watcher: (newValue: T | null, oldValue: Undef<T>, attr: StandardAttribute) => void, immedateCalls = false, ignoireActiveness = false): Subscription {
    if (ignoireActiveness) {
      this.__ignoireActivenessObservers.push(watcher);
    } else {
      this.__observers.push(watcher);
    }
    if (immedateCalls) {
      watcher(this._lastValuete, undefined, this);
    }

    return {
      unsubscribe: () => {
        this.unwatch(watcher);
      },
    };
  }

  /**
   * Remove event handler you added.
   * @param  {StandardAttribute} handler [description]
   * @return {[type]}            [description]
   */
  public unwatch(target: (newValue: any, oldValue: any, attr: StandardAttribute) => void): void {
    let index = this.__observers.findIndex(f => f === target);
    if (index >= 0) {
      this.__observers.splice(index, 1);
      return;
    }
    index = this.__ignoireActivenessObservers.findIndex(f => f === target);
    if (index >= 0) {
      this.__ignoireActivenessObservers.splice(index, 1);
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
          this.setValue(domValues[key]);
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
      this.setValue(domValues[tagAttrKey]);
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

  private _valuate(raw: any): null | T {
    if (raw === null) {
      return null;
    }
    const v = this.converter.convert(raw, this);
    if (v === undefined) {
      const errorMessage = `Converting attribute value failed.\n\n* input : ${raw}\n* Attribute(Attribute FQN) : ${this.name.name}(${this.name.fqn})\n* Component : ${this.component.name.name}(${this.component.name.fqn})\n* Node(Node FQN) : ${this.component.node.name.name}(${this.component.node.name.fqn})\n* Converter : ${this.declaration.converter}\n\n* Structure map:\n${this.component.node.toStructualString(`--------------Error was thrown from '${this.name.name}' of this node.`)}`;
      throw new Error(errorMessage);
    }
    return v;
  }
}

export type Attribute<T= any> = StandardAttribute<T> | LazyAttribute<T>;
