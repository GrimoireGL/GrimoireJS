import jThreeObject = require("../Base/JThreeObject");
import JThreeContext = require("./JThreeContext");
import JThreeContextProxy = require("./JThreeContextProxy");
import Scene = require("./Scene");
import AssociativeArray = require('../Base/Collections/AssociativeArray')
/**
* The class for managing entire scenes.
*/
class SceneManager extends jThreeObject {
    constructor() {
        super();
    }

    private scenes:AssociativeArray<Scene> = new AssociativeArray<Scene>();
    /**
    * Add new scene to be managed.
    */
    addScene(scene: Scene): void {
        if (!this.scenes.has(scene.ID)) {
            this.scenes.set(scene.ID, scene);
        }
    }
    
    get Scenes()
    {
        return this.scenes.asArray;
    }

    /**
    *
    */
    removeScene(scene: Scene): void {
        if (this.scenes.has(scene.ID)) {
            this.scenes.delete(scene.ID);
        }
    }

    renderAll(): void {
      JThreeContextProxy.getJThreeContext().CanvasManagers.forEach((c)=>{c.beforeRenderAll()});
        this.scenes.forEach((v) => {
            v.update();
            v.render();
        });
        JThreeContextProxy.getJThreeContext().CanvasManagers.forEach((c)=>{c.afterRenderAll()});
    }

    public toString():string
    {
      console.log(this.scenes);
        var sceneInfo:string="";
        this.scenes.forEach((scene:Scene,id:string)=>
        {
          sceneInfo+=`ID:${id}\nScene:\n${scene.toString()}\n`;
        });
        return `Scene Informations:\n
        Scene Count:${this.scenes.size}\n
        Scenes:${sceneInfo}`;
    }

}

export=SceneManager;
