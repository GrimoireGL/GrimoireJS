import jThreeObjectEE from "../Base/JThreeObjectEE";
import ContextComponents from "../ContextComponents";
import JThreeContext from "../JThreeContext";
/**
* The class for managing entire _scenes.
*/
class SceneManager extends jThreeObjectEE {
    constructor() {
        super();
        /**
         * All scene map. Hold by Scene.ID.
         */
        this._scenes = {};
        const loopManager = JThreeContext.getContextComponent(ContextComponents.LoopManager);
        loopManager.addAction(5000, () => this.renderAll());
    }
    getContextComponentIndex() {
        return ContextComponents.SceneManager;
    }
    /**
    * Add new scene to be managed.
    */
    addScene(scene) {
        if (!this._scenes[scene.ID]) {
            this._scenes[scene.ID] = scene;
            this.emit("change", {
                owner: this,
                isAdditionalChange: true,
                changedScene: scene
            });
        }
    }
    /**
     * All scene list this class is managing.
     */
    get Scenes() {
        const array = [];
        for (let scene in this._scenes) {
            array.push(this._scenes[scene]);
        }
        return array;
    }
    /**
    * Remove exisiting scene from managed.
    */
    removeScene(scene) {
        if (this._scenes[scene.ID]) {
            delete this._scenes[scene.ID];
            this.emit("change", {
                owner: this,
                isAdditionalChange: false,
                changedScene: scene
            });
        }
    }
    /**
     * Process render for all _scenes
     * This method is intended to be called by jThree system.
     * You don't need to call this method maually in most case.
     */
    renderAll() {
        for (let sceneId in this._scenes) {
            const scene = this._scenes[sceneId];
            scene.update();
            scene.render();
        }
    }
}
export default SceneManager;
