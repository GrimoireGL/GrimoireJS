
import GLContextWrapperBase = require("../Wrapper/GLContextWrapperBase");

import jThreeObjectId = require("../Base/JThreeObjectWithID");
import RendererBase = require("./RendererBase");
class ContextManagerBase extends jThreeObjectId
{
    constructor() {
        super();
    }
    protected context: GLContextWrapperBase;

    get Context(): GLContextWrapperBase
    {
        return this.context;
    }

    beforeRender(renderer:RendererBase):void
    {
        
    }

    afterRender(renderer:RendererBase):void
    {

    }

    beforeRenderAll():void
    {

    }

    afterRenderAll():void
    {
      
    }
}

export=ContextManagerBase;
