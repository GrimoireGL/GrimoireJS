import jThreeObject = require("../Base/JThreeObject");
import JThreeContextProxy = require("./JThreeContextProxy");
import Scene = require("./Scene");
import AssociativeArray = require('../Base/Collections/AssociativeArray')
/**
* The class for managing entire scenes.
*/
class SceneManager extends jThreeObject {
    constructor() {
        super();
        debugger;
        console.error("scene manager was instanciated!");
    }

    /**
     * All scene map. Hold by Scene.ID.
     */
    private scenes:AssociativeArray<Scene> = new AssociativeArray<Scene>();

    /**
    * Add new scene to be managed.
    */
    public addScene(scene: Scene): void {
        if (!this.scenes.has(scene.ID)) {
            this.scenes.set(scene.ID, scene);
        }
    }
    /**
     * All scene list this class is managing.
     */
    public get Scenes()
    {
        return this.scenes.asArray;
    }

    /**
    * Remove exisiting scene from managed.
    */
    public removeScene(scene: Scene): void {
        if (this.scenes.has(scene.ID)) {
            this.scenes.delete(scene.ID);
        }
    }

    /**
     * Process render for all scenes
     * This method is intended to be called by jThree system.
     * You don't need to call this method maually in most case.
     */
    public renderAll(): void {
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
