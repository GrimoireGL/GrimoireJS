import jThreeObject = require("../Base/JThreeObject");
import JThreeContext = require("./JThreeContext");
import JThreeContextProxy = require("./JThreeContextProxy");
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
      JThreeContextProxy.getJThreeContext().CanvasRenderers.forEach((c)=>{c.beforeRenderAll()});
        this.scenes.forEach((v) => {
            v.update();
            v.render();
        });
        JThreeContextProxy.getJThreeContext().CanvasRenderers.forEach((c)=>{c.afterRenderAll()});
    }

}

export=SceneManager;
