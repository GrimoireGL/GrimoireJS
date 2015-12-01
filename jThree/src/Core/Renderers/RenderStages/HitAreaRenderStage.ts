import SceneObject = require("../../SceneObject");
import ClearTargetType = require("../../../Wrapper/ClearTargetType");
import ResolvedChainInfo = require("../ResolvedChainInfo");
import Scene = require("../../Scene");
import RenderStageBase = require("./RenderStageBase");

class HitAreaRenderStage extends RenderStageBase
{
  /**
   * Object index for rendering hit area.
   * (This is internal use)
   * @type {number}
   */
  public ___objectIndex:number = 0;

  public indexObjectPair = {};

  public preTechnique(scene: Scene, passCount: number, texs: ResolvedChainInfo) {
    this.bindAsOutBuffer(this.DefaultFBO, [
        { texture: texs["OUT"], target: 0 },
        {texture:this.DefaultRBO,type:"rbo",target:"depth"}
    ], () =>
        {
            this.GL.clearColor(1, 1, 0, 1);
            this.GL.clear(ClearTargetType.ColorBits|ClearTargetType.DepthBits);
        });
    this.___objectIndex = 0;
  }

  public render(scene: Scene, object: SceneObject, techniqueIndex: number, texs: ResolvedChainInfo) {
        this.indexObjectPair[this.___objectIndex] = object;
        this.drawForMaterials(scene, object, techniqueIndex, texs,"jthree.materials.hitarea");
        this.___objectIndex ++;
  }

  public getTechniqueCount(scene: Scene)
  {
      return 1;
  }

  public needRender(scene: Scene, object: SceneObject, techniqueIndex: number): boolean {
      return true;
  }
}

export = HitAreaRenderStage;
