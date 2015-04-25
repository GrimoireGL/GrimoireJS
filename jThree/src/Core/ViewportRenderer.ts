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
        this.backgroundColor = new Color4(0,0.5,1,1);
    }

    private viewportArea: Rectangle;
    private backgroundColor:Color4;

    applyConfigure(): void {
        this.contextManager.Context.ClearColor(this.backgroundColor.R, this.backgroundColor.G, this.backgroundColor.B, this.backgroundColor.A);
        this.contextManager.Context.ViewPort(this.viewportArea.Left, this.viewportArea.Top,this.viewportArea.Width, this.viewportArea.Height);
    }

    render(drawAct: Delegates.Action0): void {
        this.applyConfigure();
        this.contextManager.Context.Clear(ClearTargetType.ColorBits);
        drawAct();
        this.contextManager.Context.Finish();
    }
}

export=ViewPortRenderer;
