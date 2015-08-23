import GeneraterInfo = require("../TextureGeneraters/GeneraterInfo");
import RenderStageChain = require("../RenderStageChain");
import Rb1RenderStage = require("../RenderStages/RB1RenderStage");
import RendererBase = require("../RendererBase");
import AccumulationStage = require("../RenderStages/LightAccumulationStage");
import ShadingStage = require("../RenderStages/FowardShadingStage");
import RbDepthStage = require("../RenderStages/RBDepthStage");
import ConfiguratorBase = require("./RendererConfiguratorBase");
import SkyBoxStage = require("../RenderStages/SkyBoxStage");
class BasicRendererConfigurator extends ConfiguratorBase
{
    public get TextureBuffers(): GeneraterInfo
    {
        return {
            "deffered.rb1": {
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
            }
        };
    }

    public getStageChain(target: RendererBase): RenderStageChain[]
    {
        return [
            {
                buffers: {
                    OUT: "default"
                },
                stage:new SkyBoxStage(target)
            }
           ,{
                buffers: {
                    OUT: "deffered.rb1"
                },
                stage: new Rb1RenderStage(target)
            },
           {
                buffers: {
                    OUT: "deffered.depth"
                },
                stage: new RbDepthStage(target)
            },
            {
                buffers: {
                    RB1: "deffered.rb1",
                    DEPTH: "deffered.depth",
                    DIR: "jthree.light.dir1",
                    OUT: "deffered.light"
                },
                stage: new AccumulationStage(target)
            },
            {
                buffers: {
                    LIGHT: "deffered.light",
                    OUT: "default"
                },
                stage: new ShadingStage(target)
            }];
    }
}

export = BasicRendererConfigurator;