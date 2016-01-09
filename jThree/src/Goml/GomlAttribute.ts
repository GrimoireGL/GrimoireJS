import JThreeObjectEEWithID = require("../Base/JThreeObjectEEWithID");
import AttributeConverterBase = require("./Converter/AttributeConverterBase");
import Delegates = require("../Base/Delegates");
import GomlTreeNodeBase = require('./GomlTreeNodeBase');
import JThreeEvent = require('../Base/JThreeEvent');
import StringAttributeConverter = require('./Converter/StringAttributeConverter');

/**
 * Provides the feature to manage attribute of GOML.
 */
class GomlAttribute extends JThreeObjectEEWithID {
  /**
   * The cache value for attribute.
   */
  protected value: any;
  /**
   * Reference to converter class that will manage to parse,cast to string and animation.
   */
  protected converter: AttributeConverterBase;

  public constant: boolean;

  /**
   * falseの時はattributeが更新された際のeventは呼ばれません。trueの時、attributeが初期化されていることを示します。
   * @type {boolean}
   */
  public initialized: boolean = false;

  constructor(name: string, value: any, converter: AttributeConverterBase, reserved: boolean, constant: boolean) {
    super(name);
    this.constant = constant !== undefined ? constant : false;
    this.reserved = reserved !== undefined ? reserved : false;
    this.Converter = converter;
    this.Value = value;
  }

  public reserved: boolean = false;

  /**
   * Attributeが初期化されていることを示すinitializedのフラグを建て、attributeが更新された際のeventが有効になるようにします。
   *
   * このメソッドはGomlNodeのインスタンスが生成された後に呼ばれ、GomlNodeのコンストラクタ内でset:Valueが呼ばれてもeventは発生しません。
   */
  public initialize(): void {
    if (this.value === undefined) console.warn(`Attribute ${this.Name} is undefined.`)
    this.initialized = true;
    console.log('initialized', this.ID, this.value);
    if (!this.constant) this.emit('changed', this);
  }

  public get Name(): string {
    return this.ID;
  }

  public get Value(): any {
    return this.value;
  }

  public get ValueStr(): string {
    return this.value == null ? '' : this.converter.toStringAttr(this.value);
  }

  public set Value(val: any) {
    // console.log('setattr', this.Name, val);
    if (this.constant && this.value !== undefined) {
      console.warn(`attribute "${this.ID}" is immutable`)
      return;
    }
    if (typeof val == 'string') {
      this.value = this.Converter.toObjectAttr(val);
    } else {
      try {
        this.Converter.toStringAttr(val);
      } catch (e) {
        console.warn(`type of attribute: ${this.Name}(${val}) is not adapt to converter: ${this.Converter.getTypeName()}`, val);
      }
      this.value = val;
    }
    console.log('setattr_obj', this.Name, this.value);
    if (this.initialized) {
      this.emit('changed', this);
    }
  }

  /**
   * Get converter
   *
   * If converter is undefined, string converter will be used as default.
   * @return {AttributeConverterBase} converter
   */
  public get Converter(): AttributeConverterBase {
    return this.converter ? this.converter : <AttributeConverterBase>(new StringAttributeConverter);
  }

  public set Converter(converter: AttributeConverterBase) {
    if (this.converter === undefined) {
      this.converter = converter;
    } else {
      const attr_value = this.Converter.toStringAttr(this.Value);
      this.converter = converter;
      this.Value = attr_value;
    }
  }

  public notifyValueChanged() {
    if (this.constant) return;
    if (this.initialized) {
      this.emit('changed', this);
    }
  }
}

export = GomlAttribute;
