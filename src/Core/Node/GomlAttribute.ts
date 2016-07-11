import EEObject from "../Base/EEObject";
import AttributeConverter from "./AttributeConverter";
import GomlConfigurator from "./GomlConfigurator";

/**
 * Provides the feature to manage attribute of GOML.
 */
class GomlAttribute extends EEObject {
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

    /**
     * The cache value for attribute.
     */
    private __value: any;

    /**
     * Reference to converter class that will manage to parse,cast to string and animation.
     */
    private __converter: AttributeConverter;

    private _name: string;
    private _namespace: string;
    private _defaultValue: any;

    constructor(name: string, namespace: string, defaultValue?: any, converter?: AttributeConverter, constant?: boolean) {
        super(name);
        this._name = name;
        this._namespace = namespace;
        this.constant = constant !== undefined ? constant : false;
        this.Converter = converter;
        this._defaultValue = defaultValue;
    }
    /**
     * Attributeが初期化されていることを示すinitializedのフラグを建て、attributeが更新された際のeventが有効になるようにします。
     *
     * このメソッドはGomlNodeのインスタンスが生成された後に呼ばれ、GomlNodeのコンストラクタ内でset:Valueが呼ばれてもeventは発生しません。
     */
    public initialize(): void {
        if (this.__value === undefined) {
            console.warn(`Attribute ${this.Name} is undefined.`);
        }
        this.initialized = true;
        if (!this.constant && this.listeners("changed").length !== 0) {
            // 通常時のAttributeの初期化
            // onchangeのイベントのコールバック内でdoneでdeferredが解決される
            this.emit("changed", this);
        }
    }

    public get Name(): string {
        return this._name;
    }

    public get Namespace(): string {
      return this._namespace;
    }

    public get Value(): any {
        return this.__value;
    }

    public get DefaultValue(): any {
      return this._defaultValue;
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
    public get Converter(): AttributeConverter {
        return this.__converter ? this.__converter : GomlConfigurator.Instance.getConverter("string");
    }

    public set Converter(converter: AttributeConverter) {
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
        if (this.initialized) {
            this.emit("changed", this);
        }
    }
}

export default GomlAttribute;
