var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EEObject_1 = require("../Base/EEObject");
var GrimoireInterface_1 = require("../GrimoireInterface");
/**
 * Management a single attribute with specified type. Converter will serve a value with object with any type instead of string.
 * When attribute is changed, emit a "change" event. When attribute is requested, emit a "get" event.
 * If responsive flag is not true, event will not be emitted.
 */
var Attribute = (function (_super) {
    __extends(Attribute, _super);
    /**
     * Construct a new attribute with name of key and any value with specified type. If constant flag is true, This attribute will be immutable.
     * If converter is not served, string converter will be set as default.
     * @param {string}        key       Key of this attribute.
     * @param {any}           value     Value of this attribute.
     * @param {ConverterBase} converter Converter of this attribute.
     * @param {boolean}       constant  Whether this attribute is immutable or not. False as default.
     */
    function Attribute(declaration) {
        _super.call(this);
        this._responsively = false;
        this.name = declaration.name;
        this.declaration = declaration;
        this._value = declaration.defaultValue;
        this.converter = GrimoireInterface_1["default"].converters.get(declaration.converter);
        if (!this.converter) {
            throw new Error("Attribute converter '" + declaration.converter.fqn + "' can not found");
        }
    }
    Object.defineProperty(Attribute.prototype, "responsively", {
        /**
         * If this flag is not true, notify value changed to DomElement.
         * @type {boolean}
         */
        get: function () {
            return this._responsively;
        },
        set: function (value) {
            this._responsively = value;
            if (this._responsively) {
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Attribute.prototype, "Value", {
        /**
         * Get a value with specified type.
         * @return {any} value with specified type.
         */
        get: function () {
            return this._value;
        },
        /**
         * Set a value with any type.
         * @param {any} val Value with string or specified type.
         */
        set: function (val) {
            if (typeof (val) === "string") {
                this._value = this.converter.convert(val);
            }
            else {
                // TODO add try catch notation
                this._value = this.converter.convert(val);
            }
            if (this._responsively) {
                this._notifyChange();
            }
        },
        enumerable: true,
        configurable: true
    });
    Attribute.prototype._notifyChange = function () {
        // TODO:implement!!
    };
    return Attribute;
})(EEObject_1["default"]);
exports["default"] = Attribute;
