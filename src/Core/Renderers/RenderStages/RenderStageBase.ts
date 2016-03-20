import IShaderArgumentContainer from "../../Materials/IShaderArgumentContainer";
import Material from "../../Materials/Material";
import IRenderStageRendererConfigure from "./IRenderStageRendererConfigure";
import JThreeObjectWithID from "../../../Base/JThreeObjectWithID";
import BasicRenderer from "../BasicRenderer";
import SceneObject from "../../SceneObjects/SceneObject";
import Scene from "../../Scene";
import BufferInput from "../BufferInput";
abstract class RenderStageBase extends JThreeObjectWithID implements IShaderArgumentContainer {

  public shaderVariables: {} = {};

  private _renderer: BasicRenderer;


  constructor(renderer: BasicRenderer) {
    super();

    this._renderer = renderer;
  }

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
    return this._renderer;
  }

  public get GL() {
    return this.Renderer.GL;
  }

  public preStage(scene: Scene, texs: BufferInput): void {
    return;
  }

  public postStage(scene: Scene, texs: BufferInput): void {
    return;
  }

	/**
	 * This method will be called before process render in each pass
	 */
  public preTechnique(scene: Scene, techniqueIndex: number, texs: BufferInput): void {
    return;
  }
	/**
	 * This method will be called after process render in each pass.
	 */
  public postTechnique(scene: Scene, techniqueIndex: number, texs: BufferInput): void {
    this.Renderer.GL.flush();
  }

  public abstract render(scene: Scene, object: SceneObject, techniqueCount: number, techniqueIndex: number, texs: BufferInput): void;

  public needRender(scene: Scene, object: SceneObject, techniqueIndex: number): boolean {
    return false;
  }

  public getTechniqueCount(scene: Scene): number {
    return 1;
  }

  public getTarget(techniqueIndex: number): string {
    return "scene";
  }

  public drawForMaterials(scene: Scene, object: SceneObject, techniqueCount: number, techniqueIndex: number, texs: BufferInput, materialGroup: string, isWireframed: boolean): void {
    if (!object.isVisible) {
      return;
    }
    const materials = object.getMaterials(materialGroup);
    for (let i = 0; i < materials.length; i++) {
      this.drawForMaterial(scene, object, techniqueCount, techniqueIndex, texs, materials[i], isWireframed);
    }
  }

  public drawForMaterial(scene: Scene, object: SceneObject, techniqueCount: number, techniqueIndex: number, texs: BufferInput, material: Material, isWireframed: boolean): void {
    if (!material || !material.Initialized || !material.Enabled || !object.isVisible) { return; }
    const passCount = material.getPassCount(techniqueIndex);
    for (let pass = 0; pass < passCount; pass++) {
      material.apply({
        scene: scene,
        renderStage: this,
        renderer: this.Renderer,
        object: object,
        textureResource: texs,
        techniqueIndex: techniqueIndex,
        techniqueCount: techniqueCount,
        passIndex: pass,
        passCount: passCount,
        camera: this.Renderer.camera
      });
      if (isWireframed) {
        object.Geometry.drawWireframe(this.Renderer.Canvas, material);
        return;
      }
      object.Geometry.drawElements(this.Renderer.Canvas, material);
    }
  }
}

export default RenderStageBase;
