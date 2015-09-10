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
class SkyBoxStage extends RenderStageBase
{
    public skyBoxTexture:CubeTexture;

    private program:Program;
    constructor(renderer: RendererBase)
    {
        super(renderer);
        var vs = require("../../Shaders/VertexShaders/SkyboxGeometries.glsl");
        var fs = require("../../Shaders/SkyBox.glsl");
        this.program = this.loadProgram("jthree.shaders.vertex.skybox", "jthree.shaders.fragment.skybox", "jthree.programs.skybox", vs, fs);
    }


    public preBeginStage(scene: Scene, passCount: number, chainInfo: ResolvedChainInfo) {
        this.Renderer.GLContext.BindFrameBuffer(null);

      /*  this.bindAsOutBuffer(this.DefaultFBO, [
            {
                texture: chainInfo["OUT"],
                target: 0
            }
        ], () =>
            {
                this.Renderer.GLContext.ClearColor(0, 0, 0, 0);
                this.Renderer.GLContext.Clear(ClearTargetType.ColorBits | ClearTargetType.DepthBits);
            });*/
    }

    public render(scene: Scene, object: SceneObject, passCount: number) {
        var geometry = object.Geometry;
        var pw = this.program.getForContext(this.Renderer.ContextManager);
        pw.register({
            attributes: {
                position: geometry.PositionBuffer,
                uv:geometry.UVBuffer
            },
            uniforms: {
                skyTex: { type: "texture", register: 0, value: this.skyBoxTexture},
                matVP:{type:"matrix",value:this.Renderer.Camera.ViewMatrix}
            }
        });
        geometry.IndexBuffer.getForContext(this.Renderer.ContextManager).bindBuffer();
        geometry.drawElements(this.Renderer.ContextManager,null);
    }


    public needRender(scene: Scene, object: SceneObject, passCount: number): boolean {
        return !!this.skyBoxTexture;
    }

    public getTechniqueCount(scene: Scene)
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
            cullFace: false,
            blend:true
        };
    }
}
export = SkyBoxStage;
