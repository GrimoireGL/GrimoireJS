var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var events_1 = require("events");
var IDObject_1 = require("./IDObject");
/**
 * EventEmitterをmixinしたIDObject
 */
var EEObject = (function (_super) {
    __extends(EEObject, _super);
    function EEObject() {
        _super.call(this);
    }
    EEObject.prototype.emitException = function (eventName, error) {
        error.handled = false;
        var listeners = this.listeners(eventName);
        for (var i = 0; i < listeners.length; i++) {
            listeners[listeners.length - i - 1](error);
            if (error.handled) {
                return;
            }
        }
        if (eventName !== "error") {
            this.emitException("error", error);
        }
        else {
            throw error;
        }
    };
    return EEObject;
})(IDObject_1["default"]);
function applyMixins(derivedCtor, baseCtors) {
    baseCtors.forEach(function (baseCtor) {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}
applyMixins(EEObject, [events_1.EventEmitter]);
exports["default"] = EEObject;
