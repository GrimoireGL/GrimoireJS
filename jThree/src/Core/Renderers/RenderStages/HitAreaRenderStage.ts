import SceneObject = require("../../SceneObject");
import ClearTargetType = require("../../../Wrapper/ClearTargetType");
import ResolvedChainInfo = require("../ResolvedChainInfo");
import Scene = require("../../Scene");
import RenderStageBase = require("./RenderStageBase");

class HitAreaRenderStage extends RenderStageBase
{
  private _indexCache:number = 0;



  public preTechnique(scene: Scene, passCount: number, texs: ResolvedChainInfo) {
    this.bindAsOutBuffer(this.DefaultFBO, [
        { texture: texs["OUT"], target: 0 }
    ], () =>
        {
            this.GL.clearColor(0, 0, 0, 0);
            this.GL.clear(ClearTargetType.ColorBits|ClearTargetType.DepthBits);
        });
    this._indexCache = 0;
  }

  public render(scene: Scene, object: SceneObject, techniqueIndex: number, texs: ResolvedChainInfo) {
        this.drawForMaterials(scene, object, techniqueIndex, texs,"jthree.materials.hitarea");
        this._indexCache ++;
  }
}

export = HitAreaRenderStage;
