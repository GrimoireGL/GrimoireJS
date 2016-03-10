import JThreeObjectEEWithID from "../Base/JThreeObjectEEWithID";
import StringAttributeConverter from "./Converter/StringAttributeConverter";
import JThreeContext from "../JThreeContext";
import ContextComponents from "../ContextComponents";
import Q from "q";
/**
 * Provides the feature to manage attribute of GOML.
 */
class GomlAttribute extends JThreeObjectEEWithID {
    constructor(name, value, converter, reserved, constant) {
        super(name);
        /**
         * falseの時はattributeが更新された際のeventは呼ばれません。trueの時、attributeが初期化されていることを示します。
         * @type {boolean}
         */
        this.initialized = false;
        /**
         * When reserved flag is true, this attribute is not defined from Node's constructor and expected to be defined in Node.
         * This attribute will be true when it is defined not in Node but in Element.
         * @type {boolean}
         */
        this.reserved = false;
        /**
         * deferred for handling async initializing of attribute.
         * @type {boolean}
         */
        this._deferred = null;
        this._defer_type = "";
        this._initializeSequence = false;
        this._nodeManager = JThreeContext.getContextComponent(ContextComponents.NodeManager);
        this.constant = constant !== undefined ? constant : false;
        this.reserved = reserved !== undefined ? reserved : false;
        this.Converter = converter;
        this.Value = value;
    }
    /**
     * Attributeが初期化されていることを示すinitializedのフラグを建て、attributeが更新された際のeventが有効になるようにします。
     *
     * このメソッドはGomlNodeのインスタンスが生成された後に呼ばれ、GomlNodeのコンストラクタ内でset:Valueが呼ばれてもeventは発生しません。
     */
    initialize() {
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
            this._defer_type = "reserved";
        }
        else if (!this.constant && this.listeners("changed").length !== 0) {
            // 通常時のAttributeの初期化
            // onchangeのイベントのコールバック内でdoneでdeferredが解決される
            this._initializeSequence = true;
            this._deferred = Q.defer();
            this._nodeManager.attributePromiseRegistry.register(this._deferred.promise, this);
            this._defer_type = "not constant, has changed";
            this.emit("changed", this);
        }
        else {
            // onchangeハンドラが無い、又は定数の場合はpromiseを生成しない。
            this.initialized = true;
            // console.log("resolve attribute (inst)", this.Name);
            this._defer_type = "constant or no changed, not reserved";
        }
    }
    /**
     * This method must be called inside onchange event callback.
     */
    done() {
        if (this._initializeSequence) {
            this.initialized = true;
            this._initializeSequence = false;
            // console.log("resolve attribute (done)", this.Name);
            this._deferred.resolve(this);
        }
    }
    get Name() {
        return this.ID;
    }
    get Value() {
        return this.__value;
    }
    get ValueStr() {
        return this.__value == null ? "" : this.Converter.toStringAttr(this.__value);
    }
    set Value(val) {
        // console.log("setattr", this.Name, val);
        if (this.constant && this.__value !== undefined) {
            console.warn(`attribute "${this.ID}" is immutable`);
            return;
        }
        if (typeof val === "string") {
            this.__value = this.Converter.toObjectAttr(val);
        }
        else {
            try {
                this.Converter.toStringAttr(val);
            }
            catch (e) {
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
    get Converter() {
        return this.__converter ? this.__converter : (new StringAttributeConverter);
    }
    set Converter(converter) {
        if (this.__converter === undefined) {
            this.__converter = converter;
        }
        else {
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
    notifyValueChanged() {
        if (this.constant) {
            return;
        }
        if (this.initialized || this._initializeSequence) {
            if (this._initializeSequence) {
                this._deferred = Q.defer();
                this._nodeManager.attributePromiseRegistry.register(this._deferred.promise, this);
            }
            this.emit("changed", this);
        }
    }
}
export default GomlAttribute;

//# sourceMappingURL=data:application/json;base64,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QztZQUNqRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQWlCLENBQUM7Z0JBQzFDLElBQUksQ0FBQyxZQUFZLENBQUMsd0JBQXdCLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3BGLENBQUM7WUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM3QixDQUFDO0lBQ0gsQ0FBQztBQUNILENBQUM7QUFFRCxlQUFlLGFBQWEsQ0FBQyIsImZpbGUiOiJHb21sL0dvbWxBdHRyaWJ1dGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSlRocmVlT2JqZWN0RUVXaXRoSUQgZnJvbSBcIi4uL0Jhc2UvSlRocmVlT2JqZWN0RUVXaXRoSURcIjtcbmltcG9ydCBBdHRyaWJ1dGVDb252ZXJ0ZXJCYXNlIGZyb20gXCIuL0NvbnZlcnRlci9BdHRyaWJ1dGVDb252ZXJ0ZXJCYXNlXCI7XG5pbXBvcnQgU3RyaW5nQXR0cmlidXRlQ29udmVydGVyIGZyb20gXCIuL0NvbnZlcnRlci9TdHJpbmdBdHRyaWJ1dGVDb252ZXJ0ZXJcIjtcbmltcG9ydCBKVGhyZWVDb250ZXh0IGZyb20gXCIuLi9KVGhyZWVDb250ZXh0XCI7XG5pbXBvcnQgTm9kZU1hbmFnZXIgZnJvbSBcIi4vTm9kZU1hbmFnZXJcIjtcbmltcG9ydCBDb250ZXh0Q29tcG9uZW50cyBmcm9tIFwiLi4vQ29udGV4dENvbXBvbmVudHNcIjtcbmltcG9ydCBRIGZyb20gXCJxXCI7XG5cbi8qKlxuICogUHJvdmlkZXMgdGhlIGZlYXR1cmUgdG8gbWFuYWdlIGF0dHJpYnV0ZSBvZiBHT01MLlxuICovXG5jbGFzcyBHb21sQXR0cmlidXRlIGV4dGVuZHMgSlRocmVlT2JqZWN0RUVXaXRoSUQge1xuICAvKipcbiAgICogSWYgZmxhZyBpcyB0cnVlLCBhdHRyaWJ1dGUgdmFsdWUgd2lsbCBiZSByZWNvZ25pemVkIGFzIGNvbnRhbnQuXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKi9cbiAgcHVibGljIGNvbnN0YW50OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBmYWxzZeOBruaZguOBr2F0dHJpYnV0ZeOBjOabtOaWsOOBleOCjOOBn+mam+OBrmV2ZW5044Gv5ZG844Gw44KM44G+44Gb44KT44CCdHJ1ZeOBruaZguOAgWF0dHJpYnV0ZeOBjOWIneacn+WMluOBleOCjOOBpuOBhOOCi+OBk+OBqOOCkuekuuOBl+OBvuOBmeOAglxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICovXG4gIHB1YmxpYyBpbml0aWFsaXplZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgdmFsdWU6IGFueSwgY29udmVydGVyOiBBdHRyaWJ1dGVDb252ZXJ0ZXJCYXNlLCByZXNlcnZlZDogYm9vbGVhbiwgY29uc3RhbnQ6IGJvb2xlYW4pIHtcbiAgICBzdXBlcihuYW1lKTtcbiAgICB0aGlzLl9ub2RlTWFuYWdlciA9IEpUaHJlZUNvbnRleHQuZ2V0Q29udGV4dENvbXBvbmVudDxOb2RlTWFuYWdlcj4oQ29udGV4dENvbXBvbmVudHMuTm9kZU1hbmFnZXIpO1xuICAgIHRoaXMuY29uc3RhbnQgPSBjb25zdGFudCAhPT0gdW5kZWZpbmVkID8gY29uc3RhbnQgOiBmYWxzZTtcbiAgICB0aGlzLnJlc2VydmVkID0gcmVzZXJ2ZWQgIT09IHVuZGVmaW5lZCA/IHJlc2VydmVkIDogZmFsc2U7XG4gICAgdGhpcy5Db252ZXJ0ZXIgPSBjb252ZXJ0ZXI7XG4gICAgdGhpcy5WYWx1ZSA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZW4gcmVzZXJ2ZWQgZmxhZyBpcyB0cnVlLCB0aGlzIGF0dHJpYnV0ZSBpcyBub3QgZGVmaW5lZCBmcm9tIE5vZGUncyBjb25zdHJ1Y3RvciBhbmQgZXhwZWN0ZWQgdG8gYmUgZGVmaW5lZCBpbiBOb2RlLlxuICAgKiBUaGlzIGF0dHJpYnV0ZSB3aWxsIGJlIHRydWUgd2hlbiBpdCBpcyBkZWZpbmVkIG5vdCBpbiBOb2RlIGJ1dCBpbiBFbGVtZW50LlxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICovXG4gIHB1YmxpYyByZXNlcnZlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBUaGUgY2FjaGUgdmFsdWUgZm9yIGF0dHJpYnV0ZS5cbiAgICovXG4gIHByb3RlY3RlZCBfX3ZhbHVlOiBhbnk7XG5cbiAgLyoqXG4gICAqIFJlZmVyZW5jZSB0byBjb252ZXJ0ZXIgY2xhc3MgdGhhdCB3aWxsIG1hbmFnZSB0byBwYXJzZSxjYXN0IHRvIHN0cmluZyBhbmQgYW5pbWF0aW9uLlxuICAgKi9cbiAgcHJvdGVjdGVkIF9fY29udmVydGVyOiBBdHRyaWJ1dGVDb252ZXJ0ZXJCYXNlO1xuXG4gIC8qKlxuICAgKiBkZWZlcnJlZCBmb3IgaGFuZGxpbmcgYXN5bmMgaW5pdGlhbGl6aW5nIG9mIGF0dHJpYnV0ZS5cbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqL1xuICBwcml2YXRlIF9kZWZlcnJlZDogUS5EZWZlcnJlZDxHb21sQXR0cmlidXRlPiA9IG51bGw7XG5cbiAgcHJpdmF0ZSBfZGVmZXJfdHlwZTogc3RyaW5nID0gXCJcIjtcblxuICBwcml2YXRlIF9pbml0aWFsaXplU2VxdWVuY2U6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBwcml2YXRlIF9ub2RlTWFuYWdlcjogTm9kZU1hbmFnZXI7XG5cbiAgLyoqXG4gICAqIEF0dHJpYnV0ZeOBjOWIneacn+WMluOBleOCjOOBpuOBhOOCi+OBk+OBqOOCkuekuuOBmWluaXRpYWxpemVk44Gu44OV44Op44Kw44KS5bu644Gm44CBYXR0cmlidXRl44GM5pu05paw44GV44KM44Gf6Zqb44GuZXZlbnTjgYzmnInlirnjgavjgarjgovjgojjgYbjgavjgZfjgb7jgZnjgIJcbiAgICpcbiAgICog44GT44Gu44Oh44K944OD44OJ44GvR29tbE5vZGXjga7jgqTjg7Pjgrnjgr/jg7PjgrnjgYznlJ/miJDjgZXjgozjgZ/lvozjgavlkbzjgbDjgozjgIFHb21sTm9kZeOBruOCs+ODs+OCueODiOODqeOCr+OCv+WGheOBp3NldDpWYWx1ZeOBjOWRvOOBsOOCjOOBpuOCgmV2ZW5044Gv55m655Sf44GX44G+44Gb44KT44CCXG4gICAqL1xuICBwdWJsaWMgaW5pdGlhbGl6ZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fX3ZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnNvbGUud2FybihgQXR0cmlidXRlICR7dGhpcy5OYW1lfSBpcyB1bmRlZmluZWQuYCk7XG4gICAgfVxuICAgIC8vIGNvbnNvbGUubG9nKFwiaW5pdGlhbGl6ZWRcIiwgdGhpcy5JRCwgdGhpcy52YWx1ZSk7XG4gICAgaWYgKHRoaXMucmVzZXJ2ZWQpIHtcbiAgICAgIC8vIG92ZXJyaWRl44GM5pyf5b6F44GV44KM44Gm44GE44KLYXR0cmlidXRl44Gu5Yid5pyf5YyWXG4gICAgICAvLyBub3RpZnlWYWx1ZUNoYW5nZWTjgadkZWZlcnJlZOOBjOino+axuuOBleOCjOOCi1xuICAgICAgLy8gdGVtcOaZguOBq2luaXRpYWxpemVTZXF1ZW5jZeOBjOmWi+Wni+OBleOCjOOCi1xuICAgICAgLy8g5LiA566H5omA44GncHJvbWlzZeOCkumbhuOCgeOCi+OBn+OCgeOBruWHpue9rlxuICAgICAgdGhpcy5faW5pdGlhbGl6ZVNlcXVlbmNlID0gdHJ1ZTtcbiAgICAgIHRoaXMuX2RlZmVyX3R5cGUgPSBcInJlc2VydmVkXCI7XG4gICAgfSBlbHNlIGlmICghdGhpcy5jb25zdGFudCAmJiB0aGlzLmxpc3RlbmVycyhcImNoYW5nZWRcIikubGVuZ3RoICE9PSAwKSB7XG4gICAgICAvLyDpgJrluLjmmYLjga5BdHRyaWJ1dGXjga7liJ3mnJ/ljJZcbiAgICAgIC8vIG9uY2hhbmdl44Gu44Kk44OZ44Oz44OI44Gu44Kz44O844Or44OQ44OD44Kv5YaF44GnZG9uZeOBp2RlZmVycmVk44GM6Kej5rG644GV44KM44KLXG4gICAgICB0aGlzLl9pbml0aWFsaXplU2VxdWVuY2UgPSB0cnVlO1xuICAgICAgdGhpcy5fZGVmZXJyZWQgPSBRLmRlZmVyPEdvbWxBdHRyaWJ1dGU+KCk7XG4gICAgICB0aGlzLl9ub2RlTWFuYWdlci5hdHRyaWJ1dGVQcm9taXNlUmVnaXN0cnkucmVnaXN0ZXIodGhpcy5fZGVmZXJyZWQucHJvbWlzZSwgdGhpcyk7XG4gICAgICB0aGlzLl9kZWZlcl90eXBlID0gXCJub3QgY29uc3RhbnQsIGhhcyBjaGFuZ2VkXCI7XG4gICAgICB0aGlzLmVtaXQoXCJjaGFuZ2VkXCIsIHRoaXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBvbmNoYW5nZeODj+ODs+ODieODqeOBjOeEoeOBhOOAgeWPiOOBr+WumuaVsOOBruWgtOWQiOOBr3Byb21pc2XjgpLnlJ/miJDjgZfjgarjgYTjgIJcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgICAgLy8gY29uc29sZS5sb2coXCJyZXNvbHZlIGF0dHJpYnV0ZSAoaW5zdClcIiwgdGhpcy5OYW1lKTtcbiAgICAgIHRoaXMuX2RlZmVyX3R5cGUgPSBcImNvbnN0YW50IG9yIG5vIGNoYW5nZWQsIG5vdCByZXNlcnZlZFwiO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBtdXN0IGJlIGNhbGxlZCBpbnNpZGUgb25jaGFuZ2UgZXZlbnQgY2FsbGJhY2suXG4gICAqL1xuICBwdWJsaWMgZG9uZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5faW5pdGlhbGl6ZVNlcXVlbmNlKSB7XG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuX2luaXRpYWxpemVTZXF1ZW5jZSA9IGZhbHNlO1xuICAgICAgLy8gY29uc29sZS5sb2coXCJyZXNvbHZlIGF0dHJpYnV0ZSAoZG9uZSlcIiwgdGhpcy5OYW1lKTtcbiAgICAgIHRoaXMuX2RlZmVycmVkLnJlc29sdmUodGhpcyk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGdldCBOYW1lKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuSUQ7XG4gIH1cblxuICBwdWJsaWMgZ2V0IFZhbHVlKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX192YWx1ZTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgVmFsdWVTdHIoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fX3ZhbHVlID09IG51bGwgPyBcIlwiIDogdGhpcy5Db252ZXJ0ZXIudG9TdHJpbmdBdHRyKHRoaXMuX192YWx1ZSk7XG4gIH1cblxuICBwdWJsaWMgc2V0IFZhbHVlKHZhbDogYW55KSB7XG4gICAgLy8gY29uc29sZS5sb2coXCJzZXRhdHRyXCIsIHRoaXMuTmFtZSwgdmFsKTtcbiAgICBpZiAodGhpcy5jb25zdGFudCAmJiB0aGlzLl9fdmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc29sZS53YXJuKGBhdHRyaWJ1dGUgXCIke3RoaXMuSUR9XCIgaXMgaW1tdXRhYmxlYCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdmFsID09PSBcInN0cmluZ1wiKSB7XG4gICAgICB0aGlzLl9fdmFsdWUgPSB0aGlzLkNvbnZlcnRlci50b09iamVjdEF0dHIodmFsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5Db252ZXJ0ZXIudG9TdHJpbmdBdHRyKHZhbCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihgdHlwZSBvZiBhdHRyaWJ1dGU6ICR7dGhpcy5OYW1lfSgke3ZhbH0pIGlzIG5vdCBhZGFwdCB0byBjb252ZXJ0ZXI6ICR7dGhpcy5Db252ZXJ0ZXIuZ2V0VHlwZU5hbWUoKX1gLCB2YWwpO1xuICAgICAgfVxuICAgICAgdGhpcy5fX3ZhbHVlID0gdmFsO1xuICAgIH1cbiAgICAvLyBjb25zb2xlLmxvZyhcInNldGF0dHJfb2JqXCIsIHRoaXMuTmFtZSwgdGhpcy52YWx1ZSk7XG4gICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpIHtcbiAgICAgIHRoaXMuZW1pdChcImNoYW5nZWRcIiwgdGhpcyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBjb252ZXJ0ZXJcbiAgICpcbiAgICogSWYgY29udmVydGVyIGlzIHVuZGVmaW5lZCwgc3RyaW5nIGNvbnZlcnRlciB3aWxsIGJlIHVzZWQgYXMgZGVmYXVsdC5cbiAgICogQHJldHVybiB7QXR0cmlidXRlQ29udmVydGVyQmFzZX0gY29udmVydGVyXG4gICAqL1xuICBwdWJsaWMgZ2V0IENvbnZlcnRlcigpOiBBdHRyaWJ1dGVDb252ZXJ0ZXJCYXNlIHtcbiAgICByZXR1cm4gdGhpcy5fX2NvbnZlcnRlciA/IHRoaXMuX19jb252ZXJ0ZXIgOiA8QXR0cmlidXRlQ29udmVydGVyQmFzZT4obmV3IFN0cmluZ0F0dHJpYnV0ZUNvbnZlcnRlcik7XG4gIH1cblxuICBwdWJsaWMgc2V0IENvbnZlcnRlcihjb252ZXJ0ZXI6IEF0dHJpYnV0ZUNvbnZlcnRlckJhc2UpIHtcbiAgICBpZiAodGhpcy5fX2NvbnZlcnRlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLl9fY29udmVydGVyID0gY29udmVydGVyO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBhdHRyX3ZhbHVlID0gdGhpcy5Db252ZXJ0ZXIudG9TdHJpbmdBdHRyKHRoaXMuVmFsdWUpO1xuICAgICAgdGhpcy5fX2NvbnZlcnRlciA9IGNvbnZlcnRlcjtcbiAgICAgIHRoaXMuVmFsdWUgPSBhdHRyX3ZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVc2UgdGhpcyBtZXRob2Qgd2hlbiB5b3UgZW1pdCBjaGVuZ2UgZXZlbnQuXG4gICAqIERvIG5vdCB1c2UgI2VtaXQoKVxuICAgKlxuICAgKiBvbiBjaGFuZ2UgZXZlbnQgd2lsbCBiZSBmaXJlZCB3aGVuICNpbml0aWFsaXplZCBwcm9wZXJ0eSBpcyB0cnVlLlxuICAgKiBXaGVuIHRoaXMgYXR0cmlidXRlIGlzIHJlc2VydmVkIGFuZCAjaW5pdGlhbGl6ZVNlcXVlbmNlIGlzIHRydWUsIGNoYW5nZSBldmVudCB3aWxsIGFsc28gYmUgZmlyZWQgZXZlbiBpZiBub3QgaW5pdGlsaXplZC5cbiAgICovXG4gIHB1YmxpYyBub3RpZnlWYWx1ZUNoYW5nZWQoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY29uc3RhbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQgfHwgdGhpcy5faW5pdGlhbGl6ZVNlcXVlbmNlKSB7XG4gICAgICBpZiAodGhpcy5faW5pdGlhbGl6ZVNlcXVlbmNlKSB7XG4gICAgICAgIHRoaXMuX2RlZmVycmVkID0gUS5kZWZlcjxHb21sQXR0cmlidXRlPigpO1xuICAgICAgICB0aGlzLl9ub2RlTWFuYWdlci5hdHRyaWJ1dGVQcm9taXNlUmVnaXN0cnkucmVnaXN0ZXIodGhpcy5fZGVmZXJyZWQucHJvbWlzZSwgdGhpcyk7XG4gICAgICB9XG4gICAgICB0aGlzLmVtaXQoXCJjaGFuZ2VkXCIsIHRoaXMpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHb21sQXR0cmlidXRlO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
