import jThreeObjectWithID = require("../Base/JThreeObjectWithID");
import jThreeId = require("../Base/JThreeID");
import JThreeEvent = require('../Base/JThreeEvent');
import RendererBase = require("./Renderers/RendererBase");
import Material = require("./Materials/Material");
import SceneObject = require("./SceneObject");
import Camera = require("./Camera/Camera");
import PointLight = require('./Light/PointLight');
import Color4 = require('../Base/Color/Color4');
import Vector3 = require('../Math/Vector3');
import AssociativeArray = require('../Base/Collections/AssociativeArray');
import LightBase = require('./Light/LightBase')
import Delegates =require('../Delegates')
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

    enabled: boolean;

    update(): void {
        if (!this.enabled) return;//enabled==falseならいらない。
        this.sceneObjects.forEach(v=> v.update());
    }

    render(): void {
        this.renderers.forEach((r) => {
            r.beforeRender();
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

    private renderPairs: MaterialObjectPair[] = [];

    private sceneObjects: SceneObject[] = [];
    
    private lights:AssociativeArray<LightBase[]>=new AssociativeArray<LightBase[]>();
    
    private lightCount:number=0;
    
    public getLights(alias:string):LightBase[]
    {
        var lights= this.lights.get(alias);
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
        targetObject.eachMaterial((m) => { this.renderPairs.push(new MaterialObjectPair(m, targetObject)) });
        this.sortObjects();
    }

    public addRenderQueue(targetObject: SceneObject): void {
        targetObject.eachMaterial((m) => { this.renderPairs.push(new MaterialObjectPair(m, targetObject)) });
        this.sortObjects();
    }

    private sortObjects(): void {
        //sort renderPairs by order of rendering
        this.renderPairs.sort((v1, v2) => { return v1.Material.Priorty - v2.Material.Priorty });
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
        return `Scene\nRenderers:\nRendererCount:${this.renderers.length}\nCamera Count:${this.cameras.size}\nSceneObjects:\nSceneObjectCount:${this.sceneObjects.length}\nSceneObjectCount by Material:${this.renderPairs.length}\n`;
    }
}

export =Scene;
