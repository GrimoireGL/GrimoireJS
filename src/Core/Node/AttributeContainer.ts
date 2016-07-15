import AttributeDeclaration from "./AttributeDeclaration";
import Attribute from "./Attribute";
import ConverterList from "./Converters/ConverterList";

/**
 * Handling attributes definition and syncing value with HTMLElement or CoreObject.
 */
class AttributesContainer {
  private _members: { [key: string]: Attribute } = {};
  private _element: HTMLElement;

  /**
   * The attributes in waiting for syncing with element.
   * These attributes will be synced when they are required.
   * @type {string[]}
   */
  private _standbyAttr: string[] = [];

  /**
   * Construct attributes with defined attributes in HTMLElement in node.
   * This class is expected to instanciate after element is connected to node.
   * @param {HTMLElement} element [description]
   */
  constructor(element: HTMLElement) {
    this._element = element;
    if (!element) {
      throw new Error("Element must be defined.");
    }
    for (let i = 0; i <= this._element.attributes.length - 1; i++) {
      let attr = this._element.attributes[i];
      let key = attr.nodeName;
      let value = attr.nodeValue;
      this._setOrCreateNewAttribute(key, value);
    }
  }

  /**
   * Set responsive flag to all attributes object.
   * @param {boolean} flag Whether responsive or not.
   */
  public setResponsive(flag: boolean): void {
    Object.keys(this._members).forEach((key) => {
      this._members[key].setResponsive(flag);
    });
  }

  /**
   * Sync not synced attributes with element's attributes.
   */
  public syncWithElement(): void {
    Object.keys(this._members).forEach((key) => {
      const attr = this._members[key];
      this._element.setAttribute(key, attr.ValueStr);
    });
  }

  /**
   * Set attribute with key and value. If not defined, create a new one.
   * "change" event will be emitted if target attribute is exist.
   * When attribute's key is "id" or "class", sync to the original element.
   * @param {string} key   Key string.
   * @param {any}    value Value with any type.
   */
  public set(key: string, value: any): void {
    const attr = this._setOrCreateNewAttribute(key, value);
    this._immediateSyncOrStandby(key, attr);
  }

  /**
   * Get attribute with specified type.
   * @param  {string} key Key string.
   * @return {any}        Value with specified type.
   */
  public get(key: string): any {
    const attr = this._members[key];
    if (attr) {
      return attr.Value; // emit get
    }
  }

  /**
   * Get attribute with string.
   * @param  {string} key Key string.
   * @return {string}     Value with specified type.
   */
  public getStr(key: string): string {
    const attr = this._members[key];
    if (attr) {
      return attr.ValueStr; // emit get
    }
  }

  /**
   * Define attribute.
   * If target attribute name has already exist, override constant, onchange, onget, converter. The value will be retained by being converted its type with new converter.
   * "change" event will be emitted with converted value if target attribute is exist.
   * @param {string}               key  Key string.
   * @param {AttributeDeclaration} decl Plain object formed with specific attribute declaration.
   */
  public define(key: string, decl: AttributeDeclaration): void {
    let attr = this._members[key];
    if (decl.converter && typeof ConverterList[decl.converter] === "undefined") {
      throw new Error(`Converter "${decl.converter}" is not found.`);
    }
    const converter = decl.converter ? new ConverterList[decl.converter]() : new ConverterList["string"]();
    const isExist = !!attr;
    if (isExist) {
      attr.constant = decl.constant;
    } else {
      //attr = new Attribute(key, decl.default, converter, decl.constant);
      this._members[key] = attr;
    }
    if (decl.onchange) {
      attr.removeAllListeners("change");
      attr.on("change", decl.onchange);
    }
    if (decl.onget) {
      attr.removeAllListeners("get");
      attr.on("get", decl.onget);
    }
    if (isExist) {
      // attr.setConverter(converter); // emit change
    }
    this._immediateSyncOrStandby(key, attr);
  }

  /**
   * Set the value of attribute or create new attribute if it is not exist.
   * @param  {string}    key   Key string.
   * @param  {any}       value Value with specified type.
   * @return {Attribute}       Targeted Attribute object.
   */
  private _setOrCreateNewAttribute(key: string, value: any): Attribute {
    let attr = this._members[key];
    if (attr) {
      attr.Value = value; // emit change
    } else {
      // attr = new Attribute(key, value, null, false);
      this._members[key] = attr;
    }
    return attr;
  }

  /**
   * Check whether reflect the changes to element immediately or not.
   * This method is called when attribute is changed.
   * When key is "id" or "class", sync it immediately.
   * @param {string}    key  Key string.
   * @param {Attribute} attr Attribute object.
   */
  private _immediateSyncOrStandby(key: string, attr: Attribute): void {
    if (key === "id" || key === "class") {
      this._element.setAttribute(key, attr.ValueStr);
    } else {
      this._standbyAttr.push(key);
    }
  }
}

export default AttributesContainer;
