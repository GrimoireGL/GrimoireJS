import JThreeObjectEEWithID from "../Base/JThreeObjectEEWithID";
import AttributeConverterBase from "./Converter/AttributeConverterBase";
import StringAttributeConverter from "./Converter/StringAttributeConverter";
import JThreeContext from "../JThreeContext";
import NodeManager from "./NodeManager";
import ContextComponents from "../ContextComponents";
import Q from "q";

/**
 * Provides the feature to manage attribute of GOML.
 */
class GomlAttribute extends JThreeObjectEEWithID {
  /**
   * If flag is true, attribute value will be recognized as contant.
   * @type {boolean}
   */
  public constant: boolean;

  /**
   * falseの時はattributeが更新された際のeventは呼ばれません。trueの時、attributeが初期化されていることを示します。
   * @type {boolean}
   */
  public initialized: boolean = false;

  constructor(name: string, value: any, converter: AttributeConverterBase, reserved: boolean, constant: boolean) {
    super(name);
    this._nodeManager = JThreeContext.getContextComponent<NodeManager>(ContextComponents.NodeManager);
    this.constant = constant !== undefined ? constant : false;
    this.reserved = reserved !== undefined ? reserved : false;
    this.Converter = converter;
    this.Value = value;
  }

  /**
   * When reserved flag is true, this attribute is not defined from Node's constructor and expected to be defined in Node.
   * This attribute will be true when it is defined not in Node but in Element.
   * @type {boolean}
   */
  public reserved: boolean = false;

  /**
   * The cache value for attribute.
   */
  protected __value: any;

  /**
   * Reference to converter class that will manage to parse,cast to string and animation.
   */
  protected __converter: AttributeConverterBase;

  /**
   * deferred for handling async initializing of attribute.
   * @type {boolean}
   */
  private _deferred: Q.Deferred<GomlAttribute> = null;

  private _initializeSequence: boolean = false;

  private _nodeManager: NodeManager;

  /**
   * Attributeが初期化されていることを示すinitializedのフラグを建て、attributeが更新された際のeventが有効になるようにします。
   *
   * このメソッドはGomlNodeのインスタンスが生成された後に呼ばれ、GomlNodeのコンストラクタ内でset:Valueが呼ばれてもeventは発生しません。
   */
  public initialize(): void {
    if (this.__value === undefined) {
      console.warn(`Attribute ${this.Name} is undefined.`);
    }
    // console.log("initialized", this.ID, this.value);
    if (this.reserved) {
      // overrideが期待されているattributeの初期化
      // notifyValueChangedでdeferredが解決される
      // temp時にinitializeSequenceが開始される
      // 一箇所でpromiseを集めるための処置
      this._initializeSequence = true;
    } else if (!this.constant && this.listeners("changed").length !== 0) {
      // 通常時のAttributeの初期化
      // onchangeのイベントのコールバック内でdoneでdeferredが解決される
      this._initializeSequence = true;
      if (this._nodeManager.attributePromiseRegistry.enabled) {
        this._deferred = Q.defer<GomlAttribute>();
        this._nodeManager.attributePromiseRegistry.register(this._deferred.promise, this);
      }
      this.emit("changed", this);
    } else {
      // onchangeハンドラが無い、又は定数の場合はpromiseを生成しない。
      this.initialized = true;
      // console.log("resolve attribute (inst)", this.Name);
    }
  }

  /**
   * This method must be called inside onchange event callback.
   */
  public done(): void {
    if (this._initializeSequence) {
      this.initialized = true;
      this._initializeSequence = false;
      // console.log("resolve attribute (done)", this.Name);
      if (this._nodeManager.attributePromiseRegistry.enabled) {
        this._deferred.resolve(this);
      }
    }
  }

  public get Name(): string {
    return this.id;
  }

  public get Value(): any {
    return this.__value;
  }

  public get ValueStr(): string {
    return this.__value == null ? "" : this.Converter.toStringAttr(this.__value);
  }

  public set Value(val: any) {
    // console.log("setattr", this.Name, val);
    if (this.constant && this.__value !== undefined) {
      console.warn(`attribute "${this.id}" is immutable`);
      return;
    }
    if (typeof val === "string") {
      this.__value = this.Converter.toObjectAttr(val);
    } else {
      try {
        this.Converter.toStringAttr(val);
      } catch (e) {
        console.warn(`type of attribute: ${this.Name}(${val}) is not adapt to converter: ${this.Converter.getTypeName()}`, val);
      }
      this.__value = val;
    }
    // console.log("setattr_obj", this.Name, this.value);
    if (this.initialized) {
      this.emit("changed", this);
    }
  }

  /**
   * Get converter
   *
   * If converter is undefined, string converter will be used as default.
   * @return {AttributeConverterBase} converter
   */
  public get Converter(): AttributeConverterBase {
    return this.__converter ? this.__converter : <AttributeConverterBase>(new StringAttributeConverter);
  }

  public set Converter(converter: AttributeConverterBase) {
    if (this.__converter === undefined) {
      this.__converter = converter;
    } else {
      const attr_value = this.Converter.toStringAttr(this.Value);
      this.__converter = converter;
      this.Value = attr_value;
    }
  }

  /**
   * Use this method when you emit chenge event.
   * Do not use #emit()
   *
   * on change event will be fired when #initialized property is true.
   * When this attribute is reserved and #initializeSequence is true, change event will also be fired even if not initilized.
   */
  public notifyValueChanged(): void {
    if (this.constant) {
      return;
    }
    if (this.initialized || this._initializeSequence) {
      if (this._initializeSequence) {
        this._deferred = Q.defer<GomlAttribute>();
        this._nodeManager.attributePromiseRegistry.register(this._deferred.promise, this);
      }
      this.emit("changed", this);
    }
  }
}

export default GomlAttribute;
