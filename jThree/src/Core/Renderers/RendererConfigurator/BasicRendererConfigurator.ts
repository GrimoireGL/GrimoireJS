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
/*            "deffered.rb1": {
                generater: "rendererfit",
                internalFormat: "RGBA",
                element: "UBYTE"
            },
            "deffered.rb2": {
                generater: "rendererfit",
                internalFormat: "RGBA",
                element: "UBYTE"
            }, "deffered.depth": {
                generater: "rendererfit",
                internalFormat: "RGBA",
                element: "UBYTE"
            }
            , "deffered.light": {
                generater: "rendererfit",
                internalFormat: "RGBA",
                element: "UBYTE"
            },*/
            "gbuffer.primary":
            {
                generater: "rendererfit",
                internalFormat: "RGBA",
                element: "FLOAT"
            }
            ,
            "gbuffer.secoundary":
            {
                generater: "rendererfit",
                internalFormat: "RGBA",
                element: "UBYTE"
            }
            ,
            "gbuffer.third":
            {
                generater: "rendererfit",
                internalFormat: "RGB",
                element: "UBYTE"
            },
            "light.diffuse": {
                generater: "rendererfit",
                internalFormat: "RGB",
                element:"UBYTE"
            }
            ,
            "light.specular": {
                generater: "rendererfit",
                internalFormat: "RGB",
                element: "UBYTE"
            }
        };
    }

    public getStageChain(target: RendererBase): RenderStageChain[]
    {
        return [
            {
              buffers:
              {

              },
              stage:new ShadowMapGenerationStage(target)
            },
            {
                buffers: {
                    PRIMARY: "gbuffer.primary",
                    SECOUNDARY: "gbuffer.secoundary",
                    THIRD:"gbuffer.third"
                },
                stage:new GBufferStage(target)
            },
            {
                buffers: {
                    PRIMARY: "gbuffer.primary",
                    SECOUNDARY: "gbuffer.secoundary",
                    THIRD: "gbuffer.third",
                    DIFFUSE: "light.diffuse",
                    SPECULAR:"light.specular"
                },
                stage: new AccumulationStage(target)
            },
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
