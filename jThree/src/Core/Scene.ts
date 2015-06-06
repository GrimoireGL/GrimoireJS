import jThreeObjectWithID = require("../Base/JThreeObjectWithID");
import jThreeId = require("../Base/JThreeID");
import RendererBase = require("./RendererBase");
import Material = require("./Materials/Material");
import SceneObject = require("./SceneObject");
import Camera = require("./Camera/Camera");
/**
* NON PUBLIC CLASS
*/
class MaterialObjectPair {
    constructor(material: Material, targetObject: SceneObject) {
        this.material = material;
        this.targetObject = targetObject;
    }

    private material: Material;
       private targetObject: SceneObject;

    get Material(): Material {
        return this.material;
    }

    get TargetObject(): SceneObject {
        return this.targetObject;
    }

    get ID(): string {
        return this.material.ID + "-" + this.targetObject.ID;
    }
}

//シーン
class Scene extends jThreeObjectWithID {
    constructor() {
        super();
        this.enabled = true;
    }

    enabled:boolean;

    update(): void {
        if (!this.enabled) return;//enabled==falseならいらない。
        this.sceneObjects.forEach(v=>v.update());
    }

    render(): void {
        this.renderers.forEach((r) => {
            r.render(() => {
                this.renderPairs.forEach((v) => v.TargetObject.render(r, v.Material));
            });
        });
    }

    private renderers: RendererBase[] = [];

    public addRenderer(renderer: RendererBase): void {
        this.renderers.push(renderer);
    }

    private renderPairs: MaterialObjectPair[] = [];

    private sceneObjects:SceneObject[]=[];

    public addObject(targetObject: SceneObject): void {
        //TargetObjectに所属するマテリアルを分割して配列に登録します。
        this.sceneObjects.push(targetObject);
        targetObject.eachMaterial((m) => { this.renderPairs.push(new MaterialObjectPair(m, targetObject)) });
        this.sortObjects();
    }

    public addRenderQueue(targetObject:SceneObject):void
    {
      targetObject.eachMaterial((m) => { this.renderPairs.push(new MaterialObjectPair(m, targetObject)) });
      this.sortObjects();
    }

    private sortObjects(): void {
      //sort renderPairs by order of rendering
        this.renderPairs.sort((v1, v2) => { return v1.Material.Priorty - v2.Material.Priorty });
    }

    private cameras:Map<string,Camera>=new Map<string,Camera>();

    public addCamera(camera:Camera)
    {
      this.cameras.set(camera.ID,camera);
    }

    public getCamera(id:string):Camera
    {
      return this.cameras.get(id);
    }

    public toString():string
    {
      console.log(this);
      return `Scene\nRenderers:\nRendererCount:${this.renderers.length}\nCamera Count:${this.cameras.size}\nSceneObjects:\nSceneObjectCount:${this.sceneObjects.length}\nSceneObjectCount by Material:${this.renderPairs.length}\n`;
    }
}

export=Scene;
