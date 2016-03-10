import jThreeObjectEEWithID from "../Base/JThreeObjectEEWithID";
import JThreeEvent from "../Base/JThreeEvent";
import Color3 from "../Math/Color3";
/**
 * Provides scene feature.
 */
class Scene extends jThreeObjectEEWithID {
    constructor(id) {
        super(id);
        this.sceneObjectStructureChanged = new JThreeEvent();
        this.children = [];
        /**
         * Scene ambient coefficients
         */
        this.sceneAmbient = new Color3(1.0, 1.0, 1.0);
        this._renderers = [];
        this._cameras = {};
        this.enabled = true;
    }
    /**
     * Scene will be updated by this method.
     * This method is intended to be called by jThree system.
     * You don't need to call this method manually in most of use case.
     */
    update() {
        if (!this.enabled) {
            return;
        }
        this.children.forEach(v => v.update());
    }
    /**
     * Scene will be rendererd by this method.
     * This method is intended to be called by jThree system.
     * You don't need to call this method manually in most of use case.
     */
    render() {
        this._renderers.forEach((r) => {
            r.beforeRender();
            r.render(this);
            r.afterRender();
        });
    }
    addRenderer(renderer) {
        this._renderers.push(renderer);
        this.emit("changed-renderer", {
            owner: this,
            renderer: renderer,
            isAdditionalChange: true
        });
    }
    removeRenderer(renderer) {
        const index = this._renderers.indexOf(renderer);
        if (index < 0) {
            return;
        }
        this._renderers.splice(index, 1);
        this.emit("changed-renderer", {
            owner: this,
            renderer: renderer,
            isAdditionalChange: false
        });
    }
    get Renderers() {
        return this._renderers;
    }
    addObject(targetObject) {
        this.children.push(targetObject);
        targetObject.ParentScene = this;
        this.notifySceneObjectChanged({
            owner: null,
            scene: this,
            isAdditionalChange: true,
            changedSceneObject: targetObject,
            changedSceneObjectID: targetObject.ID
        });
    }
    removeObject(removeTarget) {
        const index = this.children.indexOf(removeTarget);
        if (index >= 0) {
            this.children.splice(index, 1);
            removeTarget.ParentScene = null;
            this.notifySceneObjectChanged({
                owner: null,
                scene: this,
                isAdditionalChange: false,
                changedSceneObject: removeTarget,
                changedSceneObjectID: removeTarget.ID
            });
        }
    }
    /**
     * Append the camera to this scene as managed
     */
    addCamera(camera) {
        this._cameras[camera.ID] = camera;
    }
    /**
     * Get the camera managed in this scene.
     */
    getCamera(id) {
        return this._cameras[id];
    }
    notifySceneObjectChanged(eventArg) {
        this.sceneObjectStructureChanged.fire(this, eventArg);
    }
}
export default Scene;

