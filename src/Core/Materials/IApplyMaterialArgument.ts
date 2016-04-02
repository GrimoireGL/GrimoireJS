import RenderStageBase from "../Renderers/RenderStages/RenderStageBase";
import SceneObject from "../SceneObjects/SceneObject";
import Scene from "../Scene";
interface IApplyMaterialArgument {
  scene: Scene;
  renderStage: RenderStageBase;
  object: SceneObject;
  techniqueIndex: number;
  techniqueCount: number;
  passIndex: number;
  passCount: number;
}

export default IApplyMaterialArgument;
