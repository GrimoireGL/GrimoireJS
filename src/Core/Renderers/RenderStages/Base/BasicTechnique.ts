import MaterialDrawer from "../../../Materials/MaterialDrawer";
import IRenderer from "../../IRenderer";
import IGLContainer from "../../../Canvas/GL/IGLContainer";
import RBO from "../../../Resources/RBO/RBO";
import TextureBase from "../../../Resources/Texture/TextureBase";
import RenderStageConfigUtility from "./RenderStageConfigUtility";
import IFBOBindingConfig from "./IFBOBindingConfig";
import BasicRenderStage from "./BasicRenderStage";
import XMLRenderConfigUtility from "../../../Pass/XMLRenderConfigUtility";
import IRenderStageRendererConfigure from "../IRenderStageRendererConfigure";
import MaterialManager from "../../../Materials/MaterialManager";
import BasicMaterial from "../../../Materials/BasicMaterial";
import SceneObject from "../../../SceneObjects/SceneObject";
import FBO from "../../../Resources/FBO/FBO";
import JThreeObjectWithID from "../../../../Base/JThreeObjectWithID";
import ContextComponents from "../../../../ContextComponents";
import ResourceManager from "../../../ResourceManager";
import JThreeContext from "../../../../JThreeContext";
import FBOWrapper from "../../../Resources/FBO/FBOWrapper";
import BufferInput from "../../BufferInput";
import Scene from "../../../Scene";
class BasicTechnique extends JThreeObjectWithID implements IGLContainer {

  public defaultMaterial: BasicMaterial;

  public defaultRenderConfigure: IRenderStageRendererConfigure;

  public gl: WebGLRenderingContext;

  protected __renderStage: BasicRenderStage;

  protected __renderer: IRenderer;

  protected __fbo: FBO;

  protected __fboInitialized: boolean = false;

  private _wireFramed: boolean = false;

  private _techniqueDocument: Element;

  private _target: string;

  private _fboBindingInfo: IFBOBindingConfig;

  private _techniqueIndex: number;

  constructor(renderStage: BasicRenderStage, technique: Element, techniqueIndex: number) {
    super();
    this.__renderStage = renderStage;
    this.__renderer = renderStage.renderer;
    this.gl = renderStage.gl;
    this._techniqueDocument = technique;
    this._techniqueIndex = techniqueIndex;
    const rc = XMLRenderConfigUtility.parseRenderConfig(technique);
    this.defaultRenderConfigure = XMLRenderConfigUtility.mergeRenderConfigure(rc, this.__renderStage.getSuperRendererConfigure());
    this._target = this._techniqueDocument.getAttribute("target");
    this._wireFramed = this._techniqueDocument.getAttribute("wireframe") === "true";
    if (!this._target) { this._target = "scene"; }
    this._fboBindingInfo = RenderStageConfigUtility.parseFBOConfiguration(this._techniqueDocument.getElementsByTagName("fbo").item(0), renderStage.renderer.canvas);
    if (this._target !== "scene") {
      this.defaultMaterial = this._getMaterial();
    }
  }

  public get Target(): string {
    return this._target;
  }

  public preTechnique(scene: Scene): void {
    this._applyBufferConfiguration(scene);
  }

  public render(scene: Scene, object: SceneObject, techniqueCount: number, techniqueIndex: number): void {
    switch (this.Target) {
      case "scene":
        const materialGroup = this._techniqueDocument.getAttribute("materialGroup");
        MaterialDrawer.drawForMaterials(scene, this.__renderStage, object, techniqueCount, techniqueIndex, materialGroup, this._wireFramed);
        break;
      default:
        XMLRenderConfigUtility.applyAll(this.gl, this.defaultRenderConfigure);
        MaterialDrawer.drawForMaterial(scene, this.__renderStage, object, techniqueCount, techniqueIndex, this.defaultMaterial, this._wireFramed);
    }
  }

  protected __initializeFBO(texs: BufferInput): void {
    this.__fboInitialized = true;
    const rm = JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
    this.__fbo = rm.createFBO("jthree.technique." + this.id);
    const fboWrapper = this.__fbo.getForGL(this.gl);
    this._attachRBOConfigure(fboWrapper);
    this._attachTextureConfigure(fboWrapper);
  }

  private _getMaterial(): BasicMaterial {
    const rawMaterials = this._techniqueDocument.getElementsByTagName("material");
    if (rawMaterials.length > 0) {
      const materialDocument = <HTMLElement>rawMaterials.item(0);
      return new BasicMaterial(materialDocument.outerHTML, this.__renderStage.stageName + this._techniqueIndex);
    }
    const mm = JThreeContext.getContextComponent<MaterialManager>(ContextComponents.MaterialManager);
    const matName = this._techniqueDocument.getAttribute("material");
    if (!matName) {
      console.error("material name was not specified.");
    }
    return mm.constructMaterial(matName);
  }

