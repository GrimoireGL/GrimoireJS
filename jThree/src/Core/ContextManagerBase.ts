import GLContextWrapperBase = require("../Wrapper/GLContextWrapperBase");
import jThreeObjectId = require("../Base/JThreeObjectWithID");
import RendererBase = require("./Renderers/RendererBase");
import GLExtensionManager = require('./GLExtensionManager');
import Color4 = require('../Base/Color/Color4');
/**
 * Provides base interface for the classes managing GLcontext
 */
class ContextManagerBase extends jThreeObjectId {
    constructor() {
        super();
    }
    
    private context: GLContextWrapperBase;
    
    private extensions:GLExtensionManager=new GLExtensionManager();
    
    protected setContext(context:GLContextWrapperBase)
    {
        this.context=context;
        this.extensions.checkExtensions(context);
    }

    public get Context(): GLContextWrapperBase {
        return this.context;
    }

    /**
     * Called before rendering. It needs super.beforeRenderer(renderer) when you need to override.
     */
    public beforeRender(renderer: RendererBase): void {

    }

    /**
     * Called after rendering. It needs super.afterRenderer(renderer) when you need to override.
     */
    public afterRender(renderer: RendererBase): void {

    }

    /**
     * Called before all rendering. It needs super.beforeRendererAll() when you need to override.
     */
    public beforeRenderAll(): void {

    }

    /**
     * Called after all rendering. It needs super.afterRendererAll() when you need to override.
     */
    public afterRenderAll(): void {

    }
    
        /**
     * backing field for ClearColor
     */
    private clearColor: Color4;

    public get ClearColor(): Color4 {
        this.clearColor = this.clearColor || new Color4(1, 1, 1, 1);
        return this.clearColor;
    }
    public set ClearColor(col: Color4) {
        this.clearColor = col || new Color4(1, 1, 1, 1);
    }
}

export =ContextManagerBase;
