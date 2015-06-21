import GomlTreeNodeBase = require('../../GomlTreeNodeBase');
import GomlLoader = require('../../GomlLoader');
import CanvasManager = require('../../../Core/CanvasManager');
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
                value: '#0FF', converter: "color4", handler: (v) => { this.canvasManager.ClearColor = v.Value; }
            },
        });
    }
    
    beforeLoad()
    {
        this.attributes.setValue("width",this.DefaultWidth);
        this.attributes.setValue("height",this.DefaultHeight);
    }
    
    private canvasManager:CanvasManager;
    
    protected setCanvasManager(canvasManager:CanvasManager)
    {
        this.canvasManager=canvasManager;
        this.sizeChanged(this.DefaultWidth,this.DefaultHeight);
    }
    
    public get CanvasManager():CanvasManager
    {
        return this.canvasManager;
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