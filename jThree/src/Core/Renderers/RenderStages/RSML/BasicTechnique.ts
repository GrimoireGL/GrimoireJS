import RSMLRenderConfigUtility = require("./RSMLRenderConfigUtility");
import IFBOBindingConfig = require("./IFBOBindingConfig");
import RSMLRenderStage = require("./RSMLRenderStage");
import XMLRenderConfigUtility = require("../../../Materials/Base/XMLRenderConfigUtility");
import IRenderStageRendererConfigure = require("../IRenderStageRendererConfigure");
import MaterialManager = require("../../../Materials/Base/MaterialManager");
import BasicMaterial = require("../../../Materials/Base/BasicMaterial");
import SceneObject = require("../../../SceneObject");
import FrameBufferAttachmentType = require("../../../../Wrapper/FrameBufferAttachmentType");
import FBO = require("../../../Resources/FBO/FBO");
import JThreeObjectWithID = require("../../../../Base/JThreeObjectWithID");
import ContextComponents = require("../../../../ContextComponents");
import ResourceManager = require("../../../ResourceManager");
import JThreeContext = require("../../../../JThreeContext");
import FBOWrapper = require("../../../Resources/FBO/FBOWrapper");
import ResolvedChainInfo = require("../../ResolvedChainInfo");
import Scene = require("../../../Scene");
class BasicTechnique extends JThreeObjectWithID {

  public _defaultMaterial: BasicMaterial;

  public defaultRenderConfigure: IRenderStageRendererConfigure;

  protected _renderStage: RSMLRenderStage;

  protected __fbo: FBO;

  protected __fboInitialized: boolean = false;

  private _techniqueDocument: Element;

  private _target: string;

  private _fboBindingInfo: IFBOBindingConfig;


  protected get _gl(): WebGLRenderingContext {
    return this._renderStage.GL;
  }

  constructor(renderStage: RSMLRenderStage, technique: Element) {
    super();
    this._renderStage = renderStage;
    this._techniqueDocument = technique;
    this.defaultRenderConfigure = XMLRenderConfigUtility.parseRenderConfig(technique, this._renderStage.getSuperRendererConfigure());
    this._target = this._techniqueDocument.getAttribute("target");
    if (!this._target) { this._target = "scene"; }
    this._fboBindingInfo = RSMLRenderConfigUtility.parseFBOConfiguration(this._techniqueDocument.getElementsByTagName("fbo").item(0));
    if (this._target !== "scene") {
      const mm = JThreeContext.getContextComponent<MaterialManager>(ContextComponents.MaterialManager);
      const matName = this._techniqueDocument.getAttribute("material");
      if (!matName) { console.error("material name was not specified."); }
      this._defaultMaterial = mm.constructMaterial(matName);
    }
  }

  public get Target(): string {
    return this._target;
  }

  public preTechnique(scene: Scene, texs: ResolvedChainInfo): void {
    this._applyBufferConfiguration(scene, texs);
  }

  public render(scene: Scene, object: SceneObject, techniqueIndex: number, texs: ResolvedChainInfo): void {
    switch (this.Target) {
      case "scene":
        const materialGroup = this._techniqueDocument.getAttribute("materialGroup");
        this._renderStage.drawForMaterials(scene, object, techniqueIndex, texs, materialGroup);
        break;
      default:
        this._defaultMaterial.materialVariables = this._renderStage.stageVariables;
        XMLRenderConfigUtility.applyAll(this._gl, this.defaultRenderConfigure);
        this._renderStage.drawForMaterial(scene, object, techniqueIndex, texs, this._defaultMaterial);
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

  private _attachTextureConfigure(fboWrapper: FBOWrapper, texs: ResolvedChainInfo) {
   // TODO support for multiple rendering buffer
    const colorConfigure = this._fboBindingInfo[0];
    fboWrapper.attachTexture(FrameBufferAttachmentType.ColorAttachment0, texs[colorConfigure.name]);
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
          fboWrapper.attachRBO(FrameBufferAttachmentType.StencilAttachment, targetBuffer);
          break;
        case "depthstencil":
          fboWrapper.attachRBO(FrameBufferAttachmentType.DepthStencilAttachment, targetBuffer);
          break;
        default:
        case "depth":
          fboWrapper.attachRBO(FrameBufferAttachmentType.DepthAttachment, targetBuffer);
          break;
      }
    }
  }

  private _applyBufferConfiguration(scene: Scene, texs: ResolvedChainInfo): void {
    if (!this._fboBindingInfo || !this._fboBindingInfo[0]) { // When fbo configuration was not specified
      // if there was no fbo configuration, use screen buffer as default
      this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
      return;
    } else { // Process fbo binding here
      // Check primary buffer was specified
      if (this._fboBindingInfo.primaryName && !texs[this._fboBindingInfo.primaryName]) {
        this._onPrimaryBufferFail();
        return;
      }
      if (!this.__fboInitialized) {
        this.__initializeFBO(texs);
      }
      this.__fbo.getForContext(this._renderStage.Renderer.Canvas).bind();
      this._clearBuffers();
    }
  }

  private _onPrimaryBufferFail(): void {
    const primaryBuffer = this._fboBindingInfo[this._fboBindingInfo.primaryIndex];
    if (primaryBuffer.needClear) {
      this._gl.colorMask(true, true, true, true);
      const col = primaryBuffer.clearColor;
      this._gl.clearColor(col.X, col.Y, col.Z, col.W);
      this._gl.clear(this._gl.COLOR_BUFFER_BIT);
    }
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
}

export = BasicTechnique;
