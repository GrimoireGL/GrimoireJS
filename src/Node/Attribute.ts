import IAttributeConverterDeclaration from "../Declaration/IAttributeConverterDeclaration";
import GomlInterface from "../Interface/GomlInterface";
import NSDictionary from "../Base/NSDictionary";
import IGomlInterface from "../Interface/IGomlInterface";
import Ensure from "../Base/Ensure";
import IAttributeDeclaration from "./IAttributeDeclaration";
import NSIdentity from "../Base/NSIdentity";
import GrimoireInterface from "../GrimoireInterface";
import Component from "./Component";

/**
 * Manage a attribute attached to components.
 */
export default class Attribute {

  /**
   * The name of attribute.
   * @type {NSIdentity}
   */
  public name: NSIdentity;

  /**
   * The declaration of attribute used for defining this attribute.
   * @type {IAttributeDeclaration}
   */
  public declaration: IAttributeDeclaration;

  /**
   * A function to convert any values into ideal type.
   * @type {AttributeConverter}
   */
  public converter: IAttributeConverterDeclaration;

  /**
   * A component reference that this attribute is bound to.
   * @type {Component}
   */
  public component: Component;

  public convertContext: any = {};
  /**
   * Cache of attribute value.
   * @type {any}
   */
  private _value: any;

  private _lastValuete: any;

  /**
   * List of functions that is listening changing values.
   */
  private _observers: ((newValue: any, oldValue: any, attr: Attribute) => void)[] = [];

  /**
   * Goml tree interface which contains the component this attribute bound to.
   * @return {IGomlInterface} [description]
   */
  public get tree(): IGomlInterface & GomlInterface {
    return this.component.tree;
  }

  /**
   * Companion map which is bounding to the component this attribute bound to.
   * @return {NSDictionary<any>} [description]
   */
  public get companion(): NSDictionary<any> {
    return this.component.companion;
  }

  /**
   * Get a value with specified type.
   * @return {any} value with specified type.
   */
  public get Value(): any {
    if (this._value === void 0) {
      throw new Error(`attribute ${this.name.name} value is undefined in ${this.component.node.name.name}`);
    }
    return this._valuate(this._value);
  }

  /**
   * Set a value with any type.
   * @param {any} val Value with string or specified type.
   */
  public set Value(val: any) {
    if (this._value === val) {
      return;
    }
    this._value = val;
    this._notifyChange(val);
  }


  public static convert(converter: string | NSIdentity, self: Attribute, val: any): any {
    const cname = Ensure.tobeNSIdentity(converter);
    const conv = GrimoireInterface.converters.get(cname);
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
  public static generateAttributeForComponent(name: string, declaration: IAttributeDeclaration, component: Component): Attribute {
    const attr = new Attribute();
    attr.name = NSIdentity.from(component.name.ns, name);
    attr.component = component;
    attr.declaration = declaration;
    const converterName = Ensure.tobeNSIdentity(declaration.converter);
    attr.converter = GrimoireInterface.converters.get(converterName);
    if (attr.converter === void 0) {
      // When the specified converter was not found
      throw new Error(`Specified converter ${converterName.name} was not found from registered converters.\n Component: ${attr.component.name.fqn}\n Attribute: ${attr.name.name}`);
    }
    attr.component.attributes.set(attr.name, attr);
    attr.converter.verify(attr);
    return attr;
  }

  /**
   * Add event handler to observe changing this attribute.
   * @param  {(attr: Attribute) => void} handler handler the handler you want to add.
   * @param {boolean = false} callFirst whether that handler should be called first time.
   */
  public watch(watcher: (newValue: any, oldValue: any, attr: Attribute) => void, immedateCalls = false): void {
    this._observers.push(watcher);
    if (immedateCalls) {
      watcher(this.Value, undefined, this);
    }
  }

  /**
   * Remove event handler you added.
   * @param  {Attribute} handler [description]
   * @return {[type]}            [description]
   */
  public unwatch(target: (newValue: any, oldValue: any, attr: Attribute) => void): void {
    const index = this._observers.findIndex(f => f === target);
    if (index < 0) {
      return;
    }
    this._observers.splice(index, 1);
  }

  /**
   * Bind converted value to specified field.
   * When target object was not specified, field of owner component would be assigned.
   * @param {string} variableName [description]
   * @param {any} targetObject [description]
   */
  public boundTo(variableName: string, targetObject: any = this.component): void {
    if (targetObject[variableName]) {
      console.warn(`component field ${variableName} is already defined.`);
    }
    if (this.converter["lazy"]) {
      Object.defineProperty(targetObject, variableName, {
        get: () => this.Value,
        set: (val) => { this.Value = val; },
        enumerable: true,
        configurable: true
      });
    } else {
      let backing;
      this.watch(v => {
        backing = v;
      }, true);
      Object.defineProperty(targetObject, variableName, {
        get: () => backing,
        set: (val) => { this.Value = val; },
        enumerable: true,
        configurable: true
      });
    }
  }

  /**
   * Apply default value to attribute from DOM values.
   * @param {string }} domValues [description]
   */
  public resolveDefaultValue(domValues: { [key: string]: string }): void {
    if (this._value !== void 0) {// value is already exist.
      return;
    }
    let tagAttrValue = domValues[this.name.name];
    if (tagAttrValue !== void 0) {
      this.Value = tagAttrValue; // Dom指定値で解決
      return;
    }
    const nodeDefaultValue = this.component.node.nodeDeclaration.defaultAttributesActual.get(this.name);
    if (nodeDefaultValue !== void 0) {
      this.Value = nodeDefaultValue; // Node指定値で解決
      return;
    }
    this.Value = this.declaration.default;
  }

  private _valuate(raw: any): any {
    const v = this.converter.convert(raw, this);
    if (v === void 0) {
      throw new Error(`attribute ${this.name.name} value can not be convert from ${this._value}`);
    }
    this._lastValuete = v;
    return v;
  }

  private _notifyChange(newValue: any): void {
    if (!this.component.isActive) {
      return;
    }
    const lastvalue = this._lastValuete;
    this._observers.forEach((handler) => {
      handler(this.converter.convert(newValue, this), lastvalue, this);
    });
  }
}
