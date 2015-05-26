import jThreeObject = require("../Base/JThreeObject");
import JThreeContext = require("./JThreeContext");
import JThreeContextProxy = require("./JThreeContextProxy");
import Scene = require("./Scene");
/**
* The class for managing entire scenes.
*/
class SceneManager extends jThreeObject {
    constructor() {
        super();
    }

    private scenes:Map<string, Scene> = new Map<string, Scene>();
    /**
    * Add new scene to be managed.
    */
    addScene(scene: Scene): void {
        if (!this.scenes.has(scene.ID)) {
            this.scenes.set(scene.ID, scene);
        }
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
          sceneInfo+="ID:{0}\nScene:\n{1}\n".format(id,scene.toString());
        });
        return "Scene Informations:\n"
              +"Scene Count:{0}\n"
              +"Scenes:\n{1}".format(this.scenes.size,sceneInfo);
    }

}

export=SceneManager;
