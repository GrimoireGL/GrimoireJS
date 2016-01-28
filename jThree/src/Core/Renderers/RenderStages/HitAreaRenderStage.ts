import RSMLRenderStageBase = require("./RSML/RSMLRenderStage");
import SceneObject = require("../../SceneObjects/SceneObject");
import ResolvedChainInfo = require("../ResolvedChainInfo");
import Scene = require("../../Scene");

class HitAreaRenderStage extends RSMLRenderStageBase {
  constructor(renderer) {
    super(renderer, require("./BuiltIn/HitAreaRenderingStage.html"));
  }

  /**
   * Object index for rendering hit area.
   * (This is internal use)
   * @type {number}
   */
  public ___objectIndex: number = 0;

  public indexObjectPair = {};

  public preTechnique(scene: Scene, techniqueIndex: number, texs: ResolvedChainInfo) {
    super.preTechnique(scene, techniqueIndex, texs);
    this.___objectIndex = 0;
  }

  public render(scene: Scene, object: SceneObject, techniqueCount: number, techniqueIndex: number, texs: ResolvedChainInfo) {
    this.indexObjectPair[this.___objectIndex] = object;
    super.render(scene, object, techniqueCount, techniqueIndex, texs);
    this.___objectIndex++;
  }
}

export = HitAreaRenderStage;
