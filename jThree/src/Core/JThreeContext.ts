import ContextTimer = require("./ContextTimer");
import GomlLoader = require("../Goml/GomlLoader");
import Delegates = require("Delegates");
import ResourceManager = require("./ResourceManager");
import CanvasManager = require("./CanvasManager");
import JThreeObject = require("../Base/JThreeObject");
import RendererListChangedEventArgs = require("./RendererListChangedEventArgs");
import SceneManager = require("./SceneManager");
import RendererStateChangedType = require("./RendererStateChangedType");
class JThreeContext extends JThreeObject {
    private canvasRenderers: CanvasManager[] = [];
    private onRendererChangedFuncs:Delegates.Action1<RendererListChangedEventArgs>[]=[];
    private resourceManager: ResourceManager;
    private timer: ContextTimer;
    private sceneManager: SceneManager;
    private gomlLoader:GomlLoader;

    static instance:JThreeContext;
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
      this.loop();
    }

    loop(): void {
      var context=JThreeContext.instance;
      context.sceneManager.renderAll();
        window.setTimeout(JThreeContext.instance.loop, 1000 / 30);
    }

    /**
     * Getter of canvas renderer.
     */
    get CanvasRenderers(): CanvasManager[] {
        return this.canvasRenderers;
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
    addRenderer(renderer: CanvasManager):void {
      console.log("adding renderer");
        if (this.canvasRenderers.indexOf(renderer) === -1) {
            this.canvasRenderers.push(renderer);
            this.notifyRendererChanged(new RendererListChangedEventArgs(RendererStateChangedType.Add, renderer));
        }
    }

    /**
     * Remove renderer
     */
    removeRenderer(renderer: CanvasManager): void {
        if (this.canvasRenderers.indexOf(renderer) !== -1) {
            for (var i = 0; i < this.canvasRenderers.length; i++) {
                if (this.canvasRenderers[i] === renderer)
                {
                    this.canvasRenderers.splice(i, 1);
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
