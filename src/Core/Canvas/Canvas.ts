import ResourceManager from "../ResourceManager";
import ContextComponents from "../../ContextComponents";
import BufferTexture from "../Resources/Texture/BufferTexture";
import JThreeContext from "../../JThreeContext";
import CubeTexture from "../Resources/Texture/CubeTexture";
import TextureBase from "../Resources/Texture/TextureBase";
import ICanvasContainer from "./ICanvasContainer";
import GLExtensionRegistory from "./GL/GLExtensionRegistory";
import Rectangle from "../../Math/Rectangle";
import BasicRenderer from "../Renderers/BasicRenderer";
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
class Canvas extends CanvasRegion implements ICanvasContainer {

  /**
   * Constructor
   * @param  {HTMLCanvasElement} canvasElement the HTMLCanvasElement that is managed by this class.
   */
  constructor(canvasElement: HTMLCanvasElement) {
    super(canvasElement);
    this.canvas = this;
    this._lastWidth = canvasElement.width;
    this._lastHeight = canvasElement.height;
    this.__setGLContext(this._tryGetGLContext());
  }


  /**
   * The texture which will be used for unassigned texture sampler2D variable in GLSL.
   * This variable is not intended to be assigned by user manually.
   * If you want to change this alternative texture, you need to extend this class and overrride __initializeAlternativeTexture method.
   * @type {TextureBase}
   */
  public alternativeTexture: TextureBase;

  /**
   * The cubeTexture which will be used for unassigned texture samplerCube variable in GLSL.
   * This variable is not intended to be assigned by user manually.
   * If you want to change this alternative texture, yoou need to extend this class and override __initializeAlternativeCubeTexture method.
   * @type {CubeTexture}
   */
  public alternativeCubeTexture: CubeTexture;

  public canvas: Canvas;

  /**
  * backing field for ClearColor
  */
  public clearColor: Color4 = new Color4(1, 1, 1, 1);

  public gl: WebGLRenderingContext;

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
      this.emit("resize", new CanvasSizeChangedEventArgs(this, this._lastWidth, this._lastHeight, this.canvasElement.width, this.canvasElement.height));
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
    this.glExtensionResolver.checkExtensions(glContext);
    this.alternativeTexture = this.__initializeAlternativeTexture();
    this.alternativeCubeTexture = this.__initializeAlternativeCubeTexture();
    return;
  }

  /**
   * Initialize and obtain the buffer texture which will be used when any texture sampler2D variable in GLSL was not assigned.
   * This method will be called when RendererFactory called initialize method to construct instance.
   * Basically,this method is not intended to be called from user.
   * @return {TextureBase} Constructed texture buffer.
   */
  protected __initializeAlternativeTexture(): TextureBase {
    const rm = JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
    let tex = <BufferTexture>rm.createTexture("jthree.alt.texture2D." + this.id, 1, 1);
    tex.updateTexture(new Uint8Array([255, 0, 255, 255])); // Use purple color as the color of default buffer texture.
    return tex;
  }

  protected __initializeAlternativeCubeTexture(): CubeTexture {
    const rm = JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
    let tex = rm.createCubeTextureWithSource("jthree.alt.textureCube." + this.id, null);
    return tex;
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
      const gl = <WebGLRenderingContext>this.canvasElement.getContext("webgl") || this.canvasElement.getContext("experimental-webgl");
      gl.id = this.id;
      return gl;
    } catch (e) {
      throw new WebGLNotSupportedException();
    }
  }
}


export default Canvas;
