import GLContextWrapperBase = require("../Wrapper/GLContextWrapperBase");
import jThreeObjectId = require("../Base/JThreeObjectWithID");
import RendererBase = require("./Renderers/RendererBase");
/**
 * Provides base interface for the classes managing GLcontext
 */
class ContextManagerBase extends jThreeObjectId {
    constructor() {
        super();
    }
    
    private context: GLContextWrapperBase;
    
    protected setContext(context:GLContextWrapperBase)
    {
        this.context=context;
    }

    get Context(): GLContextWrapperBase {
        return this.context;
    }

    beforeRender(renderer: RendererBase): void {

    }

    afterRender(renderer: RendererBase): void {

    }

    beforeRenderAll(): void {

    }

    afterRenderAll(): void {

    }
}

export =ContextManagerBase;
