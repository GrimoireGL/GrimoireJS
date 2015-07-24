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
            gl = <WebGLRenderingContext>(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
            var renderer: CanvasManager = new CanvasManager(gl);
            var instance = JThreeContextProxy.getJThreeContext();
            renderer.targetCanvas = canvas;
            renderer.lastHeight = canvas.height;
            renderer.lastWidth = canvas.width;
            instance.addCanvasManager(renderer);
            //add div for monitoring size changing in canvas
            return renderer;
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
     * backing field of FullScreen.
     */
    private fullscreen: boolean = false;

    /**
     * target canvas this class managing.
     */
    private targetCanvas: HTMLCanvasElement;

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

    /**
     * Get accessor for the reference of canvas element this object managing.
     */
    public get TargetCanvas(): HTMLCanvasElement {
        return this.targetCanvas;
    }

    /**
     * Get accessor whether this canvas is fullscreen or not.
     */
    public get FullScreen(): boolean {
        return this.fullscreen;
    }

    /**
     * Set accessor whether this canvas is fullscreen or not.
     */
    public set FullScreen(val: boolean) {
        if (val === this.fullscreen) return;
        this.fullscreen = val;
        if (val) this.targetCanvas.webkitRequestFullScreen();//TODO fix it
    }


    public get IsDirty(): boolean {
        return this.isDirty;
    }
    /**
     * add event handler that will be called when canvas size was changed.
     */
    public onResize(act: Delegates.Action2<CanvasManager, CanvasSizeChangedEventArgs>) {
        this.onResizeEventHandler.addListerner(act);
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
}


export =CanvasManager;
