import jThreeObjectEE = require("../Base/JThreeObjectEE");
import Scene = require("./Scene");
import IContextComponent = require("../IContextComponent");
import ContextComponents = require("../ContextComponents");
import JThreeEvent = require("../Base/JThreeEvent");
import ISceneListChangedEventArgs = require("./ISceneListChangedEventArgs");

/**
* The class for managing entire scenes.
*/
class SceneManager extends jThreeObjectEE implements IContextComponent {

    /**
     * All scene map. Hold by Scene.ID.
     */
    private scenes: { [sceneID: string]: Scene } = {};

    public getContextComponentIndex(): number {
        return ContextComponents.SceneManager;
    }

    /**
    * Add new scene to be managed.
    */
    public addScene(scene: Scene): void {
        if (!this.scenes[scene.ID]) {
            this.scenes[scene.ID] = scene;
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
    public get Scenes() {
        const array = [];
        for (let scene in this.scenes) {
            array.push(this.scenes[scene]);
        }
        return array;
    }

    /**
    * Remove exisiting scene from managed.
    */
    public removeScene(scene: Scene): void {
        if (this.scenes[scene.ID]) {
            delete this.scenes[scene.ID];
            this.emit("change", {
                owner: this,
                isAdditionalChange: false,
                changedScene: scene
            });
        }
    }

    /**
     * Process render for all scenes
     * This method is intended to be called by jThree system.
     * You don't need to call this method maually in most case.
     */
    public renderAll(): void {
        for (let sceneId in this.scenes) {
            const scene = this.scenes[sceneId];
            scene.update();
            scene.render();
        }
    }

}

export = SceneManager;
