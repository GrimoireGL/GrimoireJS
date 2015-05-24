import ContextTimer = require("./ContextTimer");
import GomlLoader = require("../Goml/GomlLoader");
import Delegates = require("Delegates");
import ResourceManager = require("./ResourceManager");
import CanvasManager = require("./CanvasManager");
import JThreeObject = require("../Base/JThreeObject");
import RendererListChangedEventArgs = require("./RendererListChangedEventArgs");
import SceneManager = require("./SceneManager");
import RendererStateChangedType = require("./RendererStateChangedType");
import AnimaterBase = require("../Goml/Animater/AnimaterBase");
import JThreeCollection = require("../Base/JThreeCollection");
class JThreeContext extends JThreeObject {
    private canvasManagers: CanvasManager[] = [];
    private onRendererChangedFuncs:Delegates.Action1<RendererListChangedEventArgs>[]=[];
    private resourceManager: ResourceManager;
    private timer: ContextTimer;
    private sceneManager: SceneManager;
    private gomlLoader:GomlLoader;
    private registerNextLoop:Delegates.Action0;
    private animaters:JThreeCollection<AnimaterBase>=new JThreeCollection<AnimaterBase>();

    public addAnimater(animater:AnimaterBase):void
    {
      this.animaters.insert(animater);
    }

    private updateAnimation():void
    {
      var time=this.timer.Time;
      this.animaters.each(v=>{
        if(v.update(time))this.animaters.delete(v);
      });
    }

    static instance:JThreeContext=new JThreeContext();
    static getInstanceForProxy()
    {
      JThreeContext.instance=JThreeContext.instance||new JThreeContext();
      return JThreeContext.instance;
    }

    get SceneManager(): SceneManager {
        return this.sceneManager;
    }

    get GomlLoader(): GomlLoader {
        return this.gomlLoader;
    }

    constructor() {
        super();
        this.resourceManager = new ResourceManager();
        this.timer = new ContextTimer();
        this.sceneManager = new SceneManager();
        this.gomlLoader = new GomlLoader();
    }

    /**
     * Begin render loop
     * @returns {}
     */
    init() {
      this.gomlLoader.initForPage();
      this.registerNextLoop=window.requestAnimationFrame?()=>{
        var context=JThreeContext.instance;
        window.requestAnimationFrame(context.loop);
        }:()=>{
          var context=JThreeContext.instance;
          window.setTimeout(context.loop,1000/60);
          };
      this.loop();
    }

    loop(): void {
      var context=JThreeContext.instance;
      context.timer.updateTimer();
      context.updateAnimation();
      context.sceneManager.renderAll();
      context.registerNextLoop();
    }

    /**
     * Getter of canvas renderer.
     */
    get CanvasManagers(): CanvasManager[] {
        return this.canvasManagers;
    }

    get Timer(): ContextTimer {
        return this.timer;
    }

    /**
     * The class managing resources over multiple canvas(Buffer,Shader,Program,Texture)
     */
    get ResourceManager(): ResourceManager {
        return this.resourceManager;
    }

    /**
     * Add renderers to be managed by jThree
     */
    addCanvasManager(renderer: CanvasManager):void {
        if (this.canvasManagers.indexOf(renderer) === -1) {
            this.canvasManagers.push(renderer);
            this.notifyRendererChanged(new RendererListChangedEventArgs(RendererStateChangedType.Add, renderer));
        }
    }

    /**
     * Remove renderer
     */
    removeCanvasManager(renderer: CanvasManager): void {
        if (this.canvasManagers.indexOf(renderer) !== -1) {
            for (var i = 0; i < this.canvasManagers.length; i++) {
                if (this.canvasManagers[i] === renderer)
                {
                    this.canvasManagers.splice(i, 1);
                    break;
                }
            }
            this.notifyRendererChanged(new RendererListChangedEventArgs(RendererStateChangedType.Delete, renderer));
        }
    }

    /**
     * add function as renderer changed event handler.
     */
    onRendererChanged(func:Delegates.Action1<RendererListChangedEventArgs>): void {
        if (this.onRendererChangedFuncs.indexOf(func) === -1) {
            this.onRendererChangedFuncs.push(func);
        }
    }

    /**
     * notify all event handlers
     */
    protected notifyRendererChanged(arg:RendererListChangedEventArgs): void {
        this.onRendererChangedFuncs.forEach((v, i, a) => v(arg));
    }
}

export=JThreeContext;
