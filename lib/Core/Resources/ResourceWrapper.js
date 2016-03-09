import JThreeObject from "../../Base/JThreeObject";
import JThreeEvent from "../../Base/JThreeEvent";
class ResourceWrapper extends JThreeObject {
    constructor(ownerCanvas) {
        super();
        this.__onInitializeChangedEvent = new JThreeEvent();
        this._ownerCanvas = ownerCanvas;
    }
    dispose() {
        return;
    }
    /**
    * The canvas hold this resource.
    */
    get OwnerCanvas() {
        return this._ownerCanvas;
    }
    /**
    * The ID string for identify which canvas manager holds this resource.
    */
    get OwnerID() {
        return this._ownerCanvas.ID;
    }
    get GL() {
        return this._ownerCanvas.gl;
    }
    /**
     * add event handler for changing initialized state changed.
     */
    onInitializeChanged(handler) {
        this.__onInitializeChangedEvent.addListener(handler);
    }
    /**
    * Getter for whether this resource was initialized for this context or not.
    */
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
export default ResourceWrapper;
