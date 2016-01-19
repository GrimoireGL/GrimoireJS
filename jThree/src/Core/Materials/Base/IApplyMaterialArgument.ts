import Camera = require("../../Camera/Camera");
import RenderStageBase = require("../../Renderers/RenderStages/RenderStageBase");
import ResolvedChainInfo = require("../../Renderers/ResolvedChainInfo");
import SceneObject = require("../../SceneObject");
import Scene = require("../../Scene");
interface IApplyMaterialArgument {
  scene: Scene;
  camera: Camera;
  renderStage: RenderStageBase;
  object: SceneObject;
  textureResource: ResolvedChainInfo;
  techniqueIndex: number;
  passIndex: number;
}

export = IApplyMaterialArgument;
