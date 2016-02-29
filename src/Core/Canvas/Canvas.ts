import GLExtensionRegistory from "./GL/GLExtensionRegistory";
import Rectangle from "../../Math/Rectangle";
import BasicRenderer from "../Renderers/BasicRenderer";
import JThreeEvent from "../../Base/JThreeEvent";
import CanvasSizeChangedEventArgs from "./CanvasSizeChangedEventArgs";
import Color4 from "../../Math/Color4";
import CanvasRegion from "./CanvasRegion";
import {WebGLNotSupportedException} from "../../Exceptions";

/**
 * The class to manage HTMLCanvasElement.
 * Provides most of interfaces related to GLContext except the features resource manager providing.
 *
 * HTMLCanvasElementを管理するクラスs
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

  public gL: WebGLRenderingContext;

  public glExtensionResolver: GLExtensionRegistory = new GLExtensionRegistory();

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
    this._clearCanvas();
  }


  public get region(): Rectangle {
    return new Rectangle(0, 0, this._lastWidth, this._lastHeight);
  }

  /**
   * apply gl context after webglrendering context initiated.
   */
  protected __setGLContext(glContext: WebGLRenderingContext): void {
    this.gL = glContext;
    this.glExtensionResolver.checkExtensions(glContext);
    return;
  }

  private _clearCanvas(): void {
    this.gL.colorMask(true, true, true, true);
    this.gL.clearColor.apply(this.gL, this.clearColor.rawElements);
    this.gL.depthMask(true);
    this.gL.clearDepth(1.0);
    this.gL.clear(WebGLRenderingContext.COLOR_BUFFER_BIT | WebGLRenderingContext.DEPTH_BUFFER_BIT);
  }

  /**
   * Attempts to try getting GLContext from canvas.
   * @return {WebGLRenderingContext} [description]
   */
  private _tryGetGLContext(): WebGLRenderingContext {
    try {
      return <WebGLRenderingContext>this.canvasElement.getContext("webgl") || this.canvasElement.getContext("experimental-webgl");
    } catch (e) {
      throw new WebGLNotSupportedException();
    }
  }
}


export default Canvas;
