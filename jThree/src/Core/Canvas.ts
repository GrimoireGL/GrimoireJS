import ContextManagerBase = require("./ContextManagerBase");
import WebGLContextWrapper = require("../Wrapper/WebGLContextWrapper");
import Rectangle = require("../Math/Rectangle");
import JThreeContext = require("../NJThreeContext");
import RendererBase = require("./Renderers/RendererBase");
import ClearTargetType = require("../Wrapper/ClearTargetType");
import JThreeEvent = require('../Base/JThreeEvent');
import CanvasSizeChangedEventArgs = require('./CanvasSizeChangedEventArgs');
import Delegates = require('../Base/Delegates');
import ContextComponents = require("../ContextComponents");
import CanvasManager = require("./CanvasManager");
/**
 * Provides some of feature managing canvas.
 */
class Canvas extends ContextManagerBase {
    /**
     * Generate instance from HtmlCanvasElement
     */
    public static fromCanvasElement(canvasElement: HTMLCanvasElement): Canvas {//TODO need refactoring
        var gl: WebGLRenderingContext;
        try {
            gl = <WebGLRenderingContext>(canvasElement.getContext("webgl") || canvasElement.getContext("experimental-webgl"));
            var canvas: Canvas = new Canvas(gl);
            //register handlers here
            canvasElement.onmousemove = canvas.onMouseMove.bind(canvas);
            canvasElement.onmouseenter = canvas.onMouseEnter.bind(canvas);
            canvasElement.onmouseleave = canvas.onMouseLeave.bind(canvas);
            canvas.canvasElement = canvasElement;
            canvas.lastHeight = canvasElement.height;
            canvas.lastWidth = canvasElement.width;
            JThreeContext.getContextComponent<CanvasManager>(ContextComponents.CanvasManager).addCanvas(canvas);
            //add div for monitoring size changing in canvas
            return canvas;
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
    public canvasElement: HTMLCanvasElement;

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
    public onResize(act: Delegates.Action2<Canvas, CanvasSizeChangedEventArgs>) {
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
        if (this.canvasElement.height !== this.lastHeight || this.canvasElement.width !== this.lastWidth) {
            this.onResizeEventHandler.fire(this, new CanvasSizeChangedEventArgs(this, this.lastWidth, this.lastHeight, this.canvasElement.width, this.canvasElement.height));
            this.lastHeight = this.canvasElement.height; this.lastWidth = this.canvasElement.width;
        }
    }

    /**
     * clear the default buffer of this canvas with ClearColor.
     */
    public clearCanvas(): void {
        this.GL.bindFramebuffer(this.GL.FRAMEBUFFER,null);//binds to default buffer.
        this.applyClearColor();
        this.GL.clear(ClearTargetType.ColorBits | ClearTargetType.DepthBits);
    }

    /**
     * Get default rectangle it fills this canvas.
     */
    public getDefaultRectangle(): Rectangle {
        return new Rectangle(0, 0, this.canvasElement.width, this.canvasElement.height);
    }

    public mouseOver:boolean=false;

    public lastMouseInfo;

    private onMouseMove(e)
    {
      e.canvasX = e.clientX - this.canvasElement.clientLeft;
      e.canvasY = e.clientY - this.canvasElement.clientTop;
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


export =Canvas;
