import jThreeObjectWithID = require("../Base/JThreeObjectWithID");
import JThreeEvent = require('../Base/JThreeEvent');
import RendererBase = require("./Renderers/RendererBase");
import SceneObject = require("./SceneObject");
import Camera = require("./Camera/Camera");
import AssociativeArray = require('../Base/Collections/AssociativeArray');
import LightBase = require('./Light/LightBase')
import Delegates =require('../Base/Delegates')
import LightRegister = require('./Light/LightRegister');
//シーン
class Scene extends jThreeObjectWithID {
    constructor() {
        super();
        this.enabled = true;
        this.lightRegister = new LightRegister(this);
    }

    public enabled: boolean;

    private lightRegister:LightRegister;

    public update(): void {
        if (!this.enabled) return;//enabled==falseならいらない。
        this.sceneObjects.forEach(v=> v.update());
    }

    public render(): void {
        this.renderers.forEach((r) => {

            r.beforeRender();
            this.lightRegister.updateLightForRenderer();
            r.RenderStageManager.processRender(this,this.sceneObjects);
            r.afterRender();
        });
    }
    
    private rendererChanged:JThreeEvent<RendererBase>=new JThreeEvent<RendererBase>();

    private renderers: RendererBase[] = [];

    public addRenderer(renderer: RendererBase): void {
        this.renderers.push(renderer);
        this.rendererChanged.fire(this,renderer);
    }
    
    public rendererAdded(act:Delegates.Action2<Scene,RendererBase>)
    {
        this.rendererChanged.addListerner(act);
    }
    
    public get Renderers():RendererBase[]
    {
        return this.renderers;
    }

    private sceneObjects: SceneObject[] = [];
    
    private lights:AssociativeArray<LightBase[]>=new AssociativeArray<LightBase[]>();
    
    private lightCount:number=0;
    
    public getLights(ns:string):LightBase[]
    {
        var lights= this.lights.get(ns);
        if(!lights)return [];
        return lights;
    }
    
    public getLightByIndex(index:number):LightBase
    {
        var i=0;
        var target:LightBase;
        this.lights.forEach(
            v=>
            {
                v.forEach(e=>{
                   if(i==index)
                   {
                       target=e;
                   }
                   i++;
                });
            }
        );
        return target;
    }
    
    public get LightCount():number
    {
        return this.lightCount;
    }
    
    public addLight(light:LightBase):void
    {
        this.lightCount++;
        this.lightRegister.addLight(light);
        if(!this.lights.has(light.AliasName))
        {
            this.lights.set(light.AliasName,[light]);
            return;
        }
        this.lights.get(light.AliasName).push(light);
    }

    public addObject(targetObject: SceneObject): void {
        //TargetObjectに所属するマテリアルを分割して配列に登録します。
        this.sceneObjects.push(targetObject);
    }

    private cameras: AssociativeArray<Camera>=new AssociativeArray<Camera>();
    
    /**
     * Append the camera to this scene as managed
     */
    public addCamera(camera: Camera) {
        this.cameras.set(camera.ID, camera);
    }
    
    /**
     * Get the camera managed in this scene.
     */
    public getCamera(id: string): Camera {
        return this.cameras.get(id);
    }

    public toString(): string {
        console.log(this);
        return `Scene\nRenderers:\nRendererCount:${this.renderers.length}\nCamera Count:${this.cameras.size}\nSceneObjects:\nSceneObjectCount:${this.sceneObjects.length}\n`;
    }
}

export =Scene;
