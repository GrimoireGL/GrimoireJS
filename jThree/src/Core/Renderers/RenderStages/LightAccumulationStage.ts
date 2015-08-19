import RendererBase = require('../RendererBase');
import SceneObject = require('../../SceneObject');
import RenderStageBase = require('./RenderStageBase');
import ClearTargetType = require("../../../Wrapper/ClearTargetType");
import Scene = require('../../Scene');
import Program = require('../../Resources/Program/Program');
import Mesh = require('../../../Shapes/Mesh');
import Matrix = require('../../../Math/Matrix');
import Vector3 = require('../../../Math/Vector3');
import Vector2 = require('../../../Math/Vector2');
import ResolvedChainInfo = require('../ResolvedChainInfo');
import PointLight = require('../../Light/PointLight');
import DirectionalLight = require('../../Light/DirectionalLight');

class LitghtAccumulationStage extends RenderStageBase
{

    private program: Program;
    constructor(renderer: RendererBase)
    {
        super(renderer);
    }


    public preBeginStage(scene: Scene, passCount: number, texs: ResolvedChainInfo)
    {
        this.bindAsOutBuffer(this.DefaultFBO, [
            { texture: texs["OUT"], target: 0 },
            { texture: this.DefaultRBO, type: "rbo", target: "depth", isOptional: true }
        ], () =>
            {
                this.GLContext.ClearColor(0, 0, 0, 0);
                this.GLContext.Clear(ClearTargetType.ColorBits);
            });
    }

    public render(scene: Scene, object: SceneObject, passCount: number, texs: ResolvedChainInfo)
    {
        var geometry = object.Geometry;
        if (!geometry || !this.program) return;
        this.configureMaterial(scene, this.Renderer, new Mesh(geometry, null), texs);
        geometry.drawElements(this.Renderer.ContextManager, null);
        //this.rbLightFBO.getForContext(this.Renderer.ContextManager).unbind();
    }

    public configureMaterial(scene: Scene, renderer: RendererBase, object: SceneObject, texs: ResolvedChainInfo): void
    {
        var geometry = object.Geometry;
        var programWrapper = scene.LightRegister.LightProgram.getForContext(renderer.ContextManager);
        var ip = Matrix.inverse(renderer.Camera.ProjectionMatrix);
        programWrapper.register({
            attributes: {
                position: geometry.PositionBuffer,
                uv: geometry.UVBuffer
            },
            uniforms: {
                rb1: { type: "texture", register: 0, value: texs["RB1"] },
                rb2: { type: "texture", register: 1, value: texs["RB2"] },
                depth: { type: "texture", register: 2, value: texs["DEPTH"] },
                lightParams: { type: "texture", register: 3, value: scene.LightRegister.ParameterTexture },
                matIP: { type: "matrix", value: ip },
                matTV: { type: "matrix", value: Matrix.inverse(renderer.Camera.ViewMatrix) },
                lightParamSize: { type: "vector", value: new Vector2(scene.LightRegister.TextureWidth, scene.LightRegister.TextureHeight) },
                c_pos: { type: "vector", value: renderer.Camera.Position },
                c_dir: { type: "vector", value: renderer.Camera.LookAt.subtractWith(renderer.Camera.Position).normalizeThis() }
            }
        });
        //pass variables related to directional lights
        /*    var dlights = <DirectionalLight[]> scene.getLights("jthree.lights.directionallight");
            var ddir = new Array(dlights.length);
            var dcol = new Array(dlights.length);
            for (var i = 0; i < dlights.length; i++) {
              var dl = <DirectionalLight>dlights[i];
              ddir[i] = Matrix.transformNormal(renderer.Camera.ViewMatrix, dlights[i].Transformer.Foward);
              dcol[i] = dl.Color.toVector().multiplyWith(dl.Intensity);
            }
            programWrapper.setUniformVectorArray("dl_dir", ddir);
            programWrapper.setUniformVectorArray("dl_col", dcol);
            programWrapper.setUniform1i("dl_count", dlights.length);*/
        geometry.IndexBuffer.getForRenderer(renderer.ContextManager).bindBuffer();
    }

    public needRender(scene: Scene, object: SceneObject, passCount: number): boolean
    {
        return typeof object.Geometry != "undefined" && object.Geometry != null;
    }

    public getPassCount(scene: Scene)
    {
        return 1;
    }


    public get TargetGeometry(): string
    {
        return "quad";
    }

    public get RenderStageConfig()
    {
        return {
            depthTest: false,
            cullFace: false
        };
    }
}
export = LitghtAccumulationStage;
