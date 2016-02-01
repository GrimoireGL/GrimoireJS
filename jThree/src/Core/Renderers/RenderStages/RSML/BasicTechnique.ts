import RSMLRenderConfigUtility from "./RSMLRenderConfigUtility";
import IFBOBindingConfig from "./IFBOBindingConfig";
import RSMLRenderStage from "./RSMLRenderStage";
import XMLRenderConfigUtility from "../../../Materials/Base/XMLRenderConfigUtility";
import IRenderStageRendererConfigure from "../IRenderStageRendererConfigure";
import MaterialManager from "../../../Materials/Base/MaterialManager";
import BasicMaterial from "../../../Materials/Base/BasicMaterial";
import SceneObject from "../../../SceneObjects/SceneObject";
import FBO from "../../../Resources/FBO/FBO";
import JThreeObjectWithID from "../../../../Base/JThreeObjectWithID";
import ContextComponents from "../../../../ContextComponents";
import ResourceManager from "../../../ResourceManager";
import JThreeContext from "../../../../JThreeContext";
import FBOWrapper from "../../../Resources/FBO/FBOWrapper";
import ResolvedChainInfo from "../../ResolvedChainInfo";
import Scene from "../../../Scene";
class BasicTechnique extends JThreeObjectWithID {

  public _defaultMaterial: BasicMaterial;

  public defaultRenderConfigure: IRenderStageRendererConfigure;

  protected _renderStage: RSMLRenderStage;

  protected __fbo: FBO;

  protected __fboInitialized: boolean = false;

  private _techniqueDocument: Element;

  private _target: string;

  private _fboBindingInfo: IFBOBindingConfig;

  private _techniqueIndex: number;


  protected get _gl(): WebGLRenderingContext {
    return this._renderStage.GL;
  }

  constructor(renderStage: RSMLRenderStage, technique: Element, techniqueIndex: number) {
    super();
    this._renderStage = renderStage;
    this._techniqueDocument = technique;
    this._techniqueIndex = techniqueIndex;
    this.defaultRenderConfigure = XMLRenderConfigUtility.parseRenderConfig(technique, this._renderStage.getSuperRendererConfigure());
    this._target = this._techniqueDocument.getAttribute("target");
    if (!this._target) { this._target = "scene"; }
    this._fboBindingInfo = RSMLRenderConfigUtility.parseFBOConfiguration(this._techniqueDocument.getElementsByTagName("fbo").item(0));
    if (this._target !== "scene") {
      this._defaultMaterial = this._getMaterial();
    }
  }

  public get Target(): string {
    return this._target;
  }

  public preTechnique(scene: Scene, texs: ResolvedChainInfo): void {
    this._applyBufferConfiguration(scene, texs);
  }

  public render(scene: Scene, object: SceneObject, techniqueCount: number, techniqueIndex: number, texs: ResolvedChainInfo): void {
    switch (this.Target) {
      case "scene":
        const materialGroup = this._techniqueDocument.getAttribute("materialGroup");
        this._renderStage.drawForMaterials(scene, object, techniqueCount, techniqueIndex, texs, materialGroup);
        break;
      default:
        this._defaultMaterial.materialVariables = this._renderStage.stageVariables;
        XMLRenderConfigUtility.applyAll(this._gl, this.defaultRenderConfigure);
        this._renderStage.drawForMaterial(scene, object, techniqueCount, techniqueIndex, texs, this._defaultMaterial);
    }
  }

  protected __initializeFBO(texs: ResolvedChainInfo): void {
    this.__fboInitialized = true;
    const rm = JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
    this.__fbo = rm.createFBO("jthree.technique." + this.ID);
    const fboWrapper = this.__fbo.getForContext(this._renderStage.Renderer.Canvas);
    this._attachRBOConfigure(fboWrapper);
    this._attachTextureConfigure(fboWrapper, texs);
  }

