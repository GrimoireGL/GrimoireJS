import BasicRenderer from "../Renderers/BasicRenderer";
import Camera from "../SceneObjects/Camera/Camera";
import RenderStageBase from "../Renderers/RenderStages/RenderStageBase";
import BufferInput from "../Renderers/BufferInput";
import SceneObject from "../SceneObjects/SceneObject";
import Scene from "../Scene";
interface IApplyMaterialArgument {
  scene: Scene;
  camera: Camera;
  renderer: BasicRenderer;
  renderStage: RenderStageBase;
  object: SceneObject;
  textureResource: BufferInput;
  techniqueIndex: number;
  techniqueCount: number;
  passIndex: number;
  passCount: number;
}

export default IApplyMaterialArgument;
