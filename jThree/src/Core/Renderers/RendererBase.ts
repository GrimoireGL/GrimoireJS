import ContextManagerBase = require("./../ContextManagerBase");
import Delegates = require("../../Base/Delegates");
import Exceptions = require("../../Exceptions");
import GLContextWrapperBase = require("../../Wrapper/GLContextWrapperBase");
import jThreeObjectWithID = require("../../Base/JThreeObjectWithID");
import Camera = require("./../Camera/Camera");
import RenderStageManager = require('./RenderStageManager');
import JThreeEvent = require('../../Base/JThreeEvent');
import Rectangle = require('../../Math/Rectangle'); /**
 * Provides base class feature for renderer classes.
 */
class RendererBase extends jThreeObjectWithID {

    constructor(contextManager: ContextManagerBase) {
        super();
        this.contextManager = contextManager;
    }


    /**
     * The camera reference this renderer using for draw.
     */
    private camera: Camera;
    /**
     * The camera reference this renderer using for draw.
     */
    public get Camera(): Camera {
        return this.camera;
    }
    /**
     * The camera reference this renderer using for draw.
     */
    public set Camera(camera: Camera) {
        this.camera = camera;
    }

    public enabled: boolean;

    public render(drawAct: Delegates.Action0): void {
        throw new Exceptions.AbstractClassMethodCalledException();
    }

    /**
     * ContextManager managing this renderer.
     */
    private contextManager: ContextManagerBase;
    
    /**
     * ContextManager managing this renderer.
     */
    public get ContextManager(): ContextManagerBase {
        return this.contextManager;
    }
    
    /**
     * Obtain the reference for wrapper of WebGLRenderingContext
     */
    public get GLContext(): GLContextWrapperBase {
        return this.contextManager.GLContext;
    }
    
    /**
     * It will be called before processing renderer.
     * If you need to override this method, you need to call same method of super class first. 
     */
    public beforeRender() {
        this.ContextManager.beforeRender(this);
    }

    /**
     * It will be called after processing renderer.
     * If you need to override this method, you need to call same method of super class first. 
     */
    public afterRender() {
        this.ContextManager.afterRender(this);
    }

    /**
    * Provides render stage abstraction
    */
    private renderStageManager: RenderStageManager = new RenderStageManager(this);
    
    /**
     * Provides render stage abstraction
     */
    public get RenderStageManager(): RenderStageManager {
        return this.renderStageManager;
    }

    protected onResizeHandler: JThreeEvent<Rectangle> = new JThreeEvent<Rectangle>();//TODO argument should be optimized.
    
    public onResize(act: Delegates.Action2<RendererBase, Rectangle>) {
        this.onResizeHandler.addListerner(act);
    }
}


export =RendererBase;
