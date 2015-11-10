import ContextManagerBase = require("./ContextManagerBase");
import WebGLContextWrapper = require("../Wrapper/WebGLContextWrapper");
import Rectangle = require("../Math/Rectangle");
import JThreeContextProxy = require("./JThreeContextProxy");
import RendererBase = require("./Renderers/RendererBase");
import ClearTargetType = require("../Wrapper/ClearTargetType");
import JThreeEvent = require('../Base/JThreeEvent');
import CanvasSizeChangedEventArgs = require('./CanvasSizeChangedEventArgs');
import Delegates = require('../Base/Delegates');

/**
 * Provides some of feature managing canvas.
 */
class CanvasManager extends ContextManagerBase {
    /**
     * Generate instance from HtmlCanvasElement
     */
    public static fromCanvasElement(canvas: HTMLCanvasElement): CanvasManager {//TODO need refactoring
        var gl: WebGLRenderingContext;
        try {
          debugger;
            gl = <WebGLRenderingContext>(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
            var canvasManager: CanvasManager = new CanvasManager(gl);
            //register handlers here
            canvas.onmousemove = canvasManager.onMouseMove.bind(canvasManager);
            canvas.onmouseenter = canvasManager.onMouseEnter.bind(canvasManager);
            canvas.onmouseleave = canvasManager.onMouseLeave.bind(canvasManager);

            var instance = JThreeContextProxy.getJThreeContext();
            canvasManager.targetCanvas = canvas;
            canvasManager.lastHeight = canvas.height;
            canvasManager.lastWidth = canvas.width;
            instance.addCanvasManager(canvasManager);
            //add div for monitoring size changing in canvas
            return canvasManager;
        } catch (e) {
            console.error("Web GL context Generation failed");
            if (!gl) {
                console.error("WebGL Context Generation failed." + e);
                //Processing for this error
            }
        }
    }

    constructor(glContext: WebGLRenderingContext) {
        super();
        // this.enabled = true;
        this.setGLContext(new WebGLContextWrapper(glContext));
    }

    /**
     * target canvas this class managing.
     */
    public targetCanvas: HTMLCanvasElement;

    /**
     * cache for the last height.
     */
    private lastHeight: number;

    /**
     * cache for the last width.
     */
    private lastWidth: number;


    /**
     * backing field for IsDirty
     */
    private isDirty: boolean = true;

    /**
     * event cache for resize event.
     */
    private onResizeEventHandler: JThreeEvent<CanvasSizeChangedEventArgs> = new JThreeEvent<CanvasSizeChangedEventArgs>();

    public get IsDirty(): boolean {
        return this.isDirty;
    }
    /**
     * add event handler that will be called when canvas size was changed.
     */
    public onResize(act: Delegates.Action2<CanvasManager, CanvasSizeChangedEventArgs>) {
        this.onResizeEventHandler.addListener(act);
    }

    public afterRenderAll(): void {
        this.isDirty = true;
    }

    public beforeRender(renderer: RendererBase): void {
        if (this.isDirty) {//check it needs clear default buffer or not.
            this.clearCanvas();
            this.isDirty = false;
        }
    }

    public beforeRenderAll(): void {
        //check size changed or not.
        if (this.targetCanvas.height !== this.lastHeight || this.targetCanvas.width !== this.lastWidth) {
            this.onResizeEventHandler.fire(this, new CanvasSizeChangedEventArgs(this, this.lastWidth, this.lastHeight, this.targetCanvas.width, this.targetCanvas.height));
            this.lastHeight = this.targetCanvas.height; this.lastWidth = this.targetCanvas.width;
        }
    }

    /**
     * clear the default buffer of this canvas with ClearColor.
     */
    public clearCanvas(): void {
        this.GLContext.BindFrameBuffer(null);//binds to default buffer.
        this.applyClearColor();
        this.GLContext.Clear(ClearTargetType.ColorBits | ClearTargetType.DepthBits);
    }

    /**
     * Get default rectangle it fills this canvas.
     */
    public getDefaultRectangle(): Rectangle {
        return new Rectangle(0, 0, this.targetCanvas.width, this.targetCanvas.height);
    }

    public mouseOver:boolean=false;

    public lastMouseInfo;

    private onMouseMove(e)
    {
      e.canvasX = e.clientX - this.targetCanvas.clientLeft;
      e.canvasY = e.clientY - this.targetCanvas.clientTop;
      this.lastMouseInfo = e;
      this.mouseOver = true;
    }

    private onMouseEnter(e)
    {
      this.mouseOver = true;
    }

    private onMouseLeave(e)
    {
      this.mouseOver = false;
    }
}


export =CanvasManager;
