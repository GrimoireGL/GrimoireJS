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
  public responsively: boolean = false; // sync value with DomElement.
  // TODO: stringじゃない属性はDomに反映できない


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
      return  this.converter.convert(this._value);
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
    if (this.responsively) {
      this.component.node.element.setAttribute(this.name.name, this.Value);
    }
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
    this.converter.convert = this.converter.convert.bind(this);
    if (typeof declaration.boundTo === "string") {
      this.addObserver((v) => {
        this.component[this.declaration.boundTo] = v.Value;
      });
    }
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

  private _notifyChange(): void {
    this._handlers.forEach((handler) => {
      handler(this);
    });
  }
}


export default Attribute;
