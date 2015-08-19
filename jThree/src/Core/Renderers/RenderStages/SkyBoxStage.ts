import RendererBase = require('../RendererBase');
import SceneObject = require('../../SceneObject');
import RenderStageBase = require('./RenderStageBase');
import ClearTargetType = require("../../../Wrapper/ClearTargetType");
import Scene = require('../../Scene');
import ResolvedChainInfo = require('../ResolvedChainInfo');
import Program = require("../../Resources/Program/Program");

class SkyBoxStage extends RenderStageBase
{
    private program:Program;
    constructor(renderer: RendererBase)
    {
        super(renderer);
        var vs = require("../Shaders/VertexShaders/PostEffectGeometries.glsl");
        var fs = require("../Shaders/Skybox.glsl");
        this.program = this.loadProgram("jthree.shaders.vertex.post", "jthree.shaders.fragment.skybox", "jthree.programs.skybox", vs, fs);
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

    public get RenderStageConfig()
    {
        return {
            depthTest: false,
            cullFace: false
        };
    }
}
export = SkyBoxStage; 