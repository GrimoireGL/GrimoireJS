import ContextManagerBase = require("./ContextManagerBase");
import Delegates = require("../Delegates");
import Exceptions = require("../Exceptions");
import GLContextWrapperBase = require("../Wrapper/GLContextWrapperBase");

import jThreeObject = require("../Base/JThreeObject");
import Camera = require("./Camera/Camera");
class RendererBase extends jThreeObject
{

    constructor(contextManager:ContextManagerBase) {
        super();
        this.contextManager = contextManager;
    }
    protected id: string;

    get ID(): string
    {
        return this.id;
    }

    public enabled: boolean;

    render(drawAct: Delegates.Action0): void {
        throw new Exceptions.AbstractClassMethodCalledException();
    }

    protected contextManager: ContextManagerBase;

    get ContextManager(): ContextManagerBase {
        return this.contextManager;
    }

    get Context(): GLContextWrapperBase {
        return this.contextManager.Context;
    }

    public get Camera():Camera
    {
      return null;
    }
}


export=RendererBase;
