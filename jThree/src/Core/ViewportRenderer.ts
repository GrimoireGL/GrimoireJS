import Rectangle = require("../Math/Rectangle");
import Color4 = require("../Base/Color/Color4");
import RendererBase = require("./RendererBase");
import ContextManagerBase = require("./ContextManagerBase");
import Delegates = require("../Delegates");
import ClearTargetType = require("../Wrapper/ClearTargetType");

import jThreeObject = require("../Base/JThreeObject");

class ViewPortRenderer extends RendererBase
{
    constructor(contextManager: ContextManagerBase,viewportArea:Rectangle) {
        super(contextManager);
        this.viewportArea = viewportArea;
    }

    private viewportArea: Rectangle;

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
