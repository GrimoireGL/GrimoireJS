import jThreeObject = require("../Base/JThreeObject");
import Scene = require("./Scene");
class SceneManager extends jThreeObject {
    constructor() {
        super();
    }

    private scenes: Map<string, Scene> = new Map<string, Scene>();

    addScene(scene: Scene): void {
        if (!this.scenes.has(scene.ID)) {
            this.scenes.set(scene.ID, scene);
        }
    }

    removeScene(scene: Scene): void {
        if (this.scenes.has(scene.ID)) {
            this.scenes.delete(scene.ID);
        }
    }

    renderAll(): void {
        this.scenes.forEach((v) => {
            v.update();
            v.render();
        });
    }

}

export=SceneManager;
