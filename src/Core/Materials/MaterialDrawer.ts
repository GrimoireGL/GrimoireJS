import RenderStageBase from "../Renderers/RenderStages/RenderStageBase";
import Material from "./Material";
import SceneObject from "../SceneObjects/SceneObject";
import Scene from "../Scene";
/**
 * Provides feature to use material to draw specific geometry in specified situation.
 * This is most primitive caller for materials and geometries.
 */
class MaterialDrawer {
  public static drawForMaterials(scene: Scene, renderStage: RenderStageBase, object: SceneObject, techniqueCount: number, techniqueIndex: number, materialGroup: string, isWireframed: boolean): void {
    if (!object.isVisible) {
      return;
    }
    const materials = object.getMaterials(materialGroup);
    for (let i = 0; i < materials.length; i++) {
      MaterialDrawer.drawForMaterial(scene, renderStage, object, techniqueCount, techniqueIndex, materials[i], isWireframed);
    }
  }

  public static drawForMaterial(scene: Scene, renderStage: RenderStageBase, object: SceneObject, techniqueCount: number, techniqueIndex: number, material: Material, isWireframed: boolean): void {
    if (!material || !material.Initialized || !material.Enabled || !object.isVisible) { return; }
    const passCount = material.getPassCount(techniqueIndex);
    for (let pass = 0; pass < passCount; pass++) {
      material.apply({
        scene: scene,
        renderStage: renderStage,
        object: object,
        techniqueIndex: techniqueIndex,
        techniqueCount: techniqueCount,
        passIndex: pass,
        passCount: passCount,
      });
      if (isWireframed) {
        object.Geometry.drawWireframe(renderStage.renderer.canvas, material);
        return;
      }
      object.Geometry.drawElements(renderStage.renderer.canvas, material);
    }
  }
}

export default MaterialDrawer;
