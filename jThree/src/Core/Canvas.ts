import GLExtensionManager = require("./GLExtensionManager");
import Rectangle = require("../Math/Rectangle");
import JThreeContext = require("../JThreeContext");
import BasicRenderer = require("./Renderers/BasicRenderer");
import ClearTargetType = require("../Wrapper/ClearTargetType");
import JThreeEvent = require('../Base/JThreeEvent');
import CanvasSizeChangedEventArgs = require('./CanvasSizeChangedEventArgs');
import Delegates = require('../Base/Delegates');
import ContextComponents = require("../ContextComponents");
import CanvasManager = require("./CanvasManager");
import Debugger = require("../Debug/Debugger");
import JThreeObjectWithID = require("../Base/JThreeObjectWithID");
import Color4 = require("../Base/Color/Color4");
import CanvasRegion = require("./CanvasRegion");
/**
 * Provides some of feature managing canvas.
 */
class Canvas extends CanvasRegion {
    /**
     * Generate instance from HtmlCanvasElement
     */
    public static fromCanvasElement(canvasElement: HTMLCanvasElement): Canvas {//TODO need refactoring
        var gl: WebGLRenderingContext;
        try {
            gl = <WebGLRenderingContext>(canvasElement.getContext("webgl") || canvasElement.getContext("experimental-webgl"));
            var canvas: Canvas = new Canvas(gl,canvasElement);
            //register handlers here
            canvas.lastHeight = canvasElement.height;
            canvas.lastWidth = canvasElement.width;
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

    constructor(glContext: WebGLRenderingContext,canvasElement:HTMLCanvasElement) {
        super(canvasElement);
        // this.enabled = true;
        this.setGLContext(glContext);
    }

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
    public onResizeEventHandler: JThreeEvent<CanvasSizeChangedEventArgs> = new JThreeEvent<CanvasSizeChangedEventArgs>();

    public get IsDirty(): boolean {
        return this.isDirty;
    }

    public afterRenderAll(): void {
        this.isDirty = true;
    }

    public beforeRender(renderer: BasicRenderer): void {
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

    public get region():Rectangle
    {
      return new Rectangle(0,0,this.lastWidth,this.lastHeight);
    }

    /**
    * backing field for ClearColor
    */
    private clearColor: Color4;

    public GL:WebGLRenderingContext;

    private glExtensionManager: GLExtensionManager = new GLExtensionManager();

    public get GLExtensionManager() {
        return this.glExtensionManager;
    }

    public get ClearColor(): Color4 {
        this.clearColor = this.clearColor || new Color4(1, 1, 1, 1);
        return this.clearColor;
    }
    public set ClearColor(col: Color4) {
        this.clearColor = col || new Color4(1, 1, 1, 1);
    }

    /**
     * apply gl context after webglrendering context initiated.
     */
    protected setGLContext(glContext: WebGLRenderingContext) {
        this.GL = glContext;
        this.glExtensionManager.checkExtensions(glContext);
    }


    /**
     * Called after rendering. It needs super.afterRenderer(renderer) when you need to override.
     */
    public afterRender(renderer: BasicRenderer): void {

    }

    public applyClearColor() {
        this.GL.clearColor(this.clearColor.R, this.clearColor.G, this.ClearColor.B, this.clearColor.A);
    }
}


export =Canvas;