import EEObject from "../Base/EEObject";
import ConverterBase from "./AttributeConverter";
import GomlConfigurator from "./GomlConfigurator";
import NamespacedIdentity from "../Base/NamespacedIdentity";

/**
 * Management a single attribute with specified type. Converter will serve a value with object with any type instead of string.
 * When attribute is changed, emit a "change" event. When attribute is requested, emit a "get" event.
 * If responsive flag is not true, event will not be emitted.
 */
class Attribute extends EEObject {
  /**
   * If this flag is not true, event will not be emitted.
   * Recommend you to make this property true by calling responsive method.
   * @type {boolean}
   */
  public responsive: boolean = false;
  public constant: boolean = false;
  private _value: any;
  private _converter: ConverterBase;
  private _namespaceIdentity: NamespacedIdentity;

  /**
   * Construct a new attribute with name of key and any value with specified type. If constant flag is true, This attribute will be immutable.
   * If converter is not served, string converter will be set as default.
   * @param {string}        key       Key of this attribute.
   * @param {any}           value     Value of this attribute.
   * @param {ConverterBase} converter Converter of this attribute.
   * @param {boolean}       constant  Whether this attribute is immutable or not. False as default.
   */
  constructor(name: NamespacedIdentity, value: any, converter: ConverterBase, constant: boolean) {
    super();
    this._namespaceIdentity = name;
    this._key = key;
    this._converter = converter ? converter : GomlConfigurator.Instance.getConverter("string");
    this.setValue(value);
    this.constant = !!constant;
  }

  /**
   * Emit a "change" event and obviously change responsive flag.
   * @param {boolean} flag Whether responsive or not.
   */
  public setResponsive(flag: boolean): void {
    this.responsive = flag;
    if (this.responsive) {
      // this.emit("change");
    }
  }

  /**
   * Get a key string of this attribute.
   * @return {string} key string.
   */
  public key(): string {
    return this._key;
  }

  /**
   * Get a value with specified type.
   * @return {any} value with specified type.
   */
  public value(): any {
    if (this.responsive) {
      this.emit("get");
    }
    return this._value;
  }

  /**
   * Get a value with string.
   * @return {string} value with string.
   */
  public valueStr(): string {
    if (this.responsive) {
      this.emit("get");
    }
    return this._value == null ? "" : this._converter.toStringAttr(this._value);
  }

  /**
   * Set a value with any type.
   * @param {any} val Value with string or specified type.
   */
  public setValue(val: any): void {
    if (this.constant && this._value !== undefined) {
      console.warn(`Attribute "${this.id}" is immutable.`);
      return;
    }
    if (typeof(val) === "string") {
      this._value = this._converter.toObjectAttr(val);
    } else {
      if (this._converter.validate(val)) {
        this._value = this._converter.toObjectAttr(val);
      } else {
        console.warn(`Type of attribute: ${this._key}(${val}) is not adapt to converter: ${this._converter.getTypeName()}`, val);
        return;
      }
    }
    if (this.responsive) {
      this.emit("change", this);
    }
  }
}

export default Attribute;
