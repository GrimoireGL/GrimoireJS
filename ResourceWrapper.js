var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var JThreeObject = require('../../Base/JThreeObject');
var JThreeEvent = require('../../Base/JThreeEvent');
var ResourceWrapper = (function (_super) {
    __extends(ResourceWrapper, _super);
    function ResourceWrapper(ownerCanvas) {
        _super.call(this);
        this.onInitializeChangedEvent = new JThreeEvent();
        this.ownerCanvas = ownerCanvas;
    }
    Object.defineProperty(ResourceWrapper.prototype, "OwnerCanvas", {
        get: function () {
            return this.ownerCanvas;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceWrapper.prototype, "OwnerID", {
        get: function () {
            return this.ownerCanvas.ID;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceWrapper.prototype, "WebGLContext", {
        get: function () {
            return this.ownerCanvas.Context;
        },
        enumerable: true,
        configurable: true
    });
    ResourceWrapper.prototype.onInitializeChanged = function (handler) {
        this.onInitializeChangedEvent.addListerner(handler);
    };
    Object.defineProperty(ResourceWrapper.prototype, "Initialized", {
        get: function () {
            return this.initialized;
        },
        enumerable: true,
        configurable: true
    });
    ResourceWrapper.prototype.setInitialized = function (initialized) {
        if (typeof initialized === "undefined")
            initialized = true;
        if (initialized === this.initialized)
            return;
        this.initialized = initialized;
        this.onInitializeChangedEvent.fire(this, initialized);
    };
    return ResourceWrapper;
})(JThreeObject);
module.exports = ResourceWrapper;
