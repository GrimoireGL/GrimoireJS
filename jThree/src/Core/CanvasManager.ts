import JThreeContext = require("./JThreeContext");
import ContextManagerBase = require("./ContextManagerBase");
import WebGLContextWrapper = require("Wrapper/WebGLContextWrapper");
import ViewPortRenderer = require("./ViewportRenderer");
import Rectangle = require("../Math/Rectangle");
import jThreeObject = require("../Base/JThreeObject");

class CanvasManager extends ContextManagerBase {
    public static fromCanvas(canvas: HTMLCanvasElement): CanvasManager {
        var gl: WebGLRenderingContext;
        try {
            gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
            var renderer: CanvasManager = new CanvasManager(gl);
            console.warn("pass 0");
            var instance=JThreeContext.getInstance();
            console.warn("pass 1");
            if(typeof instance === "undefined")console.warn("instance is null");
            console.warn("pass 2");
            instance.addRenderer(renderer);
            return renderer;
        } catch (e) {
          debugger;
          console.error("Web GL context Generation failed");
            if (!gl) {
              console.error("WebGL Context Generation failed."+e);
                //Processing for this error
            }
        }
    }

    private glContext: WebGLRenderingContext;

    constructor(glContext: WebGLRenderingContext) {
        super();
       // this.enabled = true;
        this.glContext = glContext;
        this.context = new WebGLContextWrapper(this.glContext);
    }

    getDefaultViewport(): ViewPortRenderer {
        return new ViewPortRenderer(this,new Rectangle(20,20,280,280));
    }
}


export=CanvasManager;
