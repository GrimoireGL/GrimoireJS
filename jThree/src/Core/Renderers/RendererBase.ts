import ContextManagerBase = require("./../ContextManagerBase");
import Delegates = require("../../Base/Delegates");
import Exceptions = require("../../Exceptions");
import GLContextWrapperBase = require("../../Wrapper/GLContextWrapperBase");
import jThreeObjectWithID = require("../../Base/JThreeObjectWithID");
import Camera = require("./../Camera/Camera");
import RenderStageManager = require('./RenderStageManager');
import JThreeEvent = require('../../Base/JThreeEvent');
import Rectangle = require('../../Math/Rectangle');
import JThreeContextProxy = require('../JThreeContextProxy');
import RendererConfiguratorBase = require("./RendererConfigurator/RendererConfiguratorBase");
import RendererConfigurator = require("./RendererConfigurator/BasicRendererConfigurator"); /**
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
        this.renderStageManager =new RenderStageManager(this);
        this.viewportArea = viewportArea;
        if (this.viewportArea) JThreeContextProxy.getJThreeContext().ResourceManager.createRBO(this.ID + ".rbo.default", this.viewportArea.Width, this.viewportArea.Height);
        JThreeContextProxy.getJThreeContext().ResourceManager.createFBO(this.ID + ".fbo.default");
        this.RenderStageManager.StageChains.push.apply(this.RenderStageManager.StageChains,configurator.getStageChain(this));
        this.RenderStageManager.TextureBuffers = configurator.TextureBuffers;
        this.RenderStageManager.generateAllTextures();
    }


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

    public render(drawAct: Delegates.Action0): void
    {
        throw new Exceptions.AbstractClassMethodCalledException();
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

    /**
     * Obtain the reference for wrapper of WebGLRenderingContext
     */
    public get GLContext(): GLContextWrapperBase
    {
        return this.contextManager.GLContext;
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
        this.GLContext.Flush();
        this.ContextManager.afterRender(this);
    }

    /**
    * Provides render stage abstraction
    */
    private renderStageManager: RenderStageManager;

    /**
     * Provides render stage abstraction
     */
    public get RenderStageManager(): RenderStageManager
    {
        return this.renderStageManager;
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
            JThreeContextProxy.getJThreeContext().ResourceManager.getRBO(this.ID + ".rbo.default").resize(area.Width, area.Height);
            this.onViewportChangedHandler.fire(this, area);
        }

    }

    /**
     * Apply viewport configuration
     */
    public applyViewportConfigure(): void
    {
        this.ContextManager.GLContext.ViewPort(this.viewportArea.Left, this.viewportArea.Top, this.viewportArea.Width, this.viewportArea.Height);
    }
}


export =RendererBase;
