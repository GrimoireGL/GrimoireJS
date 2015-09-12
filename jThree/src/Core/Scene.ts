import jThreeObjectWithID = require("../Base/JThreeObjectWithID");
import JThreeEvent = require('../Base/JThreeEvent');
import RendererBase = require("./Renderers/RendererBase");
import SceneObject = require("./SceneObject");
import Camera = require("./Camera/Camera");
import AssociativeArray = require('../Base/Collections/AssociativeArray');
import LightBase = require('./Light/LightBase')
import Delegates =require('../Base/Delegates')
import LightRegister = require('./Light/LightRegister');
import PointLight = require("./Light/Impl/PointLight");
import DirectionalLight = require("./Light/Impl/DirectionalLight");
import Color3 = require("../Base/Color/Color3");
import AreaLight = require("./Light/Impl/AreaLight");
class Scene extends jThreeObjectWithID {
    constructor() {
        super();
        this.enabled = true;
        this.lightRegister = new LightRegister(this);
        //TODO Remove parameter registration
        var pointParam = PointLight.TypeDefinition;
        var dp = DirectionalLight.TypeDefinition;
        this.lightRegister.addLightType(pointParam);
        this.lightRegister.addLightType(dp);
        this.lightRegister.addLightType(AreaLight.TypeDefinition);
        console.log(this.lightRegister.DiffuseShaderCodeComposer.ShaderCode);
    }

    public enabled: boolean;

    private lightRegister: LightRegister;

    public get LightRegister() {
        return this.lightRegister;
    }

    public update(): void {
        if (!this.enabled) return;//enabled==falseならいらない。
        this.sceneObjects.forEach(v=> v.update());
    }

    public render(): void {
        this.renderers.forEach((r) => {
            r.beforeRender();
            this.lightRegister.updateLightForRenderer(r);
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


    public addLight(light:LightBase):void
    {
        this.lightRegister.addLight(light);
    }

    public addObject(targetObject: SceneObject): void {
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

    /**
     * Scene ambient coefficients
     */
    public sceneAmbient:Color3 = new Color3(0.1,0.1,0.1);
}

export =Scene;
