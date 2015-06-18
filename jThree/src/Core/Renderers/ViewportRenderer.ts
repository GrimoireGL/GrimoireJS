import Rectangle = require("../../Math/Rectangle");
import Color4 = require("../../Base/Color/Color4");
import RendererBase = require("./RendererBase");
import ContextManagerBase = require("./../ContextManagerBase");
import Delegates = require("../../Delegates");
import ClearTargetType = require("../../Wrapper/ClearTargetType");
import jThreeObject = require("../../Base/JThreeObject");
import Camera = require("./../Camera/Camera");

class ViewPortRenderer extends RendererBase
{
    constructor(contextManager: ContextManagerBase,viewportArea:Rectangle) {
        super(contextManager);
        this.viewportArea = viewportArea;
    }

    private viewportArea: Rectangle;

    public get ViewPortArea():Rectangle
    {
      return this.viewportArea;
    }

    public set ViewPortArea(area:Rectangle)
    {
      this.viewportArea=area;
    }

    applyViewportConfigure(): void {
        this.ContextManager.Context.ViewPort(this.viewportArea.Left, this.viewportArea.Top,this.viewportArea.Width, this.viewportArea.Height);
    }

    render(drawAct: Delegates.Action0): void {
       this.ContextManager.beforeRender(this);
        this.applyViewportConfigure();
        drawAct();
        this.ContextManager.Context.Flush();
        this.ContextManager.afterRender(this);
    }
}

export=ViewPortRenderer;
