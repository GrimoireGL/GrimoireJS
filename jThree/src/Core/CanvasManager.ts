import JThreeContext = require("./JThreeContext");
import ContextManagerBase = require("./ContextManagerBase");
import WebGLContextWrapper = require("../Wrapper/WebGLContextWrapper");
import ViewPortRenderer = require("./Renderers/ViewportRenderer");
import Rectangle = require("../Math/Rectangle");
import jThreeObject = require("../Base/JThreeObject");
import JThreeContextProxy = require("./JThreeContextProxy");
import Color4 = require("../Base/Color/Color4");
import RendererBase = require("./Renderers/RendererBase");
import ClearTargetType = require("../Wrapper/ClearTargetType");
import GLFeatureType = require('../Wrapper/GLFeatureType');
import PixelStoreParamType = require('../Wrapper/Texture/PixelStoreParamType');
/**
 * Provides some of feature managing canvas.
 */
class CanvasManager extends ContextManagerBase {
    /**
     * Generate instance from HtmlCanvasElement
     */
    public static fromCanvasElement(canvas: HTMLCanvasElement): CanvasManager {
        var gl: WebGLRenderingContext;
        try {
            gl = <WebGLRenderingContext>(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
            var renderer: CanvasManager = new CanvasManager(gl);
            var instance=JThreeContextProxy.getJThreeContext();
            renderer.targetCanvas=canvas;
            instance.addCanvasManager(renderer);
            return renderer;
        } catch (e) {   
          console.error("Web GL context Generation failed");
            if (!gl) {
              console.error("WebGL Context Generation failed."+e);
                //Processing for this error
            }
        }
    }
    
    private targetCanvas:HTMLCanvasElement;
    
    private clearColor:Color4;
    get ClearColor():Color4
    {
      this.clearColor=this.clearColor||new Color4(1,1,1,1);
      return this.clearColor;
    }
    set ClearColor(col:Color4)
    {
      this.clearColor=col||new Color4(1,1,1,1);
    }

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
      this.Context.ClearColor(this.ClearColor.R,this.ClearColor.G,this.ClearColor.B,this.ClearColor.A);
      this.Context.Clear(ClearTargetType.ColorBits|ClearTargetType.DepthBits);
      this.Context.Enable(GLFeatureType.DepthTest);
      this.Context.PixelStorei(PixelStoreParamType.UnpackFlipYWebGL,1);
    }

    constructor(glContext: WebGLRenderingContext) {
        super();
       // this.enabled = true;
        this.setContext(new WebGLContextWrapper(glContext));
    }

    public getDefaultRectangle():Rectangle
    {
        return new Rectangle(0,0,this.targetCanvas.width,this.targetCanvas.height);
    }
    
    private fullscreen:boolean =false;
    public get FullScreen():boolean
    {
        return this.fullscreen;
    }
    public set FullScreen(val:boolean)
    {
        if(val===this.fullscreen)return;
        this.fullscreen=val;
        if(val)this.targetCanvas.webkitRequestFullScreen();//TODO fix it
    }
}


export=CanvasManager;
