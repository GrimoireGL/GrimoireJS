import RendererBase = require('../RendererBase');
import SceneObject = require('../../SceneObject');
import RenderStageBase = require('./RenderStageBase');
import ClearTargetType = require("../../../Wrapper/ClearTargetType");
import Scene = require('../../Scene');
import Program = require('../../Resources/Program/Program');
import Mesh = require('../../../Shapes/Mesh');
import Matrix = require('../../../Math/Matrix');
import Vector2 = require('../../../Math/Vector2');
import ResolvedChainInfo = require('../ResolvedChainInfo');
class LitghtAccumulationStage extends RenderStageBase
{

    private program: Program;
    constructor(renderer: RendererBase)
    {
        super(renderer);
    }


    public preBeginStage(scene: Scene, techniqueIndex: number, texs: ResolvedChainInfo) {
        var targetTetxture;
        switch (techniqueIndex) {
            case 0:
                targetTetxture = texs["DIFFUSE"];
                break;
            case 1:
                targetTetxture = texs["SPECULAR"];
                break;
        }
        this.bindAsOutBuffer(this.DefaultFBO, [
            { texture: targetTetxture, target: 0 }
        ], () =>
            {
                this.GLContext.ClearColor(0, 0, 0, 0);
                this.GLContext.Clear(ClearTargetType.ColorBits);
            });
    }

    public render(scene: Scene, object: SceneObject, techniqueIndex: number, texs: ResolvedChainInfo)
    {
        var geometry = object.Geometry;
        if (!geometry) return;
        this.configureMaterial(scene, this.Renderer, new Mesh(geometry, null), texs,techniqueIndex === 0?scene.LightRegister.DiffuseLightProgram:scene.LightRegister.SpecularLightProgram);
        geometry.drawElements(this.Renderer.ContextManager, null);
    }

    public configureMaterial(scene: Scene, renderer: RendererBase, object: SceneObject, texs: ResolvedChainInfo,targetProgramWrapper:Program): void
    {
        var geometry = object.Geometry;
        var programWrapper = targetProgramWrapper.getForContext(renderer.ContextManager);
        var ip = Matrix.inverse(renderer.Camera.ProjectionMatrix);
        programWrapper.register({
            attributes: {
                position: geometry.PositionBuffer,
                uv: geometry.UVBuffer
            },
            uniforms: {
                primary: {
                    type: "texture",
                    value: texs["PRIMARY"],
                    register: 0
                },
                secoundary: {
                    type: "texture",
                    value: texs["SECOUNDARY"],
                    register: 1
                },
                third: {
                    type: "texture",
                    value: texs["THIRD"],
                    register: 2
                },
                lightParam: {
                    type: "texture",
                    value: scene.LightRegister.ParameterTexture,
                    register: 3
                },
                lightParamSize: {
                    type: "vector",
                    value:scene.LightRegister.TextureSize
                },
                matV: {
                    type: "matrix",
                    value:renderer.Camera.ViewMatrix
                },
                matIP: {
                    type: "matrix",
                    value:ip
                },
                matLWs:
                {
                  type:"matrixarray",
                  value:scene.LightRegister.lightWorldMatricis
                },
                matVILs:
                {
                  type:"matrixarray",
                  value:scene.LightRegister.viewInvertedLightMatricis
                }
            }
        });
        geometry.IndexBuffer.getForContext(renderer.ContextManager).bindBuffer();
    }

    public needRender(scene: Scene, object: SceneObject, passCount: number): boolean
    {
        return typeof object.Geometry != "undefined" && object.Geometry != null;
    }

    public getTechniqueCount(scene: Scene)
    {
        return 2;
    }


    public get TargetGeometry(): string
    {
        return "quad";
    }

    public get RenderStageConfig()
    {
        return {
            depthTest: false,
            cullFace: false,
            blend: false
        };
    }
}
export = LitghtAccumulationStage;
