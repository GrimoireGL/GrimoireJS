import RSMLRenderStage = require("./RSMLRenderStage");
import XMLRenderConfigUtility = require("../../../Materials/Base/XMLRenderConfigUtility");
import IRenderStageRendererConfigure = require("../IRenderStageRendererConfigure");
import MaterialManager = require("../../../Materials/Base/MaterialManager");
import BasicMaterial = require("../../../Materials/Base/BasicMaterial");
import Vector4 = require("../../../../Math/Vector4");
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

  private _depthConfigureElement: Element;

  private _fboConfigureElement: Element;

  private _colorConfigureElements: NodeListOf<Element>;

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
    this._fboConfigureElement = this._techniqueDocument.getElementsByTagName("fbo").item(0);
    if (this._fboConfigureElement) {
      this._depthConfigureElement = this._fboConfigureElement.getElementsByTagName("rbo").item(0);
      this._colorConfigureElements = this._fboConfigureElement.getElementsByTagName("color");
    }
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
    const colorConfigure = this._colorConfigureElements.item(0);
    let register = +colorConfigure.getAttribute("register");
    if (!register) { register = 0; }
    const name = colorConfigure.getAttribute("name");
    if (!name) { console.error("texture name was not provided!"); }
    const colorBuffer = texs[name];
    fboWrapper.attachTexture(FrameBufferAttachmentType.ColorAttachment0, colorBuffer);
  }

  private _attachRBOConfigure(fboWrapper: FBOWrapper) {
    if (!this._depthConfigureElement) {// When there was no rbo tag in fbo tag.
      // fboWrapper.attachRBO(FrameBufferAttachmentType.DepthStencilAttachment, null);//Unbind render buffer
    } else {
      const attachmentType = this._depthConfigureElement.getAttribute("type");
      const target = this._depthConfigureElement.getAttribute("target");
      let targetBuffer;
      if (!target) {
        targetBuffer = this._renderStage.DefaultRBO;
      }
      switch (attachmentType) {
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
    if (!this._fboConfigureElement) {
      // if there was no fbo configuration, use screen buffer as default
      this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
      return;
    } else {
      const primaryBuffer = this._fboConfigureElement.getAttribute("primary");
      if (primaryBuffer && !texs[primaryBuffer]) {
        this._onPrimaryBufferFail(primaryBuffer, texs);
        return;
      }
      if (true) {
        this.__initializeFBO(texs);
      }
      this.__fbo.getForContext(this._renderStage.Renderer.Canvas).bind();
      this._clearBuffers();
    }
  }

  private _onPrimaryBufferFail(primaryName: string, texs: ResolvedChainInfo): void {
    const colors = this._fboConfigureElement.getElementsByTagName("color");
    for (let i = 0; i < colors.length; i++) {
      if (colors.item(i).getAttribute("name") !== primaryName) {
        continue;
      } else {
        const color = colors.item(i);
        const clearColor = color.getAttribute("clearColor");
        if (clearColor) {
          const col = Vector4.parse(clearColor);
          this._gl.clearColor(col.X, col.Y, col.Z, col.W);
          this._gl.clear(this._gl.COLOR_BUFFER_BIT);
        }
      }
    }
  }

  private _clearBuffers(): void {
    let clearFlag: number = 0;
    for (let colorBufferIndex = 0; colorBufferIndex < this._colorConfigureElements.length; colorBufferIndex++) {
      const colorBufferConfigure = this._colorConfigureElements.item(colorBufferIndex);
      const clearColor = colorBufferConfigure.getAttribute("clearColor");
      if (!clearColor) {
        this._gl.clearColor(0, 0, 0, 0);
      } else if (clearColor === "none") {
        continue;
      } else {
        const colorVector = Vector4.parse(clearColor);
        if (!colorVector) {
          console.error(`Could not parse the color ${clearColor}`);
        } else {
          this._gl.clearColor(colorVector.X, colorVector.Y, colorVector.Z, colorVector.W);
          clearFlag |= this._gl.COLOR_BUFFER_BIT;
        }
      }
    }
    if (this._depthConfigureElement) {
      const clearDepth = this._depthConfigureElement.getAttribute("clearDepth");
      const clear = this._depthConfigureElement.getAttribute("clear");
      if (clear !== "false") {
        let depth;
        if (!clearDepth) {
          depth = 1.0;
        } else {
          depth = parseFloat(clearDepth);
        }
        this._gl.depthMask(true);
        this._gl.clearDepth(depth);
        clearFlag |= this._gl.DEPTH_BUFFER_BIT;
      }
    }
    this._gl.clear(clearFlag);
  }
}

export = BasicTechnique;
