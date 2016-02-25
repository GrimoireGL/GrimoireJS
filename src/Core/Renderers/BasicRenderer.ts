import BufferSet from "./BufferSet";
import CubeTexture from "../Resources/Texture/CubeTexture";
import BufferTexture from "../Resources/Texture/BufferTexture";
import TextureBase from "../Resources/Texture/TextureBase";
import Camera from "./../SceneObjects/Camera/Camera";
import RenderPathExecutor from "./RenderPathExecutor";
import Rectangle from "../../Math/Rectangle";
import RendererConfiguratorBase from "./RendererConfigurator/RendererConfiguratorBase";
import RendererConfigurator from "./RendererConfigurator/BasicRendererConfigurator";
import JThreeContext from "../../JThreeContext";
import ContextComponents from "../../ContextComponents";
import ResourceManager from "../ResourceManager";
import Scene from "../Scene";
import RenderPath from "./RenderPath";
import Canvas from "../Canvas/Canvas";
import CanvasRegion from "../Canvas/CanvasRegion";
/**
* Provides base class feature for renderer classes.
*/
class BasicRenderer extends CanvasRegion {

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

  public renderPath: RenderPath = new RenderPath(this);

  public bufferSet: BufferSet;

  /**
   * The camera reference this renderer using for draw.
   */
  private _camera: Camera;

  /**
   * Canvas managing this renderer.
   */
  private _canvas: Canvas;

  private _viewport: Rectangle = new Rectangle(0, 0, 256, 256);

  /**
  * Provides render stage abstraction
  */
  private _renderPathExecutor: RenderPathExecutor;


  /**
   * Constructor of RenderBase
   * @param canvas
   * @param viewportArea
   * @returns {}
   */
  constructor(canvas: Canvas, viewportArea: Rectangle, configurator?: RendererConfiguratorBase) {
    super(canvas.canvasElement);
    configurator = configurator || new RendererConfigurator();
    this._canvas = canvas;
    this._renderPathExecutor = new RenderPathExecutor(this);
    this._viewport = viewportArea;
    const rm = JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
    if (this._viewport) { rm.createRBO(this.ID + ".rbo.default", this._viewport.Width, this._viewport.Height); }
    this.renderPath.fromPathTemplate(configurator.getStageChain(this));
    this.bufferSet = new BufferSet(this);
    this.bufferSet.appendBuffers(configurator.TextureBuffers);
    this.name = this.ID;
  }

  /**
   * Initialize renderer to be rendererd.
   * Basically, this method are used for initializing GL resources, the other variable and any resources will be initialized when constructor was called.
   * This method is not intended to be called by user manually.
   */
  public initialize(): void {
    this.alternativeTexture = this.__initializeAlternativeTexture();
    this.alternativeCubeTexture = this.__initializeAlternativeCubeTexture();
  }

  /**
   * The camera reference this renderer using for draw.
   */
  public get Camera(): Camera {
    return this._camera;
  }
  /**
   * The camera reference this renderer using for draw.
   */
  public set Camera(camera: Camera) {
    this._camera = camera;
  }

  public render(scene: Scene): void {
    this._renderPathExecutor.processRender(scene, this.renderPath);
  }

  /**
   * Canvas managing this renderer.
   */
  public get Canvas(): Canvas {
    return this._canvas;
  }

  public get GL(): WebGLRenderingContext {
    return this._canvas.gL;
  }

  /**
   * It will be called before processing renderer.
   * If you need to override this method, you need to call same method of super class first.
   */
  public beforeRender(): void {
    this.applyDefaultBufferViewport();
    this.Canvas.beforeRender(this);
  }

  /**
   * It will be called after processing renderer.
   * If you need to override this method, you need to call same method of super class first.
   */
  public afterRender(): void {
    this.GL.flush();
    this.Canvas.afterRender(this);
  }

  /**
   * Provides render stage abstraction
   */
  public get RenderPathExecutor(): RenderPathExecutor {
    return this._renderPathExecutor;
  }

  /**
   * Getter for viewport area. Viewport area is the area to render.
   * @returns {Rectangle} the rectangle region to render.
   */
  public get region(): Rectangle {
    return this._viewport;
  }
  /**
   * Setter for viewport area. viewport area is the area to render.
   * @param area {Rectangle} the rectangle to render.
   */
  public set region(area: Rectangle) {
    if (!Rectangle.equals(area, this._viewport) && (typeof area.Width !== "undefined") && (typeof area.Height !== "undefined")) { // Check specified area is valid and modified
      if (isNaN(area.Height + area.Width)) {
        return;
      }
      this._viewport = area;
      JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager).getRBO(this.ID + ".rbo.default").resize(area.Width, area.Height);
      this.emit("resize", area); // This should be moved in canvas region
    }

  }

  /**
   * Apply viewport configuration
   */
  public applyDefaultBufferViewport(): void {
    this.GL.viewport(this._viewport.Left, this._canvas.region.Height - this._viewport.Bottom, this._viewport.Width, this._viewport.Height);
  }

  public applyRendererBufferViewport(): void {
    this.GL.viewport(0, 0, this._viewport.Width, this._viewport.Height);
  }


  /**
   * Initialize and obtain the buffer texture which will be used when any texture sampler2D variable in GLSL was not assigned.
   * This method will be called when RendererFactory called initialize method to construct instance.
   * Basically,this method is not intended to be called from user.
   * @return {TextureBase} Constructed texture buffer.
   */
  protected __initializeAlternativeTexture(): TextureBase {
    const rm = JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
    let tex = <BufferTexture>rm.createTexture("jthree.alt.texture2D." + this.ID, 1, 1);
    tex.updateTexture(new Uint8Array([255, 0, 255, 255])); // Use purple color as the color of default buffer texture.
    return tex;
  }

  protected __initializeAlternativeCubeTexture(): CubeTexture {
    const rm = JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
    let tex = rm.createCubeTextureWithSource("jthree.alt.textureCube." + this.ID, null);
    return tex;
  }

}


export default BasicRenderer;
