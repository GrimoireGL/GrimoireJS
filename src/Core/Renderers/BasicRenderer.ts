import IRenderer from "./IRenderer";
import RendererBase from "./RendererBase";
import RBO from "../Resources/RBO/RBO";
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

/**
* Provides base class feature for renderer classes.
*/
class BasicRenderer extends RendererBase implements IRenderer {

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

  public defaultRenderBuffer: RBO;

  public renderPath: RenderPath = new RenderPath(this);

  public bufferSet: BufferSet;
  /**
   * The camera reference this renderer using for draw.
   */
  public camera: Camera;

  /**
   * Constructor of RenderBase
   * @param canvas
   * @param viewportArea
   * @returns {}
   */
  constructor(canvas: Canvas, viewportArea: Rectangle, configurator?: RendererConfiguratorBase) {
    super(canvas);
    configurator = configurator || new RendererConfigurator();
    this.region = viewportArea;
    this.renderPath.fromPathTemplate(configurator.getStageChain(this));
    this.bufferSet = new BufferSet(this);
    this.bufferSet.appendBuffers(configurator.TextureBuffers);
  }

  /**
   * Initialize renderer to be rendererd.
   * Basically, this method are used for initializing GL resources, the other variable and any resources will be initialized when constructor was called.
   * This method is not intended to be called by user manually.
   */
  public initialize(): void {
    this.alternativeTexture = this.__initializeAlternativeTexture();
    this.alternativeCubeTexture = this.__initializeAlternativeCubeTexture();
    const rm = JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
    this.defaultRenderBuffer = rm.createRBO(this.id + ".rbo.default", this.region.Width, this.region.Height);
    this.on("resize", () => {
      JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager).getRBO(this.id + ".rbo.default").resize(this.region.Width, this.region.Height);
    });
  }

  public dispose(): void {
   this.defaultRenderBuffer.dispose();
   this.alternativeTexture.dispose();
   this.alternativeCubeTexture.dispose();
   this.bufferSet.dispose();
  }

  public render(scene: Scene): void {
    RenderPathExecutor.processRender(this, scene);
  }


  /**
   * It will be called before processing renderer.
   * If you need to override this method, you need to call same method of super class first.
   */
  public beforeRender(): void {
    this.applyDefaultBufferViewport();
    this.canvas.beforeRender(this);
  }

  /**
   * It will be called after processing renderer.
   * If you need to override this method, you need to call same method of super class first.
   */
  public afterRender(): void {
    this.gl.flush();
    this.canvas.afterRender(this);
  }

  /**
   * Apply viewport configuration
   */
  public applyDefaultBufferViewport(): void {
    this.gl.viewport(this.region.Left, this.canvas.region.Height - this.region.Bottom, this.region.Width, this.region.Height);
  }

  public applyRendererBufferViewport(): void {
    this.gl.viewport(0, 0, this.region.Width, this.region.Height);
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

}


export default BasicRenderer;