  private _attachTextureConfigure(fboWrapper: FBOWrapper): void {
    // TODO support for multiple rendering buffer
    const colorConfigure = this._fboBindingInfo[0];
    fboWrapper.attachTexture(WebGLRenderingContext.COLOR_ATTACHMENT0, this.__renderStage.bufferTextures[colorConfigure.name] as TextureBase);
  }

  private _attachRBOConfigure(fboWrapper: FBOWrapper): void {
    const texs = this.__renderStage.bufferTextures;
    if (!this._fboBindingInfo.rbo) {// When there was no rbo tag in fbo tag.
      fboWrapper.attachRBO(WebGLRenderingContext.DEPTH_ATTACHMENT, null); // Unbind render buffer
    } else {
      const rboConfigure = this._fboBindingInfo.rbo;
      let targetBuffer: TextureBase | RBO;
      let isRBO = true;
      if (rboConfigure.name === "default") {
        targetBuffer = texs.defaultRenderBuffer;
      } else {
        if (!texs[rboConfigure.name]) {
          throw new Error("Specified render buffer was not found");
        } else {
          targetBuffer = texs[rboConfigure.name];
          isRBO = false;
        }
      }
      if (isRBO) {
        switch (rboConfigure.type) {
          case "stencil":
            fboWrapper.attachRBO(WebGLRenderingContext.STENCIL_ATTACHMENT, targetBuffer as RBO);
            break;
          case "depthstencil":
            fboWrapper.attachRBO(WebGLRenderingContext.DEPTH_STENCIL_ATTACHMENT, targetBuffer as RBO);
            break;
          default:
          case "depth":
            fboWrapper.attachRBO(WebGLRenderingContext.DEPTH_ATTACHMENT, targetBuffer as RBO);
            break;
        }
      } else {
        switch (rboConfigure.type) {
          case "stencil":
            fboWrapper.attachTexture(WebGLRenderingContext.STENCIL_ATTACHMENT, targetBuffer as TextureBase);
            break;
          case "depthstencil":
            fboWrapper.attachTexture(WebGLRenderingContext.DEPTH_STENCIL_ATTACHMENT, targetBuffer as TextureBase);
            break;
          default:
          case "depth":
            fboWrapper.attachTexture(WebGLRenderingContext.DEPTH_ATTACHMENT, targetBuffer as TextureBase);
            break;
        }
      }
    }
  }

  private _applyBufferConfiguration(scene: Scene): void {
    const texs = this.__renderStage.bufferTextures;
    if (!this._fboBindingInfo || !this._fboBindingInfo[0]) { // When fbo configuration was not specified
      // if there was no fbo configuration, use screen buffer as default
      this._applyViewport(true);
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
      return;
    } else { // Process fbo binding here
      // Check primary buffer was specified
      if (this._fboBindingInfo.primaryName && !texs[this._fboBindingInfo.primaryName]) {
        this._onPrimaryBufferFail();
        return;
      }
      this._applyViewport(false);
      if (!this.__fboInitialized) {
        this.__initializeFBO(texs);
      }
      this.__fbo.getForGL(this.gl).bind();
      this._clearBuffers();
    }
  }
  /**
   * When primary buffer was failed to bind, this method bind default buffer as drawing target.
   */
  private _onPrimaryBufferFail(): void {
    this._applyViewport(true);
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    if (this._fboBindingInfo.rbo && this._fboBindingInfo.rbo.needClear) {
      this.gl.depthMask(true);
      this.gl.clearDepth(this._fboBindingInfo.rbo.clearDepth);
      this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
    }
  }

  private _clearBuffers(): void {
    // Clear color buffer
    // TODO: support for multiple buffers
    if (this._fboBindingInfo[0] && this._fboBindingInfo[0].needClear) {
      const buffer = this._fboBindingInfo[0];
      const col = buffer.clearColor;
      this.gl.colorMask(true, true, true, true);
      this.gl.clearColor(col.X, col.Y, col.Z, col.W);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }
    if (this._fboBindingInfo.rbo && this._fboBindingInfo.rbo.needClear) {
      this.gl.depthMask(true);
      this.gl.clearDepth(this._fboBindingInfo.rbo.clearDepth);
      this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
    }
  }

  private _applyViewport(isDefault: boolean): void {
    this.__renderStage.renderer.applyViewport(isDefault);
  }
}

export default BasicTechnique;
