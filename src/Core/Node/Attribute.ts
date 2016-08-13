import AttributeConverter from "./AttributeConverter";
import NamespacedIdentity from "../Base/NamespacedIdentity";
import AttributeDeclaration from "./AttributeDeclaration";
import GrimoireInterface from "../GrimoireInterface";
import Component from "./Component";

/**
 * Management a single attribute with specified type. Converter will serve a value with object with any type instead of string.
 * When attribute is changed, emit a "change" event. When attribute is requested, emit a "get" event.
 * If responsive flag is not true, event will not be emitted.
 */
class Attribute {

  public name: NamespacedIdentity;
  public declaration: AttributeDeclaration;
  public converter: AttributeConverter;
  public component: Component;
  /**
   * If this flag is not true, notify value changed to DomElement.
   * @type {boolean}
   */
  public get responsively(): boolean {
    return this._responsively;
  }
  public set responsively(value: boolean) {
    this._responsively = value;
    if (this._responsively) {
      // this.emit("change");
      // TODO:notify changes to element
    }
  }
  private _value: any;
  private _responsively: boolean = false;
  private _handlers: ((attr: Attribute) => void)[] = [];

  /**
   * Get a value with specified type.
   * @return {any} value with specified type.
   */
  public get Value(): any {
    return this._value;
  }

  /**
   * Construct a new attribute with name of key and any value with specified type. If constant flag is true, This attribute will be immutable.
   * If converter is not served, string converter will be set as default.
   * @param {string}        key       Key of this attribute.
   * @param {any}           value     Value of this attribute.
   * @param {ConverterBase} converter Converter of this attribute.
   * @param {boolean}       constant  Whether this attribute is immutable or not. False as default.
   */
  constructor(declaration: AttributeDeclaration) {
    this.name = declaration.name;
    this.declaration = declaration;
    this._value = declaration.defaultValue;
    this.converter = GrimoireInterface.converters.get(declaration.converter);
    if (!this.converter) {
      throw new Error(`Attribute converter '${declaration.converter.fqn}' can not found`);
    }
  }

  /**
   * Set a value with any type.
   * @param {any} val Value with string or specified type.
   */
  public set Value(val: any) {
    try {
      this._value = this.converter.convert(val);
    } catch (e) {
      console.error(e); // TODO should be more convenient error handling
    }
    this._notifyChange();
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

  private _notifyChange(): void {
    for (let i = 0; i < this._handlers.length; i++) {
      this._handlers[i](this);
    }
  }

  private _applyToElement() {
    this.component.node.element.setAttribute(this.name.name, this.Value);
  }
}


export default Attribute;
