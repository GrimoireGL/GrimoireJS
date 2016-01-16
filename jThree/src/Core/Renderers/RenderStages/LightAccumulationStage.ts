import BasicGeometry = require("../../Geometries/Base/BasicGeometry");
import BasicRenderer = require('../BasicRenderer');
import SceneObject = require('../../SceneObject');
import RenderStageBase = require('./RenderStageBase');
import ClearTargetType = require("../../../Wrapper/ClearTargetType");
import Scene = require('../../Scene');
import Program = require('../../Resources/Program/Program');
import Mesh = require('../../../Shapes/Mesh');
import Matrix = require('../../../Math/Matrix');
import Vector2 = require('../../../Math/Vector2');
import ResolvedChainInfo = require('../ResolvedChainInfo');
class LightAccumulationStage extends RenderStageBase
{

    private program: Program;

    constructor(renderer: BasicRenderer)
    {
        super(renderer);
    }


    public preTechnique(scene: Scene, techniqueIndex: number, texs: ResolvedChainInfo) {
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
                this.GL.clearColor(0, 0, 0, 0);
                this.GL.clear(ClearTargetType.ColorBits);
            });
    }

    public render(scene: Scene, object: SceneObject, techniqueIndex: number, texs: ResolvedChainInfo)
    {
        var geometry = object.Geometry;
        if (!geometry) return;
        this.apply(scene, this.Renderer, new Mesh(geometry, null), texs,techniqueIndex === 0?scene.LightRegister.DiffuseLightProgram:scene.LightRegister.SpecularLightProgram);
        geometry.drawElements(this.Renderer.ContextManager, null);
    }

    public apply(scene: Scene, renderer: BasicRenderer, object: SceneObject, texs: ResolvedChainInfo,targetProgramWrapper:Program): void
    {
        var geometry = <BasicGeometry>object.Geometry;
        var pWrapper = targetProgramWrapper.getForContext(renderer.ContextManager);
        var ip = Matrix.inverse(renderer.Camera.projectionMatrix);
        pWrapper.useProgram();
        pWrapper.assignAttributeVariable("position",geometry.positionBuffer);
        pWrapper.assignAttributeVariable("uv",geometry.uvBuffer);
        pWrapper.uniformSampler("primary",texs["PRIMARY"],0);
        pWrapper.uniformSampler("secoundary",texs["SECOUNDARY"],1);
        pWrapper.uniformSampler("third",texs["THIRD"],2);
        pWrapper.uniformSampler("lightParam",scene.LightRegister.ParameterTexture,3);
        pWrapper.uniformSampler("shadowMap",scene.LightRegister.shadowMapResourceManager.shadowMapTileTexture,4);
        pWrapper.uniformSampler("shadowParam",scene.LightRegister.shadowMapResourceManager.shadowMatrixTexture,5);
        pWrapper.uniformVector("lightParamSize",scene.LightRegister.TextureSize);
        pWrapper.uniformMatrix("matV",renderer.Camera.viewMatrix);
        pWrapper.uniformMatrix("matIP",ip);
        pWrapper.uniformMatrix("matIV",Matrix.inverse(renderer.Camera.viewMatrix));
        pWrapper.uniformFloat("shadowMapMax",scene.LightRegister.shadowMapResourceManager.maximumShadowMapCount);
        pWrapper.uniformMatrixArrayFromBuffer("matLWs",scene.LightRegister.lightWorldMatricis);
        pWrapper.uniformMatrixArrayFromBuffer("matVILs",scene.LightRegister.viewInvertedLightMatricis);
      //  geometry.IndexBuffer.getForContext(renderer.ContextManager).bindBuffer();
    }

    public needRender(scene: Scene, object: SceneObject, passCount: number): boolean
    {
        return typeof object.Geometry != "undefined" && object.Geometry != null;
    }

    public getTechniqueCount(scene: Scene)
    {
        return 2;
    }


    public getTarget(techniqueIndex:number): string
    {
        return "quad";
    }

    public get RenderStageConfig()
    {
        return {
            depthTest: false
        };
    }
}
export = LightAccumulationStage;
