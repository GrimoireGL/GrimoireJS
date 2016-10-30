import NSDictionary from "../Base/NSDictionary";
import IGomlInterface from "../Interface/IGomlInterface";
import Ensure from "../Base/Ensure";
import IAttributeDeclaration from "./IAttributeDeclaration";
import AttributeConverter from "./AttributeConverter";
import NSIdentity from "../Base/NSIdentity";
import GrimoireInterface from "../GrimoireInterface";
import Component from "./Component";

/**
 * Manage a attribute attached to components.
 */
class Attribute {

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
  public converter: AttributeConverter;

  /**
   * A component reference that this attribute is bound to.
   * @type {Component}
   */
  public component: Component;

  /**
   * Cache of attribute value.
   * @type {any}
   */
  private _value: any;

  /**
   * List of functions that is listening changing values.
   */
  private _observers: ((attr: Attribute) => void)[] = [];

  /**
   * Goml tree interface which contains the component this attribute bound to.
   * @return {IGomlInterface} [description]
   */
  public get tree(): IGomlInterface {
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
  public static generateAttributeForComponent(name: string, declaration: IAttributeDeclaration, component: Component): Attribute {
    const attr = new Attribute();
    attr.name = new NSIdentity(component.name.ns, name);
    attr.component = component;
    attr.declaration = declaration;
    const converterName = Ensure.ensureTobeNSIdentity(declaration.converter);
    attr.converter = GrimoireInterface.converters.get(converterName);
    if (attr.converter === void 0) {
      // When the specified converter was not found
      throw new Error(`Specified converter ${converterName.name} was not found from registered converters.\n Component: ${attr.component.name.fqn}\n Attribute: ${attr.name.name}`);
    }
    attr.converter = {
      convert: attr.converter.convert.bind(attr),
      name: attr.converter.name
    };
    attr.component.attributes.set(attr.name, attr);
    return attr;
  }

  /**
   * Add event handler to observe changing this attribute.
   * @param  {(attr: Attribute) => void} handler handler the handler you want to add.
   * @param {boolean = false} callFirst whether that handler should be called first time.
   */
  public addObserver(handler: (attr: Attribute) => void, callFirst = false): void {
    this._observers.push(handler);
    if (callFirst) {
      handler(this);
    }
  }

  /**
   * Remove event handler you added.
   * @param  {Attribute} handler [description]
   * @return {[type]}            [description]
   */
  public removeObserver(handler: (attr: Attribute) => void): void {
    let index = -1;
    for (let i = 0; i < this._observers.length; i++) {
      if (handler === this._observers[i]) {
        index = i;
        break;
      }
    }
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

    const attrDefaultValue = this.declaration.defaultValue;
    this.Value = attrDefaultValue;
  }

  private _notifyChange(): void {
    this._observers.forEach((handler) => {
      handler(this);
    });
  }
}


export default Attribute;
