import RendererBase = require('../RendererBase');
import SceneObject = require('../../SceneObject');
import RenderStageBase = require('./RenderStageBase');
import ClearTargetType = require("../../../Wrapper/ClearTargetType");
import Scene = require('../../Scene');
import ResolvedChainInfo = require('../ResolvedChainInfo');
import Program = require("../../Resources/Program/Program");
import JThreeContext = require("../../JThreeContextProxy")
import Matrix = require("../../../Math/Matrix");
import CubeTexture = require("../../Resources/Texture/CubeTexture");
class ShadowMapGenerationStage extends RenderStageBase
{
    constructor(renderer: RendererBase)
    {
        super(renderer);
    }

    private getShadowDroppableLight(scene:Scene,techniqueIndex:number)
    {
      return scene.LightRegister.shadowDroppableLights[techniqueIndex];
    }


    public preBeginStage(scene: Scene, techniqueCount: number, chainInfo: ResolvedChainInfo) {
        var targetLight = this.getShadowDroppableLight(scene,techniqueCount);
        this.bindAsOutBuffer(
          this.DefaultFBO,
          [
            {
        			texture: targetLight.getLightBuffer(this.Renderer),
        			target: 0
        		}, {
        				texture: this.DefaultRBO,
        				type: "rbo",
        				target: "depth"
        			}
          ],()=>{
            this.Renderer.GLContext.ClearColor(0, 0, 0, 0);
            this.Renderer.GLContext.Clear(ClearTargetType.ColorBits|ClearTargetType.DepthBits);
          },()=>{}
        );
    }

    public render(scene: Scene, object: SceneObject, techniqueCount: number,texs) {
        var geometry = object.Geometry;
        var targetLight = this.getShadowDroppableLight(scene,techniqueCount);
        this.drawForMaterials(scene,object,techniqueCount,texs,"jthree.materials.shadowmap");
    }


    public needRender(scene: Scene, object: SceneObject, techniqueCount: number): boolean {
        return true;
    }

    public getTechniqueCount(scene: Scene)
    {
        return scene.LightRegister.ShadowDroppableLightCount;
    }

    public get TargetGeometry(): string
    {
        return "scene";
    }

    public get RenderStageConfig()
    {
        return {
            depthTest: false,
            cullFace: false,
            blend:false
        };
    }
}
export = ShadowMapGenerationStage;
