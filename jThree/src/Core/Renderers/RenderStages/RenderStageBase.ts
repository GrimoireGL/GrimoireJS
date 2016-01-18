import Material = require("../../Materials/Material");
import IRenderStageRendererConfigure = require("./IRenderStageRendererConfigure");
import JThreeObjectWithID = require('../../../Base/JThreeObjectWithID');
import BasicRenderer = require('../BasicRenderer');
import SceneObject = require('../../SceneObject');
import Scene = require('../../Scene')
import Program = require('../../Resources/Program/Program');
import ShaderType = require("../../../Wrapper/ShaderType");
import ResolvedChainInfo = require('../ResolvedChainInfo');
import TextureBase = require('../../Resources/Texture/TextureBase');
import RBO = require('../../Resources/RBO/RBO');
import FBO = require('../../Resources/FBO/FBO');
import FBOWrapper = require('../../Resources/FBO/FBOWrapper');
import Delegates = require('../../../Base/Delegates');
import GLCullMode = require('../../../Wrapper/GLCullMode');
import GLFeature = require('../../../Wrapper/GLFeatureType');
import FrameBufferAttachmentType = require('../../../Wrapper/FrameBufferAttachmentType');
import FboBindData = require("../FBOBindData");
import RenderStageConfig = require("../RenderStageConfig");
import ContextComponents = require("../../../ContextComponents");
import JThreeContext = require("../../../JThreeContext");
import ResourceManager = require("../../ResourceManager");
abstract class RenderStageBase extends JThreeObjectWithID {

  private renderer: BasicRenderer;

  public getDefaultRendererConfigure(techniqueIndex: number): IRenderStageRendererConfigure {
    return {
      cullOrientation: "BACK",
      depthEnabled: true,
      depthMode: "LESS",
      depthMask: true,
      blendEnabled: true,
      blendSrcFactor: "SRC_ALPHA",
      blendDstFactor: "ONE_MINUS_SRC_ALPHA",
      redMask: true,
      greenMask: true,
      blueMask: true,
      alphaMask: true
    };
  }

	/**
	 * Getter for renderer having this renderstage
	 */
  public get Renderer(): BasicRenderer {
    return this.renderer;
  }

  public get GL() {
    return this.Renderer.GL;
  }

  private get ResourceManager() {
    return JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
  }

  constructor(renderer: BasicRenderer) {
    super();

    this.renderer = renderer;
  }

  public preStage(scene: Scene, texs: ResolvedChainInfo) {
    return;
  }

  public postStage(scene: Scene, texs: ResolvedChainInfo) {
    return;
  }

	/**
	 * This method will be called before process render in each pass
	 */
  public preTechnique(scene: Scene, techniqueIndex: number, texs: ResolvedChainInfo) {
    return;
  }
	/**
	 * This method will be called after process render in each pass.
	 */
  public postTechnique(scene: Scene, techniqueIndex: number, texs: ResolvedChainInfo) {
    this.Renderer.GL.flush();
  }

  public abstract render(scene: Scene, object: SceneObject, techniqueIndex: number, texs: ResolvedChainInfo);

  public needRender(scene: Scene, object: SceneObject, techniqueIndex: number): boolean {
    return false;
  }

  public getTechniqueCount(scene: Scene) {
    return 1;
  }

  public getTarget(techniqueIndex: number): string {
    return "scene";
  }

  public drawForMaterials(scene: Scene, object: SceneObject, techniqueIndex: number, texs: ResolvedChainInfo, materialGroup: string) {
    var materials = object.getMaterials(materialGroup);
    for (var i = 0; i < materials.length; i++) {
      this.drawForMaterial(scene, object, techniqueIndex, texs, materials[i]);
    }
  }

  public drawForMaterial(scene: Scene, object: SceneObject, techniqueIndex: number, texs: ResolvedChainInfo, material: Material): void {
    if (!material || !material.Initialized || !material.Enabled) return;
    for (var pass = 0; pass < material.getPassCount(techniqueIndex); pass++) {
      material.apply({
        scene: scene,
        renderStage: this,
        object: object,
        textureResource: texs,
        techniqueIndex: techniqueIndex,
        passIndex: pass,
        camera: this.Renderer.Camera
      });
      object.Geometry.drawElements(this.Renderer.ContextManager, material);
    }
  }

	/**
	 * Get default fbo that is allocated for this renderer.
	 */
  public get DefaultFBO(): FBO {
    return this.ResourceManager.getFBO(this.Renderer.ID + ".fbo.default");
  }

	/**
	 * Get default rbo that is allocated for this renderer.
	 */
  public get DefaultRBO(): RBO {
    return this.ResourceManager.getRBO(this.Renderer.ID + ".rbo.default");
  }
}

export = RenderStageBase;
