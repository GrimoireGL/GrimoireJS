import RendererBase = require('../RendererBase');
import SceneObject = require('../../SceneObject');
import RenderStageBase = require('./RenderStageBase');
import ClearTargetType = require("../../../Wrapper/ClearTargetType");
import Scene = require('../../Scene');
import ResolvedChainInfo = require('../ResolvedChainInfo');
class SkyBoxStage extends RenderStageBase
{

    constructor(renderer: RendererBase)
    {
        super(renderer);

    }


    public preBeginStage(scene: Scene, passCount: number, chainInfo: ResolvedChainInfo)
    {
        this.bindAsOutBuffer(this.DefaultFBO, [
            {
                texture: chainInfo["OUT"],
                target: 0
            },
            {
                texture: this.DefaultRBO,
                target: "depth",
                type: "rbo"
            }
        ], () =>
            {
                this.Renderer.GLContext.ClearColor(0, 0, 0, 0);
                this.Renderer.GLContext.Clear(ClearTargetType.ColorBits | ClearTargetType.DepthBits);
            });
    }

    public render(scene: Scene, object: SceneObject, passCount: number) {
        var geometry = object.Geometry;
        if (!geometry) return;
        
    }


    public needRender(scene: Scene, object: SceneObject, passCount: number): boolean {
        return true;
    }

    public getPassCount(scene: Scene)
    {
        return 1;
    }

    public get TargetGeometry(): string
    {
        return "cube";
    }
}
export = SkyBoxStage; 