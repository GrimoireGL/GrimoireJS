
import GLContextWrapperBase = require("../Wrapper/GLContextWrapperBase");

import jThreeObjectId = require("../Base/JThreeObjectWithID");

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
}

export=ContextManagerBase;
