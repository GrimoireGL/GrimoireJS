import Material = require("../../Materials/Material");
import IRenderStageRendererConfigure = require("./IRenderStageRendererConfigure");
import JThreeObjectWithID = require("../../../Base/JThreeObjectWithID");
import BasicRenderer = require("../BasicRenderer");
import SceneObject = require("../../SceneObjects/SceneObject");
import Scene = require("../../Scene");
import ResolvedChainInfo = require("../ResolvedChainInfo");
import RBO = require("../../Resources/RBO/RBO");
import ContextComponents = require("../../../ContextComponents");
import JThreeContext = require("../../../JThreeContext");
import ResourceManager = require("../../ResourceManager");
abstract class RenderStageBase extends JThreeObjectWithID {

  private renderer: BasicRenderer;

  public stageVariables: {} = {};

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

  public abstract render(scene: Scene, object: SceneObject, techniqueCount: number, techniqueIndex: number, texs: ResolvedChainInfo);

  public needRender(scene: Scene, object: SceneObject, techniqueIndex: number): boolean {
    return false;
  }

  public getTechniqueCount(scene: Scene) {
    return 1;
  }

  public getTarget(techniqueIndex: number): string {
    return "scene";
  }

  public drawForMaterials(scene: Scene, object: SceneObject, techniqueCount: number, techniqueIndex: number, texs: ResolvedChainInfo, materialGroup: string) {
    const materials = object.getMaterials(materialGroup);
    for (let i = 0; i < materials.length; i++) {
      this.drawForMaterial(scene, object, techniqueCount, techniqueIndex, texs, materials[i]);
    }
  }

  public drawForMaterial(scene: Scene, object: SceneObject, techniqueCount: number, techniqueIndex: number, texs: ResolvedChainInfo, material: Material): void {
    if (!material || !material.Initialized || !material.Enabled) { return; }
    const passCount = material.getPassCount(techniqueIndex);
    for (let pass = 0; pass < passCount; pass++) {
      material.apply({
        scene: scene,
        renderStage: this,
        object: object,
        textureResource: texs,
        techniqueIndex: techniqueIndex,
        techniqueCount: techniqueCount,
        passIndex: pass,
        passCount: passCount,
        camera: this.Renderer.Camera
      });
      object.Geometry.drawElements(this.Renderer.Canvas, material);
    }
  }

	/**
	 * Get default rbo that is allocated for this renderer.
	 */
  public get DefaultRBO(): RBO {
    const rm = JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
    return rm.getRBO(this.Renderer.ID + ".rbo.default");
  }
}

export = RenderStageBase;
