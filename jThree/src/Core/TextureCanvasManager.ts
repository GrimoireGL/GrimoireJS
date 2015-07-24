import ContextManagerBase = require('./ContextManagerBase');
import RendererBase = require('./Renderers/RendererBase');
import ClearTargetType = require("../Wrapper/ClearTargetType");
import GLFeatureType = require('../Wrapper/GLFeatureType');
import CanvasManager = require('./CanvasManager');
import Rectangle = require("../Math/Rectangle");
class TextureCanvasManager extends ContextManagerBase
{
	private isDirty:boolean=true;
    get IsDirty():boolean
    {
      return this.isDirty;
    }

    afterRenderAll():void
    {
      this.isDirty=true;
    }

    beforeRender(renderer:RendererBase):void
    {

      if(this.isDirty){
        this.ClearCanvas();
        this.isDirty=false;
      }
    }

    ClearCanvas():void
    {
      this.GLContext.Clear(ClearTargetType.ColorBits|ClearTargetType.DepthBits);
      this.GLContext.Enable(GLFeatureType.DepthTest);
      this.GLContext.ClearColor(this.ClearColor.R,this.ClearColor.G,this.ClearColor.B,this.ClearColor.A);
    }

    constructor(canvasManager:CanvasManager) {
        super();
       // this.enabled = true;
        this.setContext(canvasManager.GLContext);
    }
    
    private width:number=128;
    
    private height:number=128;
    
    get Width():number
    {
        return this.width;
    }
    
    get Height():number
    {
        return this.height;
    }
    
    set Width(width:number)
    {
        this.width=width;
    }
    
    set Height(height:number)
    {
        this.height=height;
    }

    public getDefaultRectangle():Rectangle
    {
        return new Rectangle(0,0,this.width,this.height);
    }
}

export = TextureCanvasManager;