import Canvas = require("../../../Core/Canvas");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import JThreeContextProxy = require("../../../Core/JThreeContextProxy");
import GomlLoader = require("../../GomlLoader");
import RendererNodeBase = require('./RendererNodeBase');
import Delegates = require("../../../Base/Delegates");

class RendererNode extends RendererNodeBase {
    public canvasElement: HTMLCanvasElement;
    public targetFrame: HTMLElement;
    public resizeIframeWindow: Window;
    private resizedFunctions: Delegates.Action1<RendererNode>[] = [];

    constructor(elem: HTMLElement, loader: GomlLoader, parent: GomlTreeNodeBase) {
        super(elem, loader, parent);
        //generate canvas
        this.targetFrame = <HTMLElement>document.querySelector(this.Frame);

        //frame resize
        var resizeElement = document.createElement("div");
        resizeElement.style.position = "relative";
        resizeElement.style.margin = "0";
        resizeElement.style.padding = "0";
        resizeElement.style.height = "100%";

        var resizeIframe = document.createElement("iframe");
        resizeIframe.style.position = "absolute";
        resizeIframe.style.width = "100%";
        resizeIframe.style.height = "100%";
        resizeIframe.style.margin = "0";
        resizeIframe.style.padding = "0";
        resizeIframe.style.verticalAlign = "bottom";
        resizeIframe.setAttribute("frameborder", "0");
        resizeIframe.setAttribute("scrolling", "no");
        resizeIframe.setAttribute("name", "jThreeResizeIframe");
        resizeElement.appendChild(resizeIframe);
        this.targetFrame.insertBefore(resizeElement, this.targetFrame.firstChild);

        var frameList = window.frames;
        for (var i = 0, l = frameList.length; i < l; i++) {
            if (frameList[ i ].name === "jThreeResizeIframe") {
                this.resizeIframeWindow = frameList[i];
                break;
            }
        }
        resizeIframe.setAttribute("name", "");

        this.resizeIframeWindow.addEventListener("resize", this.resize.bind(this), false);

        this.canvasElement = document.createElement("canvas");
        this.canvasElement.style.position = "relative";

        if (this.targetFrame) resizeElement.appendChild(this.canvasElement);
        this.canvasElement.classList.add("x-j3-c-" + this.ID);
        //initialize contexts
        this.setCanvas(Canvas.fromCanvasElement(this.canvasElement));
        var context = JThreeContextProxy.getJThreeContext();
        context.addCanvas(this.Canvas);
        // this.attributes.defineAttribute({
        //     "fullscreen":
        //     {
        //         value: false, converter: "boolean", handler: (v) => {
        //             this.Canvas.FullScreen = v.Value;
        //         }
        //     }
        // });
        this.attributes.applyDefaultValue();
    }

    public get Frame(): string {
        return this.element.getAttribute("frame") || "body";
    }

    /**
     *
     �C�x���g���΂���*/
    public resize();
    /**
     * �C�x���g�n���h���̓o�^
     * @param func
     * @returns {}
     */
    public resize(func: Delegates.Action1<RendererNode>);
    public resize( func?:Delegates.Action1<RendererNode>) {

        if ( typeof arguments[0]==="function") {
            this.resizedFunctions.indexOf(arguments[0]) === -1 && this.resizedFunctions.push(arguments[0]);
        } else {
            this.sizeChanged(this.DefaultWidth, this.DefaultHeight);
            this.resizedFunctions.forEach(function(f) {
                f(this);
            }.bind(this));
        }

    }

    protected get DefaultWidth(): number {
        return this.targetFrame.clientWidth;
    }

    protected get DefaultHeight(): number {
        return this.targetFrame.clientHeight;
    }

    protected sizeChanged(width:number,height:number)
    {
        this.canvasElement.width=width;
        this.canvasElement.height=height;
    }



}

export =RendererNode;
