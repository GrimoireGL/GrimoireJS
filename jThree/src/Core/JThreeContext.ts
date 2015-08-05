import ContextTimer = require("./ContextTimer");
import Timer = require("./Timer");
import GomlLoader = require("../Goml/GomlLoader");
import Delegates = require("../Base/Delegates");
import ResourceManager = require("./ResourceManager");
import CanvasManager = require("./CanvasManager");
import JThreeObject = require("../Base/JThreeObject");
import CanvasListChangedEventArgs = require("./CanvasListChangedEventArgs");
import SceneManager = require("./SceneManager");
import ListStateChangedType = require("./ListStateChangedType");
import AnimaterBase = require("../Goml/Animater/AnimaterBase");
import JThreeCollection = require("../Base/JThreeCollection");
import JThreeEvent = require("../Base/JThreeEvent");
class JThreeContext extends JThreeObject
{
    private static instance:JThreeContext=new JThreeContext();
    
    /**
    * Every user of this library should not call this method.
    * You should use JThreeContextProxy.getInstance() instead of this function.
    *
    * If you want to know more, please see the doc comment of JThreeContextProxy
    */
    static getInstanceForProxy()
    {
      JThreeContext.instance=JThreeContext.instance||new JThreeContext();
      return JThreeContext.instance;
    }

    private canvasManagers: CanvasManager[] = [];
    private resourceManager: ResourceManager;
    private timer: ContextTimer;
    private sceneManager: SceneManager;
    private gomlLoader:GomlLoader;
    private registerNextLoop:Delegates.Action0;
    private animaters:JThreeCollection<AnimaterBase>=new JThreeCollection<AnimaterBase>();
    private canvasChangedEvent:JThreeEvent<CanvasListChangedEventArgs>=new JThreeEvent<CanvasListChangedEventArgs>();

    public addAnimater(animater:AnimaterBase):void
    {
      this.animaters.insert(animater);
    }

    private updateAnimation():void
    {
      var time=this.timer.Time;
      this.animaters.each(v=>{
        if(v.update(time))this.animaters.del(v);
      });
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
     * Begin render loop.
     * In most of case, you no need to call this function by your self.
     */
    init() {
      //By calling this method,Gomlloader will start to load the content related to GOML.
      this.gomlLoader.initForPage();
      //register the render loop.
      //In this step, it decide how to call next frame.
      //If the device is supporting requestAnimationFrame,
      // render loop should be managed by requestAnimationFrame.
      //It is rare case but, if the device is not supporting requestAnimationFrame,
      // render loop should be managed by setTimeout.
      //This is link to the table that shows us which browser and device can use this feature or not.
      //http://caniuse.com/#feat=requestanimationframe
      this.registerNextLoop=
        window.requestAnimationFrame //if window.requestAnimationFrame is defined or undefined
          ?
        　()=>{//When window.requestAnimationFrame is supported
        　window.requestAnimationFrame(this.loop.bind(this));
        　}
        　:
        　()=>{//When window.requestAnimationFrame is not supported.
        　  window.setTimeout(this.loop.bind(this),1000/60);
        　  };
      //starts the first loop.
      this.loop();
    }

    /**
    * The main loop for rendering and updating scenes managed by jThree.
    * In most of case you no need to call this function by yourself.
    */
    loop(): void {
      //update timer it will be referenced by scenes.
      this.timer.updateTimer();
      this.updateAnimation();
      this.gomlLoader.update();
      this.sceneManager.renderAll();
      this.registerNextLoop();
    }

    /**
     * Getter of canvas renderer.
     */
    get CanvasManagers(): CanvasManager[] {
        return this.canvasManagers;
    }
    /**
    * Getter of Timer
    */
    get Timer(): Timer {
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
            this.canvasChangedEvent.fire(this,new CanvasListChangedEventArgs(ListStateChangedType.Add,renderer));
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
            this.canvasChangedEvent.fire(this,new CanvasListChangedEventArgs(ListStateChangedType.Delete,renderer));
        }
    }

    /**
     * add function as renderer changed event handler.
     */
    onRendererChanged(func:Delegates.Action2<any,CanvasListChangedEventArgs>): void {
        this.canvasChangedEvent.addListerner(func);
    }
}

export=JThreeContext;
