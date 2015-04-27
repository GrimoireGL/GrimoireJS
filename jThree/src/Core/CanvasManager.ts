import JThreeContext = require("./JThreeContext");
import ContextManagerBase = require("./ContextManagerBase");
import WebGLContextWrapper = require("Wrapper/WebGLContextWrapper");
import ViewPortRenderer = require("./ViewportRenderer");
import Rectangle = require("../Math/Rectangle");
import jThreeObject = require("../Base/JThreeObject");
import JThreeContextProxy = require("./JThreeContextProxy");
class CanvasManager extends ContextManagerBase {
    public static fromCanvas(canvas: HTMLCanvasElement): CanvasManager {
        var gl: WebGLRenderingContext;
        try {
            gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
            var renderer: CanvasManager = new CanvasManager(gl);
            var instance=JThreeContextProxy.getJThreeContext();
            instance.addRenderer(renderer);
            console.log("canvas manager Generation");
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
