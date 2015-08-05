import CanvasManager = require("../../../Core/CanvasManager");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import JThreeContextProxy = require("../../../Core/JThreeContextProxy");
import GomlLoader = require("../../GomlLoader");
import RendererNodeBase = require("./RendererNodeBase");

class RendererNode extends RendererNodeBase {
    targetCanvas: HTMLCanvasElement;
    
    targetFrame:HTMLElement;

    constructor(elem: HTMLElement, loader: GomlLoader, parent: GomlTreeNodeBase) {
        super(elem, loader, parent);
        //generate canvas
        this.targetFrame = <HTMLElement>document.querySelector(this.Frame);
        this.targetCanvas = document.createElement("canvas");
        if (this.targetFrame) this.targetFrame.appendChild(this.targetCanvas);
        this.targetCanvas.classList.add("x-j3-c-" + this.ID);
        //initialize contexts
        this.setCanvasManager(CanvasManager.fromCanvasElement(this.targetCanvas));
        var context = JThreeContextProxy.getJThreeContext();
        context.addCanvasManager(this.CanvasManager);
        this.attributes.defineAttribute({
            "fullscreen":
            {
                value: false, converter: "boolean", handler: (v) => {
                    this.CanvasManager.FullScreen = v.Value;
                }
            }
        });
        this.attributes.applyDefaultValue();
    }

    get Frame(): string {
        return this.element.getAttribute("frame") || "body";
    }

    protected get DefaultWidth(): number {
        return this.targetFrame.clientWidth;
    }

    protected get DefaultHeight(): number {
        return this.targetFrame.clientHeight;
    }
    
    protected sizeChanged(width:number,height:number)
    {
        this.targetCanvas.width=width;
        this.targetCanvas.height=height;
    }
    


}

export =RendererNode;
