import GLExtensionRegistory from "./GL/GLExtensionRegistory";
import Rectangle from "../../Math/Rectangle";
import BasicRenderer from "../Renderers/BasicRenderer";
import JThreeEvent from "../../Base/JThreeEvent";
import CanvasSizeChangedEventArgs from "./CanvasSizeChangedEventArgs";
import Color4 from "../../Math/Color4";
import JThreeContext from "../../JThreeContext";
import MaterialManager from "../../Core/Materials/MaterialManager";
import ContextComponents from "../../ContextComponents";
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

  public gl: WebGLRenderingContext;

  public glExtensionRegistory: GLExtensionRegistory = new GLExtensionRegistory();

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
    this.gl = glContext;
    this.glExtensionRegistory.checkExtensions(glContext);
    let materialManager = JThreeContext.getContextComponent<MaterialManager>(ContextComponents.MaterialManager);
    if (materialManager.conditionRegistered) {
      let extensionList: string[] = [];
      for (let extName in GLExtensionRegistory.requiredExtensions) {
        if (typeof this.glExtensionRegistory.extensions[extName] === "undefined") {
          throw new Error("glExtension " + extName + " is undefined");
        }
        if (this.glExtensionRegistory.extensions[extName] !== null) {
          extensionList.push(extName);
        }
      }
      materialManager.conditionRegistered = true;
    }
    return;
  }

  private _clearCanvas(): void {
    this.gl.colorMask(true, true, true, true);
    this.gl.clearColor.apply(this.gl, this.clearColor.rawElements);
    this.gl.depthMask(true);
    this.gl.clearDepth(1.0);
    this.gl.clear(WebGLRenderingContext.COLOR_BUFFER_BIT | WebGLRenderingContext.DEPTH_BUFFER_BIT);
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
