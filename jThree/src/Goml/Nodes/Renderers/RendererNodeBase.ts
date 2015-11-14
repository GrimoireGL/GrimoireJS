import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import GomlLoader = require("../../GomlLoader");
import Canvas = require("../../../Core/Canvas");
class RendererNodeBase extends GomlTreeNodeBase {
    constructor(elem: HTMLElement, loader: GomlLoader, parent: GomlTreeNodeBase) {
        super(elem, loader, parent);
        this.attributes.defineAttribute({
            "width": {
                value: 128, converter: "number", handler: (v) => { this.sizeChanged(v.Value,this.attributes.getValue("height")) }
            },
            "height": {
                value: 128, converter: "number", handler: (v) => { this.sizeChanged(this.attributes.getValue("width"),v.Value)}
            },
            "clearColor": {
                value: "#0FF", converter: "color4", handler: (v) => { this.canvas.ClearColor = v.Value; }
            },
        });
    }

    public beforeLoad()
    {
        this.attributes.setValue("width",this.DefaultWidth);
        this.attributes.setValue("height",this.DefaultHeight);
    }

    private canvas:Canvas;

    protected setCanvas(canvas:Canvas)
    {
        this.canvas=canvas;
        this.sizeChanged(this.DefaultWidth,this.DefaultHeight);
    }

    public get Canvas():Canvas
    {
        return this.canvas;
    }

    protected sizeChanged(width:number,height:number)
    {

    }

    protected get DefaultWidth(): number {
        return 0;
    }

    protected get DefaultHeight(): number {
        return 0;
    }
}

export = RendererNodeBase;
