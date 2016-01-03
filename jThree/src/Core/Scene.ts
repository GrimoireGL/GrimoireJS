import jThreeObjectWithID = require("../Base/JThreeObjectWithID");
import JThreeEvent = require('../Base/JThreeEvent');
import BasicRenderer = require("./Renderers/BasicRenderer");
import SceneObject = require("./SceneObject");
import Camera = require("./Camera/Camera");
import AssociativeArray = require('../Base/Collections/AssociativeArray');
import LightBase = require('./Light/LightBase')
import Delegates =require('../Base/Delegates')
import LightRegister = require('./Light/LightRegister');
import PointLight = require("./Light/Impl/PointLight");
import DirectionalLight = require("./Light/Impl/DirectionalLight");
import Color3 = require("../Math/Color3");
import AreaLight = require("./Light/Impl/AreaLight");
import SpotLight = require("./Light/Impl/SpotLight");
import ISceneObjectChangedEventArgs = require("./ISceneObjectChangedEventArgs");
import RendererListChangedEventArgs = require("./RendererListChangedEventArgs");

/**
 * Provides scene feature.
 */
class Scene extends jThreeObjectWithID {
    constructor(id?:string) {
        super(id);
        this.enabled = true;
        this.lightRegister = new LightRegister(this);
    }

    public sceneObjectStructureChanged:JThreeEvent<ISceneObjectChangedEventArgs> = new JThreeEvent<ISceneObjectChangedEventArgs>();

    /**
     * Whether this scene needs update or not.
     * @type {boolean}
     */
    public enabled: boolean;

    /**
     * The class managing lights of this scene.
     * @type {LightRegister}
     */
    private lightRegister: LightRegister;

    /**
     * The class managing lights of this scene.
     */
    public get LightRegister() {
        return this.lightRegister;
    }

    /**
     * Scene will be updated by this method.
     * This method is intended to be called by jThree system.
     * You don't need to call this method manually in most of use case.
     */
    public update(): void {
        if (!this.enabled) return;
        this.children.forEach(v=> v.update());
    }

    /**
     * Scene will be rendererd by this method.
     * This method is intended to be called by jThree system.
     * You don't need to call this method manually in most of use case.
     */
    public render(): void {
        this.renderers.forEach((r) => {
            r.beforeRender();
            this.lightRegister.updateLightForRenderer(r);
            r.render(this);
            r.afterRender();
        });
    }

    public rendererListChanged:JThreeEvent<RendererListChangedEventArgs>=new JThreeEvent<RendererListChangedEventArgs>();

    private renderers: BasicRenderer[] = [];

    public addRenderer(renderer: BasicRenderer): void {
        this.renderers.push(renderer);
        this.rendererListChanged.fire(this,{
          owner:this,
          renderer:renderer,
          isAdditionalChange:true
        });
    }

    public get Renderers():BasicRenderer[]
    {
        return this.renderers;
    }

    public children: SceneObject[] = [];


    public addLight(light:LightBase):void
    {
        this.lightRegister.addLight(light);
    }

    public addObject(targetObject: SceneObject): void {
        this.children.push(targetObject);
        targetObject.ParentScene = this;
        this.notifySceneObjectChanged({
          owner:null,
          scene:this,
          isAdditionalChange:true,
          changedSceneObject:targetObject,
          changedSceneObjectID:targetObject.ID
        });
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
        return `Scene\nRenderers:\nRendererCount:${this.renderers.length}\nCamera Count:${this.cameras.size}\nSceneObjects:\nSceneObjectCount:${this.children.length}\n`;
    }

    /**
     * Scene ambient coefficients
     */
    public sceneAmbient:Color3 = new Color3(0.1,0.1,0.1);

    public notifySceneObjectChanged(eventArg:ISceneObjectChangedEventArgs)
    {
      this.sceneObjectStructureChanged.fire(this,eventArg);
    }
}

export =Scene;
