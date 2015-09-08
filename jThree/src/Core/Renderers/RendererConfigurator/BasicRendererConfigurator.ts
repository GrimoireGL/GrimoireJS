import GeneraterInfo = require("../TextureGeneraters/GeneraterInfo");
import RenderStageChain = require("../RenderStageChain");
import RendererBase = require("../RendererBase");
import AccumulationStage = require("../RenderStages/LightAccumulationStage");
import ShadingStage = require("../RenderStages/FowardShadingStage");
import ConfiguratorBase = require("./RendererConfiguratorBase");
import SkyBoxStage = require("../RenderStages/SkyBoxStage");
import GBufferStage = require("../RenderStages/GBuffer/GBufferStage");
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
        };
    }

    public getStageChain(target: RendererBase): RenderStageChain[]
    {
        return [
/*            {
                buffers: {
                    OUT: "default"
                },
                stage: new SkyBoxStage(target)
            },*/
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
                    OUT: "light.diffuse"
                },
                stage: new AccumulationStage(target)
            },
            {
                buffers: {
                    LIGHT: "light.diffuse",
                    OUT: "default"
                },
                stage: new ShadingStage(target)
            }];
    }
}

export = BasicRendererConfigurator;