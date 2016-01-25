import Camera = require("../../Camera/Camera");
import RenderStageBase = require("../../Renderers/RenderStages/RenderStageBase");
import ResolvedChainInfo = require("../../Renderers/ResolvedChainInfo");
import SceneObject = require("../../SceneObjects/SceneObject");
import Scene = require("../../Scene");
interface IApplyMaterialArgument {
  scene: Scene;
  camera: Camera;
  renderStage: RenderStageBase;
  object: SceneObject;
  textureResource: ResolvedChainInfo;
  techniqueIndex: number;
  techniqueCount: number;
  passIndex: number;
  passCount: number;
}

export = IApplyMaterialArgument;
