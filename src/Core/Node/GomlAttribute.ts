import EEObject from "../Base/EEObject";
import AttributeConverter from "./AttributeConverter";
import GomlConfigurator from "./GomlConfigurator";

/**
 * Provides the feature to manage attribute of GOML.
 */
class GomlAttribute extends EEObject {


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
        if (this._value === undefined) {
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
        return this._value;
    }

    public get DefaultValue(): any {
      return this._defaultValue;
    }

    public get ValueStr(): string {
        return this._value == null ? "" : this.Converter.toStringAttr(this._value);
    }

    public set Value(val: any) {
        // console.log("setattr", this.Name, val);
        if (this.constant && this._value !== undefined) {
            console.warn(`attribute "${this.id}" is immutable`);
            return;
        }
        if (typeof val === "string") {
            this._value = this.Converter.toObjectAttr(val);
        } else {
            try {
                this.Converter.toStringAttr(val);
            } catch (e) {
                console.warn(`type of attribute: ${this.Name}(${val}) is not adapt to converter: ${this.Converter.getTypeName()}`, val);
            }
            this._value = val;
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
        return this._converter ? this._converter : GomlConfigurator.Instance.getConverter("string");
    }

    public set Converter(converter: AttributeConverter) {
        if (this._converter === undefined) {
            this._converter = converter;
        } else {
            const attr_value = this.Converter.toStringAttr(this.Value);
            this._converter = converter;
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
