import BufferSet = require("./BufferSet");
import CubeTexture = require("../Resources/Texture/CubeTexture");
import BufferTexture = require("../Resources/Texture/BufferTexture");
import TextureBase = require("../Resources/Texture/TextureBase");
import Camera = require("./../Camera/Camera");
import RenderPathExecutor = require("./RenderPathExecutor");
import Rectangle = require("../../Math/Rectangle");
import RendererConfiguratorBase = require("./RendererConfigurator/RendererConfiguratorBase");
import RendererConfigurator = require("./RendererConfigurator/BasicRendererConfigurator");
import JThreeContext = require("../../JThreeContext");
import ContextComponents = require("../../ContextComponents");
import ResourceManager = require("../ResourceManager");
import Scene = require("../Scene");
import RenderPath = require("./RenderPath");
import Canvas = require("../Canvas");
import CanvasRegion = require("../CanvasRegion");
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

  /**
   * The camera reference this renderer using for draw.
   */
  private camera: Camera;

  /**
   * Canvas managing this renderer.
   */
  private canvas: Canvas;

  private _viewport: Rectangle = new Rectangle(0, 0, 256, 256);

  /**
  * Provides render stage abstraction
  */
  private renderPathExecutor: RenderPathExecutor;

  public bufferSet: BufferSet;


  /**
   * Constructor of RenderBase
   * @param canvas
   * @param viewportArea
   * @returns {}
   */
  constructor(canvas: Canvas, viewportArea: Rectangle, configurator?: RendererConfiguratorBase) {
    super(canvas.canvasElement);
    configurator = configurator || new RendererConfigurator();
    this.canvas = canvas;
    this.renderPathExecutor = new RenderPathExecutor(this);
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
  /**
   * The camera reference this renderer using for draw.
   */
  public get Camera(): Camera {
    return this.camera;
  }
  /**
   * The camera reference this renderer using for draw.
   */
  public set Camera(camera: Camera) {
    this.camera = camera;
  }

  public render(scene: Scene): void {
    this.renderPathExecutor.processRender(scene, this.renderPath);
  }

  /**
   * Canvas managing this renderer.
   */
  public get Canvas(): Canvas {
    return this.canvas;
  }

  public get GL(): WebGLRenderingContext {
    return this.canvas.GL;
  }

  /**
   * It will be called before processing renderer.
   * If you need to override this method, you need to call same method of super class first.
   */
  public beforeRender() {
    this.applyViewportConfigure();
    this.Canvas.beforeRender(this);
  }

  /**
   * It will be called after processing renderer.
   * If you need to override this method, you need to call same method of super class first.
   */
  public afterRender() {
    this.GL.flush();
    this.Canvas.afterRender(this);
  }

  /**
   * Provides render stage abstraction
   */
  public get RenderPathExecutor(): RenderPathExecutor {
    return this.renderPathExecutor;
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
    if (!Rectangle.Equals(area, this._viewport) && (typeof area.Width !== "undefined") && (typeof area.Height !== "undefined")) {
      if (isNaN(area.Height + area.Width)) { return; }
      this._viewport = area;
      JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager).getRBO(this.ID + ".rbo.default").resize(area.Width, area.Height);
      this.emit("resize", area);
    }

  }

  /**
   * Apply viewport configuration
   */
  public applyViewportConfigure(): void {
    this.GL.viewport(this._viewport.Left, this._viewport.Top, this._viewport.Width, this._viewport.Height);
  }
}


export = BasicRenderer;
