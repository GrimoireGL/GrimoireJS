import ContextManagerBase = require("./../ContextManagerBase");
import Delegates = require("../../Base/Delegates");
import Exceptions = require("../../Exceptions");
import jThreeObjectWithID = require("../../Base/JThreeObjectWithID");
import Camera = require("./../Camera/Camera");
import RenderPathExecutor = require('./RenderPathExecutor');
import JThreeEvent = require('../../Base/JThreeEvent');
import Rectangle = require('../../Math/Rectangle');
import RendererConfiguratorBase = require("./RendererConfigurator/RendererConfiguratorBase");
import RendererConfigurator = require("./RendererConfigurator/BasicRendererConfigurator");
import JThreeContext = require("../../JThreeContext");
import ContextComponents = require("../../ContextComponents");
import ResourceManager = require("../ResourceManager");
import Scene = require("../Scene");
import RenderPath = require("./RenderPath");
import Canvas = require("../Canvas");
import Debugger = require("../../Debug/Debugger");
 /**
 * Provides base class feature for renderer classes.
 */
class RendererBase extends jThreeObjectWithID
{
    /**
     * Constructor of RenderBase
     * @param contextManager
     * @param viewportArea
     * @returns {}
     */
    constructor(contextManager: ContextManagerBase, viewportArea: Rectangle, configurator?: RendererConfiguratorBase)
    {
        super();
        configurator = configurator || new RendererConfigurator();
        this.contextManager = contextManager;
        this.renderPathExecutor =new RenderPathExecutor(this);
        this.viewportArea = viewportArea;
        var rm = JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
        if (this.viewportArea) rm.createRBO(this.ID + ".rbo.default", this.viewportArea.Width, this.viewportArea.Height);
        rm.createFBO(this.ID + ".fbo.default");
        this.renderPath.path.push.apply(this.renderPath.path,configurator.getStageChain(this));
        this.RenderPathExecutor.TextureBuffers = configurator.TextureBuffers;
        this.RenderPathExecutor.generateAllTextures();
        this.name = this.ID;
        var canvas = contextManager as Canvas;
        canvas.canvasElement.addEventListener('mouseenter',this._mouseEnter.bind(this),false);
        canvas.canvasElement.addEventListener('mouseleave',this._mouseLeave.bind(this),false);
        canvas.canvasElement.addEventListener('mousemove',this._mouseMove.bind(this),false);

    }

    private _mouseEnter(e:MouseEvent)
    {
      this._checkMouseOver(e);
      var debug = JThreeContext.getContextComponent<Debugger>(ContextComponents.Debugger);
      debug.setInfo("MouseOver"+ this.name,this.mouseOver.toString());
    }

    private _mouseLeave(e:MouseEvent)
    {
      this.mouseOver = false;
      var debug = JThreeContext.getContextComponent<Debugger>(ContextComponents.Debugger);
      debug.setInfo("MouseOver"+ this.name,this.mouseOver.toString());
    }

    private _mouseMove(e:MouseEvent)
    {
      if(this._checkMouseOver(e))
      {

      }
    }

    private _checkMouseOver(e:MouseEvent):boolean
    {
      this.mouseOver = this.viewportArea.contains(e.layerX,e.layerY);
      var debug = JThreeContext.getContextComponent<Debugger>(ContextComponents.Debugger);
      debug.setInfo("MouseOver"+ this.name,this.mouseOver.toString());
      return this.mouseOver;
    }

    public mouseOver:boolean =false;

    public renderPath:RenderPath = new RenderPath();

    public name:string;
    /**
     * The camera reference this renderer using for draw.
     */
    private camera: Camera;
    /**
     * The camera reference this renderer using for draw.
     */
    public get Camera(): Camera
    {
        return this.camera;
    }
    /**
     * The camera reference this renderer using for draw.
     */
    public set Camera(camera: Camera)
    {
        this.camera = camera;
    }

    public render(scene:Scene): void
    {
      this.renderPathExecutor.processRender(scene,this.renderPath)
    }

    /**
     * ContextManager managing this renderer.
     */
    private contextManager: ContextManagerBase;

    /**
     * ContextManager managing this renderer.
     */
    public get ContextManager(): ContextManagerBase
    {
        return this.contextManager;
    }

    public get GL():WebGLRenderingContext
    {
      return this.contextManager.GL;
    }

    /**
     * It will be called before processing renderer.
     * If you need to override this method, you need to call same method of super class first.
     */
    public beforeRender()
    {
        this.applyViewportConfigure();
        this.ContextManager.beforeRender(this);
    }

    /**
     * It will be called after processing renderer.
     * If you need to override this method, you need to call same method of super class first.
     */
    public afterRender()
    {
        this.GL.flush();
        this.ContextManager.afterRender(this);
    }

    /**
    * Provides render stage abstraction
    */
    private renderPathExecutor: RenderPathExecutor;

    /**
     * Provides render stage abstraction
     */
    public get RenderPathExecutor(): RenderPathExecutor
    {
        return this.renderPathExecutor;
    }

    private onViewportChangedHandler: JThreeEvent<Rectangle> = new JThreeEvent<Rectangle>();//TODO argument should be optimized.

    /**
     * Register event handler to handle changing of viewport configure.
     * @param act the handler to recieve viewport changing.
     * @returns {}
     */
    public onViewPortChanged(act: Delegates.Action2<RendererBase, Rectangle>)
    {
        this.onViewportChangedHandler.addListener(act);
    }

    private viewportArea: Rectangle = new Rectangle(0, 0, 256, 256);

    /**
     * Getter for viewport area. Viewport area is the area to render.
     * @returns {Rectangle} the rectangle region to render.
     */
    public get ViewPortArea(): Rectangle
    {
        return this.viewportArea;
    }
    /**
     * Setter for viewport area. viewport area is the area to render.
     * @param area {Rectangle} the rectangle to render.
     */
    public set ViewPortArea(area: Rectangle)
    {
        if (!Rectangle.Equals(area, this.viewportArea) && (typeof area.Width !== 'undefined') && (typeof area.Height !== 'undefined'))
        {
            if (isNaN(area.Height + area.Width)) return;
            this.viewportArea = area;
            JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager).getRBO(this.ID + ".rbo.default").resize(area.Width, area.Height);
            this.onViewportChangedHandler.fire(this, area);
        }

    }

    /**
     * Apply viewport configuration
     */
    public applyViewportConfigure(): void
    {
        this.GL.viewport(this.viewportArea.Left, this.viewportArea.Top, this.viewportArea.Width, this.viewportArea.Height);
    }
}


export =RendererBase;
