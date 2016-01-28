import GLExtensionResolver = require("./GLExtensionResolver");
import Rectangle = require("../Math/Rectangle");
import BasicRenderer = require("./Renderers/BasicRenderer");
import JThreeEvent = require("../Base/JThreeEvent");
import CanvasSizeChangedEventArgs = require("./CanvasSizeChangedEventArgs");
import Color4 = require("../Math/Color4");
import CanvasRegion = require("./CanvasRegion");
import Exceptions = require("../Exceptions");
/**
 * The class to manage HTMLCanvasElement.
 * Provides most of interfaces related to GLContext except the features resource manager providing.
 *
 * HTMLCanvasElementを管理するクラス
 * リソースマネージャーが提供する機能以外のGLContextが関連する機能のほとんどを内包します。
 */
class Canvas extends CanvasRegion {

  /**
   * Constructor
   * @param  {HTMLCanvasElement} canvasElement the HTMLCanvasElement that is managed by this class.
   */
  constructor(canvasElement: HTMLCanvasElement) {
    super(canvasElement);
    this._lastWidth = canvasElement.width;
    this._lastHeight = canvasElement.height;
    this.__setGLContext(this._tryGetGLContext());
  }

  /**
   * event cache for resize event.
   */
  public canvasResized: JThreeEvent<CanvasSizeChangedEventArgs> = new JThreeEvent<CanvasSizeChangedEventArgs>();

  /**
  * backing field for ClearColor
  */
  public clearColor: Color4 = new Color4(1, 1, 1, 1);

  public GL: WebGLRenderingContext;

  public glExtensionResolver: GLExtensionResolver = new GLExtensionResolver();

  /**
   * canvas height of last time
   */
  private _lastHeight: number;

  /**
   * canvas width of last time
   */
  private _lastWidth: number;

  /**
   * Called after rendering. It needs super.afterRenderer(renderer) when you need to override.
   */
  public afterRender(renderer: BasicRenderer): void {
    return;
  }

  public afterRenderAll(): void {
    return;
  }
  public beforeRender(renderer: BasicRenderer): void {
    return;
  }
  public beforeRenderAll(): void {
    // check size changed or not.
    if (this.canvasElement.height !== this._lastHeight || this.canvasElement.width !== this._lastWidth) {
      this.canvasResized.fire(this, new CanvasSizeChangedEventArgs(this, this._lastWidth, this._lastHeight, this.canvasElement.width, this.canvasElement.height));
      this._lastHeight = this.canvasElement.height; this._lastWidth = this.canvasElement.width;
    }
  }


  public get region(): Rectangle {
    return new Rectangle(0, 0, this._lastWidth, this._lastHeight);
  }

  /**
   * apply gl context after webglrendering context initiated.
   */
  protected __setGLContext(glContext: WebGLRenderingContext) {
    this.GL = glContext;
    this.glExtensionResolver.checkExtensions(glContext);
  }

  public applyClearColor() {
    this.GL.clearColor(this.clearColor.R, this.clearColor.G, this.clearColor.B, this.clearColor.A);
  }

  /**
   * Attempts to try getting GLContext from canvas.
   * @return {WebGLRenderingContext} [description]
   */
  private _tryGetGLContext(): WebGLRenderingContext {
    try {
      return <WebGLRenderingContext>this.canvasElement.getContext("webgl") || this.canvasElement.getContext("experimental-webgl");
    } catch (e) {
      throw new Exceptions.WebGLNotSupportedException();
    }
  }
}


export = Canvas;