//# sourceMappingURL=data:application/json;base64,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QUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ2xELEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQy9CLFlBQVksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1lBQ2hDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQztnQkFDNUIsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsa0JBQWtCLEVBQUUsS0FBSztnQkFDekIsa0JBQWtCLEVBQUUsWUFBWTtnQkFDaEMsb0JBQW9CLEVBQUUsWUFBWSxDQUFDLEVBQUU7YUFDdEMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztJQUNILENBQUM7SUFFRDs7T0FFRztJQUNJLFNBQVMsQ0FBQyxNQUFjO1FBQzdCLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQztJQUNwQyxDQUFDO0lBRUQ7O09BRUc7SUFDSSxTQUFTLENBQUMsRUFBVTtRQUN6QixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBRU0sd0JBQXdCLENBQUMsUUFBc0M7UUFDcEUsSUFBSSxDQUFDLDJCQUEyQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDeEQsQ0FBQztBQUNILENBQUM7QUFFRCxlQUFlLEtBQUssQ0FBQyIsImZpbGUiOiJDb3JlL1NjZW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGpUaHJlZU9iamVjdEVFV2l0aElEIGZyb20gXCIuLi9CYXNlL0pUaHJlZU9iamVjdEVFV2l0aElEXCI7XG5pbXBvcnQgSlRocmVlRXZlbnQgZnJvbSBcIi4uL0Jhc2UvSlRocmVlRXZlbnRcIjtcbmltcG9ydCBCYXNpY1JlbmRlcmVyIGZyb20gXCIuL1JlbmRlcmVycy9CYXNpY1JlbmRlcmVyXCI7XG5pbXBvcnQgU2NlbmVPYmplY3QgZnJvbSBcIi4vU2NlbmVPYmplY3RzL1NjZW5lT2JqZWN0XCI7XG5pbXBvcnQgQ2FtZXJhIGZyb20gXCIuL1NjZW5lT2JqZWN0cy9DYW1lcmEvQ2FtZXJhXCI7XG5pbXBvcnQgQ29sb3IzIGZyb20gXCIuLi9NYXRoL0NvbG9yM1wiO1xuaW1wb3J0IElTY2VuZU9iamVjdENoYW5nZWRFdmVudEFyZ3MgZnJvbSBcIi4vSVNjZW5lT2JqZWN0Q2hhbmdlZEV2ZW50QXJnc1wiO1xuaW1wb3J0IFJlbmRlcmVyTGlzdENoYW5nZWRFdmVudEFyZ3MgZnJvbSBcIi4vUmVuZGVyZXJMaXN0Q2hhbmdlZEV2ZW50QXJnc1wiO1xuXG4vKipcbiAqIFByb3ZpZGVzIHNjZW5lIGZlYXR1cmUuXG4gKi9cbmNsYXNzIFNjZW5lIGV4dGVuZHMgalRocmVlT2JqZWN0RUVXaXRoSUQge1xuXG4gIHB1YmxpYyBzY2VuZU9iamVjdFN0cnVjdHVyZUNoYW5nZWQ6IEpUaHJlZUV2ZW50PElTY2VuZU9iamVjdENoYW5nZWRFdmVudEFyZ3M+ID0gbmV3IEpUaHJlZUV2ZW50PElTY2VuZU9iamVjdENoYW5nZWRFdmVudEFyZ3M+KCk7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhpcyBzY2VuZSBuZWVkcyB1cGRhdGUgb3Igbm90LlxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICovXG4gIHB1YmxpYyBlbmFibGVkOiBib29sZWFuO1xuXG4gIHB1YmxpYyBjaGlsZHJlbjogU2NlbmVPYmplY3RbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBTY2VuZSBhbWJpZW50IGNvZWZmaWNpZW50c1xuICAgKi9cbiAgcHVibGljIHNjZW5lQW1iaWVudDogQ29sb3IzID0gbmV3IENvbG9yMygxLjAsIDEuMCwgMS4wKTtcblxuICBwcml2YXRlIF9yZW5kZXJlcnM6IEJhc2ljUmVuZGVyZXJbXSA9IFtdO1xuXG4gIHByaXZhdGUgX2NhbWVyYXM6IHsgW2lkOiBzdHJpbmddOiBDYW1lcmEgfSA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKGlkPzogc3RyaW5nKSB7XG4gICAgc3VwZXIoaWQpO1xuICAgIHRoaXMuZW5hYmxlZCA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogU2NlbmUgd2lsbCBiZSB1cGRhdGVkIGJ5IHRoaXMgbWV0aG9kLlxuICAgKiBUaGlzIG1ldGhvZCBpcyBpbnRlbmRlZCB0byBiZSBjYWxsZWQgYnkgalRocmVlIHN5c3RlbS5cbiAgICogWW91IGRvbid0IG5lZWQgdG8gY2FsbCB0aGlzIG1ldGhvZCBtYW51YWxseSBpbiBtb3N0IG9mIHVzZSBjYXNlLlxuICAgKi9cbiAgcHVibGljIHVwZGF0ZSgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuZW5hYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2godiA9PiB2LnVwZGF0ZSgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTY2VuZSB3aWxsIGJlIHJlbmRlcmVyZCBieSB0aGlzIG1ldGhvZC5cbiAgICogVGhpcyBtZXRob2QgaXMgaW50ZW5kZWQgdG8gYmUgY2FsbGVkIGJ5IGpUaHJlZSBzeXN0ZW0uXG4gICAqIFlvdSBkb24ndCBuZWVkIHRvIGNhbGwgdGhpcyBtZXRob2QgbWFudWFsbHkgaW4gbW9zdCBvZiB1c2UgY2FzZS5cbiAgICovXG4gIHB1YmxpYyByZW5kZXIoKTogdm9pZCB7XG4gICAgdGhpcy5fcmVuZGVyZXJzLmZvckVhY2goKHIpID0+IHtcbiAgICAgIHIuYmVmb3JlUmVuZGVyKCk7XG4gICAgICByLnJlbmRlcih0aGlzKTtcbiAgICAgIHIuYWZ0ZXJSZW5kZXIoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRSZW5kZXJlcihyZW5kZXJlcjogQmFzaWNSZW5kZXJlcik6IHZvaWQge1xuICAgIHRoaXMuX3JlbmRlcmVycy5wdXNoKHJlbmRlcmVyKTtcbiAgICB0aGlzLmVtaXQoXCJjaGFuZ2VkLXJlbmRlcmVyXCIsIDxSZW5kZXJlckxpc3RDaGFuZ2VkRXZlbnRBcmdzPntcbiAgICAgIG93bmVyOiB0aGlzLFxuICAgICAgcmVuZGVyZXI6IHJlbmRlcmVyLFxuICAgICAgaXNBZGRpdGlvbmFsQ2hhbmdlOiB0cnVlXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgcmVtb3ZlUmVuZGVyZXIocmVuZGVyZXI6IEJhc2ljUmVuZGVyZXIpOiB2b2lkIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuX3JlbmRlcmVycy5pbmRleE9mKHJlbmRlcmVyKTtcbiAgICBpZiAoaW5kZXggPCAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX3JlbmRlcmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIHRoaXMuZW1pdChcImNoYW5nZWQtcmVuZGVyZXJcIiwgPFJlbmRlcmVyTGlzdENoYW5nZWRFdmVudEFyZ3M+e1xuICAgICAgb3duZXI6IHRoaXMsXG4gICAgICByZW5kZXJlcjogcmVuZGVyZXIsXG4gICAgICBpc0FkZGl0aW9uYWxDaGFuZ2U6IGZhbHNlXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgZ2V0IFJlbmRlcmVycygpOiBCYXNpY1JlbmRlcmVyW10ge1xuICAgIHJldHVybiB0aGlzLl9yZW5kZXJlcnM7XG4gIH1cblxuICBwdWJsaWMgYWRkT2JqZWN0KHRhcmdldE9iamVjdDogU2NlbmVPYmplY3QpOiB2b2lkIHtcbiAgICB0aGlzLmNoaWxkcmVuLnB1c2godGFyZ2V0T2JqZWN0KTtcbiAgICB0YXJnZXRPYmplY3QuUGFyZW50U2NlbmUgPSB0aGlzO1xuICAgIHRoaXMubm90aWZ5U2NlbmVPYmplY3RDaGFuZ2VkKHtcbiAgICAgIG93bmVyOiBudWxsLFxuICAgICAgc2NlbmU6IHRoaXMsXG4gICAgICBpc0FkZGl0aW9uYWxDaGFuZ2U6IHRydWUsXG4gICAgICBjaGFuZ2VkU2NlbmVPYmplY3Q6IHRhcmdldE9iamVjdCxcbiAgICAgIGNoYW5nZWRTY2VuZU9iamVjdElEOiB0YXJnZXRPYmplY3QuSURcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyByZW1vdmVPYmplY3QocmVtb3ZlVGFyZ2V0OiBTY2VuZU9iamVjdCk6IHZvaWQge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5jaGlsZHJlbi5pbmRleE9mKHJlbW92ZVRhcmdldCk7XG4gICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgIHRoaXMuY2hpbGRyZW4uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIHJlbW92ZVRhcmdldC5QYXJlbnRTY2VuZSA9IG51bGw7XG4gICAgICB0aGlzLm5vdGlmeVNjZW5lT2JqZWN0Q2hhbmdlZCh7XG4gICAgICAgIG93bmVyOiBudWxsLFxuICAgICAgICBzY2VuZTogdGhpcyxcbiAgICAgICAgaXNBZGRpdGlvbmFsQ2hhbmdlOiBmYWxzZSxcbiAgICAgICAgY2hhbmdlZFNjZW5lT2JqZWN0OiByZW1vdmVUYXJnZXQsXG4gICAgICAgIGNoYW5nZWRTY2VuZU9iamVjdElEOiByZW1vdmVUYXJnZXQuSURcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBlbmQgdGhlIGNhbWVyYSB0byB0aGlzIHNjZW5lIGFzIG1hbmFnZWRcbiAgICovXG4gIHB1YmxpYyBhZGRDYW1lcmEoY2FtZXJhOiBDYW1lcmEpOiB2b2lkIHtcbiAgICB0aGlzLl9jYW1lcmFzW2NhbWVyYS5JRF0gPSBjYW1lcmE7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBjYW1lcmEgbWFuYWdlZCBpbiB0aGlzIHNjZW5lLlxuICAgKi9cbiAgcHVibGljIGdldENhbWVyYShpZDogc3RyaW5nKTogQ2FtZXJhIHtcbiAgICByZXR1cm4gdGhpcy5fY2FtZXJhc1tpZF07XG4gIH1cblxuICBwdWJsaWMgbm90aWZ5U2NlbmVPYmplY3RDaGFuZ2VkKGV2ZW50QXJnOiBJU2NlbmVPYmplY3RDaGFuZ2VkRXZlbnRBcmdzKTogdm9pZCB7XG4gICAgdGhpcy5zY2VuZU9iamVjdFN0cnVjdHVyZUNoYW5nZWQuZmlyZSh0aGlzLCBldmVudEFyZyk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2NlbmU7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
