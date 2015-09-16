import GeneraterInfo = require("../TextureGeneraters/GeneraterInfo");
import RenderStageChain = require("../RenderStageChain");
import RendererBase = require("../RendererBase");
import AccumulationStage = require("../RenderStages/LightAccumulationStage");
import ShadingStage = require("../RenderStages/FowardShadingStage");
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

    public getStageChain(target: RendererBase): RenderStageChain[]
    {
        return [
            {
                buffers: {
                    DLIGHT: "light.diffuse",
                    SLIGHT:"light.specular",
                    OUT: "default"
                },
                stage: new ShadingStage(target)
            }];
    }
}

export = BasicRendererConfigurator;
