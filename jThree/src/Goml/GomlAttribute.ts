import JThreeObjectEEWithID = require("../Base/JThreeObjectEEWithID");
import AttributeConverterBase = require("./Converter/AttributeConverterBase");
import Delegates = require("../Base/Delegates");
import GomlTreeNodeBase = require('./GomlTreeNodeBase');
import JThreeEvent = require('../Base/JThreeEvent');
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

  protected constant: boolean;

  /**
   * falseの時はattributeが更新された際のeventは呼ばれません。trueの時、attributeが初期化されていることを示します。
   * @type {boolean}
   */
  public initialized: boolean = false;

  constructor(name: string, value: any, converter: AttributeConverterBase, constant?: boolean) {
    super(name);
    if (constant === undefined) constant = false;
    this.constant = constant;
    this.converter = converter;
    if (value !== undefined) {
      this.value = this.converter.FromInterface(value);
    } else {
      this.value = undefined;
    }
  }

  /**
   * Attributeが初期化されていることを示すinitializedのフラグを建て、attributeが更新された際のeventが有効になるようにします。
   *
   * このメソッドはGomlNodeのインスタンスが生成された後に呼ばれ、GomlNodeのコンストラクタ内でset:Valueが呼ばれてもeventは発生しません。
   */
  public initialize(): void {
    if (this.value === undefined) console.warn(`Attribute ${this.Name} is undefined.`)
    this.initialized = true;
    console.log('initialized', this.ID, this.value);
    if (!this.Constant) this.emit('changed', this);
  }

  public get Name(): string {
    return this.ID;
  }

  public get Value(): any {
    return this.value;
  }

  public get Constant(): boolean {
    return this.constant;
  }

  public set Value(val: any) {
    console.log('setattr', this.ID, val);
    if (this.Constant && this.value === undefined) {
      console.warn(`attribute "${this.ID}" is immutable`)
      return;
    }
    this.value = this.Converter.FromInterface(val);
    if (this.initialized) {
      this.emit('changed', this);
    }
  }

  public get Converter(): AttributeConverterBase {
    return this.converter;
  }

  public notifyValueChanged() {
    if (this.Constant) return;
    if (this.initialized) {
      this.emit('changed', this);
    }
  }
}

export = GomlAttribute;
