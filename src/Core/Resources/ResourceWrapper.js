"use strict";
const JThreeObject_1 = require("../../Base/JThreeObject");
const JThreeEvent_1 = require("../../Base/JThreeEvent");
class ResourceWrapper extends JThreeObject_1.default {
    constructor(ownerCanvas) {
        super();
        this.__onInitializeChangedEvent = new JThreeEvent_1.default();
        this._ownerCanvas = ownerCanvas;
    }
    dispose() {
        return;
    }
    get OwnerCanvas() {
        return this._ownerCanvas;
    }
    get OwnerID() {
        return this._ownerCanvas.ID;
    }
    get GL() {
        return this._ownerCanvas.gl;
    }
    onInitializeChanged(handler) {
        this.__onInitializeChangedEvent.addListener(handler);
    }
    get Initialized() {
        return this._initialized;
    }
    init() {
        return;
    }
    __setInitialized(initialized) {
        if (typeof initialized === "undefined") {
            initialized = true;
        }
        if (initialized === this._initialized) {
            return;
        }
        this._initialized = initialized;
        this.__onInitializeChangedEvent.fire(this, initialized);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ResourceWrapper;
//# sourceMappingURL=ResourceWrapper.js.map