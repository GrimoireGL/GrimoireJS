import NSDictionary from "../Base/NSDictionary";
import IGomlInterface from "../Interface/IGomlInterface";
import Ensure from "../Base/Ensure";
import IAttributeDeclaration from "./IAttributeDeclaration";
import AttributeConverter from "./AttributeConverter";
import NSIdentity from "../Base/NSIdentity";
import GrimoireInterface from "../GrimoireInterface";
import Component from "./Component";

/**
 * Management a single attribute with specified type. Converter will serve a value with object with any type instead of string.
 * When attribute is changed, emit a "change" event. When attribute is requested, emit a "get" event.
 * If responsive flag is not true, event will not be emitted.
 */
class Attribute {

  public name: NSIdentity;
  public declaration: IAttributeDeclaration;
  public converter: AttributeConverter;
  public component: Component;


  private _value: any;
  private _handlers: ((attr: Attribute) => void)[] = [];

  public get tree(): IGomlInterface {
    return this.component.tree;
  }

  public get companion(): NSDictionary<any> {
    return this.component.companion;
  }

  /**
   * Get a value with specified type.
   * @return {any} value with specified type.
   */
  public get Value(): any {
    try {
      return (this.converter as any).convert(this._value);
    } catch (e) {
      console.error(e); // TODO should be more convenient error handling
    }
  }

  /**
   * Set a value with any type.
   * @param {any} val Value with string or specified type.
   */
  public set Value(val: any) {
    this._value = val;
    this._notifyChange();
  }

  /**
   * Construct a new attribute with name of key and any value with specified type. If constant flag is true, This attribute will be immutable.
   * If converter is not served, string converter will be set as default.
   * @param {string}        key       Key of this attribute.
   * @param {any}           value     Value of this attribute.
   * @param {ConverterBase} converter Converter of this attribute.
   * @param {boolean}       constant  Whether this attribute is immutable or not. False as default.
   */
  constructor(name: string, declaration: IAttributeDeclaration, component: Component) {
    this.name = new NSIdentity(component.name.ns, name);
    this.component = component;
    this.declaration = declaration;
    const converterName = Ensure.ensureTobeNSIdentity(declaration.converter);
    this.converter = GrimoireInterface.converters.get(converterName);
    this.converter = {
      convert: this.converter.convert.bind(this),
      name: this.converter.name
    };
    if (!this.converter) {
      throw new Error(`Attribute converter '${converterName.fqn}' can not found`);
    }
  }

  public addObserver(handler: (attr: Attribute) => void): void {
    this._handlers.push(handler);
  }

  public removeObserver(handler: (attr: Attribute) => void): void {
    let index = -1;
    for (let i = 0; i < this._handlers.length; i++) {
      if (handler === this._handlers[i]) {
        index = i;
        break;
      }
    }
    if (index < 0) {
      return;
    }
    this._handlers.splice(index, 1);
  }

  /**
   * Bind converted value to specified field.
   * When target object was not specified, field of owner component would be assigned.
   * @param {string} variableName [description]
   * @param {any} targetObject [description]
   */
  public boundTo(variableName: string, targetObject: any = this.component): void {
    this.addObserver((v) => {
      targetObject[variableName] = v.Value;
    });
    targetObject[variableName] = this.Value;
  }

  /**
   * Apply default value to attribute from DOM values.
   * @param {string }} domValues [description]
   */
  public resolveDefaultValue(domValues: { [key: string]: string }): void {
    let tagAttrValue = domValues[this.name.name];
    if (tagAttrValue !== void 0) {
      this.Value = tagAttrValue; // Dom指定値で解決
      return;
    }
    const nodeDefaultValue = this.component.node.nodeDeclaration.defaultAttributes.get(this.name);
    if (nodeDefaultValue !== void 0) {
      this.Value = nodeDefaultValue; // Node指定値で解決
      return;
    }

    const attrDefaultValue = this.declaration.defaultValue;
    this.Value = attrDefaultValue;
  }

  private _notifyChange(): void {
    this._handlers.forEach((handler) => {
      handler(this);
    });
  }
}


export default Attribute;
