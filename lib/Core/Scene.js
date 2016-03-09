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
