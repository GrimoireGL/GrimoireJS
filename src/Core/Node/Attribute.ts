import EEObject from "../Base/EEObject";
import ConverterBase from "./AttributeConverter";
import NamespacedIdentity from "../Base/NamespacedIdentity";
import AttributeDeclaration from "./AttributeDeclaration";
import GrimoireInterface from "../GrimoireInterface";
import Component from "./Component";

/**
 * Management a single attribute with specified type. Converter will serve a value with object with any type instead of string.
 * When attribute is changed, emit a "change" event. When attribute is requested, emit a "get" event.
 * If responsive flag is not true, event will not be emitted.
 */
class Attribute extends EEObject {

  public name: NamespacedIdentity;
  public constant: boolean = false;
  public declaration: AttributeDeclaration;
  public converter: ConverterBase;
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
    super();
    this.name = declaration.name;
    this.declaration = declaration;
    this._value = declaration.defaultValue;
    const converter = GrimoireInterface.converters.get(declaration.converter);
    this.converter = converter ? converter : GrimoireInterface.converters.get("string");
    this.constant = !!declaration.constant;
  }



  /**
   * Get a value with string.
   * @return {string} value with string.
   */
  public get ValueStr(): string {
    return this._value == null ? "" : this.converter.toStringAttr(this._value);
  }

  /**
   * Set a value with any type.
   * @param {any} val Value with string or specified type.
   */
  public set Value(val: any) {
    if (this.constant && this._value !== undefined) {
      console.warn(`Attribute "${this.id}" is immutable.`);
      return;
    }
    if (typeof (val) === "string") {
      this._value = this.converter.toObjectAttr(val);
    } else {
      if (this.converter.validate(val)) {
        this._value = this.converter.toObjectAttr(val);
      } else {
        console.warn(`Type of attribute: ${this.name}(${val}) is not adapt to converter: ${this.converter.getTypeName() }`, val);
        return;
      }
    }
    if (this._responsively) {
      this._notifyChange();
    }
  }

  private _notifyChange(): void {
    // TODO:implement!!
  }
}


export default Attribute;
