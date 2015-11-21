import RendererBase = require('../../RendererBase');
import SceneObject = require('../../../SceneObject');
import RenderStageBase = require('../RenderStageBase');
import Scene = require('../../../Scene');
import ResolvedChainInfo = require('../../ResolvedChainInfo');
import ClearTargetType = require("../../../../Wrapper/ClearTargetType");
import RenderStageConfig = require("../../RenderStageConfig");
/**
 * This stage draws 3 of G buffers.
 * Primary g-buffer Normal.X Normal.Y Depth SpecularCoefficent -> First pass
 * Secoundary g-buffer DiffuseAlbedo.RGBA -> secound pass
 * Third g-buffer SpecularAlbedo.RGB -> third pass
 */
class GBufferStage extends RenderStageBase
{
    public get RenderStageConfig(): RenderStageConfig
    {
        return {
            depthTest: true
        };
    }

    constructor(renderer: RendererBase)
    {
        super(renderer);
    }

    public preBeginStage(scene: Scene, techniqueIndex: number, texs: ResolvedChainInfo) {
        var outTexture;//switch texture by passCount
        switch (techniqueIndex)
        {
            case 0:
                outTexture = texs["PRIMARY"];
                break;
            case 1:
                outTexture = texs["SECOUNDARY"];
                break;
            case 2:
                outTexture = texs["THIRD"];
                break;
        }
        this.bindAsOutBuffer(this.DefaultFBO, [{
            texture: this.DefaultRBO,
            target: "depth",
            type: "rbo"
        }, {
                texture: outTexture,
                target: 0,
                isOptional: false
            }], () =>
            {
                this.Renderer.GL.clear(ClearTargetType.ColorBits | ClearTargetType.DepthBits);
            }, () =>
            {
                this.Renderer.ContextManager.applyClearColor();
                this.Renderer.GL.clear(ClearTargetType.DepthBits);
            });
    }

    public render(scene: Scene, object: SceneObject, techniqueIndex: number, texs: ResolvedChainInfo) {
        this.drawForMaterials(scene, object, techniqueIndex, texs, "jthree.materials.gbuffer");
    }

    public needRender(scene: Scene, object: SceneObject, techniqueIndex: number): boolean
    {
        return typeof object.Geometry != "undefined" && object.Geometry != null;
    }

    public getTechniqueCount(scene: Scene)
    {
        return 3;
    }
}

export = GBufferStage;
