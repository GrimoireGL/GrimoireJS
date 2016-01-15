import RenderStageBase = require("../../Renderers/RenderStages/RenderStageBase");
import ResolvedChainInfo = require("../../Renderers/ResolvedChainInfo");
import SceneObject = require("../../SceneObject");
import Scene = require("../../Scene");
interface IMaterialConfigureArgument {
  scene: Scene;
  renderStage: RenderStageBase;
  object: SceneObject;
  textureResource: ResolvedChainInfo;
  techniqueIndex: number;
  passIndex: number;
}

export = IMaterialConfigureArgument;
