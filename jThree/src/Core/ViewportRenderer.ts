import Rectangle = require("../Math/Rectangle");
import Color4 = require("../Base/Color/Color4");
import RendererBase = require("./RendererBase");
import ContextManagerBase = require("./ContextManagerBase");
import Delegates = require("../Delegates");
import ClearTargetType = require("../Wrapper/ClearTargetType");

import jThreeObject = require("../Base/JThreeObject");
import Camera = require("./Camera/Camera");

class ViewPortRenderer extends RendererBase
{
    constructor(contextManager: ContextManagerBase,viewportArea:Rectangle) {
        super(contextManager);
        this.viewportArea = viewportArea;
    }

    private viewportArea: Rectangle;

    private camera:Camera;

    public get Camera():Camera
    {
      return this.camera;
    }
    public set Camera(camera:Camera)
    {
      this.camera=camera;
    }

    public get ViewPortArea():Rectangle
    {
      return this.viewportArea;
    }

    public set ViewPortArea(area:Rectangle)
    {
      this.viewportArea=area;
    }

    applyConfigure(): void {
        this.contextManager.Context.ViewPort(this.viewportArea.Left, this.viewportArea.Top,this.viewportArea.Width, this.viewportArea.Height);
    }

    render(drawAct: Delegates.Action0): void {
       this.ContextManager.beforeRender(this);
        this.applyConfigure();
        drawAct();
        this.contextManager.Context.Flush();
        this.contextManager.afterRender(this);
    }
}

export=ViewPortRenderer;
