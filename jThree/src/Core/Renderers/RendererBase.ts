import ContextManagerBase = require("./../ContextManagerBase");
import Delegates = require("../../Delegates");
import Exceptions = require("../../Exceptions");
import GLContextWrapperBase = require("../../Wrapper/GLContextWrapperBase");
import jThreeObjectWithId = require("../../Base/JThreeObjectWithId");
import Camera = require("./../Camera/Camera");
class RendererBase extends jThreeObjectWithId
{
    
    private camera:Camera;

    public get Camera():Camera
    {
      return this.camera;
    }
    
    public set Camera(camera:Camera)
    {
      this.camera=camera;
    }

    constructor(contextManager:ContextManagerBase) {
        super();
        this.contextManager = contextManager;
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
}


export=RendererBase;
