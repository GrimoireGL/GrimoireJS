import RSMLRenderStage = require("../RenderStages/RSML/RSMLRenderStage");
import GeneraterInfo = require("../TextureGeneraters/GeneraterInfo");
import RenderStageChain = require("../RenderStageChain");
import BasicRenderer = require("../BasicRenderer");
import AccumulationStage = require("../RenderStages/LightAccumulationStage");
import ConfiguratorBase = require("./RendererConfiguratorBase");
import SkyBoxStage = require("../RenderStages/SkyBoxStage");
import GBufferStage = require("../RenderStages/GBuffer/GBufferStage");
import ShadowMapGenerationStage = require("../RenderStages/ShadowMapGenerationStage");
class BasicRendererConfigurator extends ConfiguratorBase
{
    public get TextureBuffers(): GeneraterInfo
    {
        return {
        };
    }

    public getStageChain(target: BasicRenderer): RenderStageChain[]
    {
        return [
            {
                buffers: {
                    DLIGHT: "light.diffuse",
                    SLIGHT:"light.specular",
                    OUT: "default"
                },
                stage: new RSMLRenderStage(target,require("../RenderStages/BuiltIn/ForwardShading.html"))
            }];
    }
}

export = BasicRendererConfigurator;
