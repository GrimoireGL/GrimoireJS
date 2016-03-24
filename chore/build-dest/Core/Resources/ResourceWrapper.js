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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvcmUvUmVzb3VyY2VzL1Jlc291cmNlV3JhcHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FDTyxZQUFZLE1BQU0seUJBQXlCO09BRTNDLFdBQVcsTUFBTSx3QkFBd0I7QUFFaEQsOEJBQThCLFlBQVk7SUFTeEMsWUFBWSxXQUEyQjtRQUNyQyxPQUFPLENBQUM7UUFSQSwrQkFBMEIsR0FBeUIsSUFBSSxXQUFXLEVBQVcsQ0FBQztRQVN0RixJQUFJLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQztJQUNsQyxDQUFDO0lBRU0sT0FBTztRQUNaLE1BQU0sQ0FBQztJQUNULENBQUM7SUFDRDs7TUFFRTtJQUNGLElBQVcsV0FBVztRQUNwQixNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQztJQUMzQixDQUFDO0lBRUQ7O01BRUU7SUFDRixJQUFXLE9BQU87UUFDaEIsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDO0lBQzlCLENBQUM7SUFFRCxJQUFXLEVBQUU7UUFDWCxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUVEOztPQUVHO0lBQ0ksbUJBQW1CLENBQUMsT0FBMEM7UUFDbkUsSUFBSSxDQUFDLDBCQUEwQixDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQ7O01BRUU7SUFDRixJQUFXLFdBQVc7UUFDcEIsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDM0IsQ0FBQztJQUVNLElBQUk7UUFDVCxNQUFNLENBQUM7SUFDVCxDQUFDO0lBRVMsZ0JBQWdCLENBQUMsV0FBcUI7UUFDOUMsRUFBRSxDQUFDLENBQUMsT0FBTyxXQUFXLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQztZQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFBQyxDQUFDO1FBQy9ELEVBQUUsQ0FBQyxDQUFDLFdBQVcsS0FBSyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQztRQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUM7UUFDaEMsSUFBSSxDQUFDLDBCQUEwQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDMUQsQ0FBQztBQUVILENBQUM7QUFFRCxlQUFlLGVBQWUsQ0FBQyIsImZpbGUiOiJDb3JlL1Jlc291cmNlcy9SZXNvdXJjZVdyYXBwZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSURpc3Bvc2FibGUgZnJvbSBcIi4uLy4uL0Jhc2UvSURpc3Bvc2FibGVcIjtcbmltcG9ydCBKVGhyZWVPYmplY3QgZnJvbSBcIi4uLy4uL0Jhc2UvSlRocmVlT2JqZWN0XCI7XG5pbXBvcnQgQ29udGV4dE1hbmFnZXIgZnJvbSBcIi4uL0NhbnZhcy9DYW52YXNcIjtcbmltcG9ydCBKVGhyZWVFdmVudCBmcm9tIFwiLi4vLi4vQmFzZS9KVGhyZWVFdmVudFwiO1xuaW1wb3J0IHtBY3Rpb24yfSBmcm9tIFwiLi4vLi4vQmFzZS9EZWxlZ2F0ZXNcIjtcbmNsYXNzIFJlc291cmNlV3JhcHBlciBleHRlbmRzIEpUaHJlZU9iamVjdCBpbXBsZW1lbnRzIElEaXNwb3NhYmxlIHtcblxuICBwcm90ZWN0ZWQgX19vbkluaXRpYWxpemVDaGFuZ2VkRXZlbnQ6IEpUaHJlZUV2ZW50PGJvb2xlYW4+ID0gbmV3IEpUaHJlZUV2ZW50PGJvb2xlYW4+KCk7XG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoaXMgcmVzb3VyY2Ugd2FzIGluaXRpYWxpemVkIGZvciB0aGlzIGNvbnRleHQgb3Igbm90LlxuICAgKi9cbiAgcHJpdmF0ZSBfaW5pdGlhbGl6ZWQ6IGJvb2xlYW47XG4gIHByaXZhdGUgX293bmVyQ2FudmFzOiBDb250ZXh0TWFuYWdlcjtcblxuICBjb25zdHJ1Y3Rvcihvd25lckNhbnZhczogQ29udGV4dE1hbmFnZXIpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX293bmVyQ2FudmFzID0gb3duZXJDYW52YXM7XG4gIH1cblxuICBwdWJsaWMgZGlzcG9zZSgpOiB2b2lkIHtcbiAgICByZXR1cm47XG4gIH1cbiAgLyoqXG4gICogVGhlIGNhbnZhcyBob2xkIHRoaXMgcmVzb3VyY2UuXG4gICovXG4gIHB1YmxpYyBnZXQgT3duZXJDYW52YXMoKTogQ29udGV4dE1hbmFnZXIge1xuICAgIHJldHVybiB0aGlzLl9vd25lckNhbnZhcztcbiAgfVxuXG4gIC8qKlxuICAqIFRoZSBJRCBzdHJpbmcgZm9yIGlkZW50aWZ5IHdoaWNoIGNhbnZhcyBtYW5hZ2VyIGhvbGRzIHRoaXMgcmVzb3VyY2UuXG4gICovXG4gIHB1YmxpYyBnZXQgT3duZXJJRCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9vd25lckNhbnZhcy5JRDtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgR0woKSB7XG4gICAgcmV0dXJuIHRoaXMuX293bmVyQ2FudmFzLmdsO1xuICB9XG5cbiAgLyoqXG4gICAqIGFkZCBldmVudCBoYW5kbGVyIGZvciBjaGFuZ2luZyBpbml0aWFsaXplZCBzdGF0ZSBjaGFuZ2VkLlxuICAgKi9cbiAgcHVibGljIG9uSW5pdGlhbGl6ZUNoYW5nZWQoaGFuZGxlcjogQWN0aW9uMjxSZXNvdXJjZVdyYXBwZXIsIGJvb2xlYW4+KTogdm9pZCB7XG4gICAgdGhpcy5fX29uSW5pdGlhbGl6ZUNoYW5nZWRFdmVudC5hZGRMaXN0ZW5lcihoYW5kbGVyKTtcbiAgfVxuXG4gIC8qKlxuICAqIEdldHRlciBmb3Igd2hldGhlciB0aGlzIHJlc291cmNlIHdhcyBpbml0aWFsaXplZCBmb3IgdGhpcyBjb250ZXh0IG9yIG5vdC5cbiAgKi9cbiAgcHVibGljIGdldCBJbml0aWFsaXplZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faW5pdGlhbGl6ZWQ7XG4gIH1cblxuICBwdWJsaWMgaW5pdCgpOiB2b2lkIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBwcm90ZWN0ZWQgX19zZXRJbml0aWFsaXplZChpbml0aWFsaXplZD86IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBpZiAodHlwZW9mIGluaXRpYWxpemVkID09PSBcInVuZGVmaW5lZFwiKSB7IGluaXRpYWxpemVkID0gdHJ1ZTsgfVxuICAgIGlmIChpbml0aWFsaXplZCA9PT0gdGhpcy5faW5pdGlhbGl6ZWQpIHsgcmV0dXJuOyB9XG4gICAgdGhpcy5faW5pdGlhbGl6ZWQgPSBpbml0aWFsaXplZDtcbiAgICB0aGlzLl9fb25Jbml0aWFsaXplQ2hhbmdlZEV2ZW50LmZpcmUodGhpcywgaW5pdGlhbGl6ZWQpO1xuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVzb3VyY2VXcmFwcGVyO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