  private _getMaterial(): BasicMaterial {
    const rawMaterials = this._techniqueDocument.getElementsByTagName("material");
    if (rawMaterials.length > 0) {
      const materialDocument = <HTMLElement>rawMaterials.item(0);
      return new BasicMaterial(materialDocument.outerHTML, this._renderStage.stageName + this._techniqueIndex);
    }
    const mm = JThreeContext.getContextComponent<MaterialManager>(ContextComponents.MaterialManager);
    const matName = this._techniqueDocument.getAttribute("material");
    if (!matName) {
      console.error("material name was not specified.");
    }
    return mm.constructMaterial(matName);
  }

  private _attachTextureConfigure(fboWrapper: FBOWrapper, texs: ResolvedChainInfo) {
    // TODO support for multiple rendering buffer
    const colorConfigure = this._fboBindingInfo[0];
    fboWrapper.attachTexture(WebGLRenderingContext.COLOR_ATTACHMENT0, texs[colorConfigure.name]);
  }

  private _attachRBOConfigure(fboWrapper: FBOWrapper) {
    if (!this._fboBindingInfo.rbo) {// When there was no rbo tag in fbo tag.
      // fboWrapper.attachRBO(FrameBufferAttachmentType.DepthStencilAttachment, null);//Unbind render buffer
    } else {
      const rboConfigure = this._fboBindingInfo.rbo;
      let targetBuffer;
      if (rboConfigure.name === "default") {
        targetBuffer = this._renderStage.DefaultRBO;
      }
      switch (rboConfigure.type) {
        case "stencil":
          fboWrapper.attachRBO(WebGLRenderingContext.STENCIL_ATTACHMENT, targetBuffer);
          break;
        case "depthstencil":
          fboWrapper.attachRBO(WebGLRenderingContext.DEPTH_STENCIL_ATTACHMENT, targetBuffer);
          break;
        default:
        case "depth":
          fboWrapper.attachRBO(WebGLRenderingContext.DEPTH_ATTACHMENT, targetBuffer);
          break;
      }
    }
  }

  private _applyBufferConfiguration(scene: Scene, texs: ResolvedChainInfo): void {
    if (!this._fboBindingInfo || !this._fboBindingInfo[0]) { // When fbo configuration was not specified
      // if there was no fbo configuration, use screen buffer as default
      this._applyViewport(true);
      this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
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
      this.__fbo.getForContext(this._renderStage.Renderer.Canvas).bind();
      this._clearBuffers();
    }
  }
  /**
   * When primary buffer was failed to bind, this method bind default buffer as drawing target.
   */
  private _onPrimaryBufferFail(): void {
    this._applyViewport(true);
    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
    // if (primaryBuffer.needClear) {  // this code might cause bug when multiple viewports were used
    //   this._gl.colorMask(true, true, true, true);
    //   const col = primaryBuffer.clearColor;
    //   this._gl.clearColor(col.X, col.Y, col.Z, col.W);
    //   this._gl.clear(this._gl.COLOR_BUFFER_BIT);
    // }
    if (this._fboBindingInfo.rbo && this._fboBindingInfo.rbo.needClear) {
      this._gl.depthMask(true);
      this._gl.clearDepth(this._fboBindingInfo.rbo.clearDepth);
      this._gl.clear(this._gl.DEPTH_BUFFER_BIT);
    }
  }

  private _clearBuffers(): void {
    // Clear color buffer
    // TODO: support for multiple buffers
    if (this._fboBindingInfo[0] && this._fboBindingInfo[0].needClear) {
      const buffer = this._fboBindingInfo[0];
      const col = buffer.clearColor;
      this._gl.colorMask(true, true, true, true);
      this._gl.clearColor(col.X, col.Y, col.Z, col.W);
      this._gl.clear(this._gl.COLOR_BUFFER_BIT);
    }
    if (this._fboBindingInfo.rbo && this._fboBindingInfo.rbo.needClear) {
      this._gl.depthMask(true);
      this._gl.clearDepth(this._fboBindingInfo.rbo.clearDepth);
      this._gl.clear(this._gl.DEPTH_BUFFER_BIT);
    }
  }

  private _applyViewport(isDefault: boolean): void {
    if (isDefault) {
      this._renderStage.Renderer.applyDefaultBufferViewport();
    } else {
      this._renderStage.Renderer.applyRendererBufferViewport();
    }
  }
}

export default BasicTechnique;
