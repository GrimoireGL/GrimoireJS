import ContextManagerBase = require("./../ContextManagerBase");
import Delegates = require("../../Delegates");
import Exceptions = require("../../Exceptions");
import GLContextWrapperBase = require("../../Wrapper/GLContextWrapperBase");
import jThreeObjectWithID = require("../../Base/JThreeObjectWithID");
import Camera = require("./../Camera/Camera");
import Material = require('./../Materials/Material');
import SceneObject = require('./../SceneObject');
/**
 * Provides base class feature for renderer classes.
 */
class RendererBase extends jThreeObjectWithID
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

    private contextManager: ContextManagerBase;
    public get ContextManager(): ContextManagerBase {
        return this.contextManager;
    }

    public get GLContext(): GLContextWrapperBase {
        return this.contextManager.Context;
    }
    
    public beforeRender() {
        this.ContextManager.beforeRender(this);
    }

    public afterRender() {
        this.ContextManager.afterRender(this);
    }
    
    public draw(object:SceneObject,material:Material)
    {
        
    }
}


export=RendererBase;
