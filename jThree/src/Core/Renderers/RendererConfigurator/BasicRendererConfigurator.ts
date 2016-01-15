import RSMLRenderStage = require("../RenderStages/RSML/RSMLRenderStage");
﻿import GeneraterInfo = require("../TextureGeneraters/GeneraterInfo");
import RenderStageChain = require("../RenderStageChain");
import BasicRenderer = require("../BasicRenderer");
import AccumulationStage = require("../RenderStages/LightAccumulationStage");
import ConfiguratorBase = require("./RendererConfiguratorBase");
import SkyBoxStage = require("../RenderStages/SkyBoxStage");
import GBufferStage = require("../RenderStages/GBuffer/GBufferStage");
import ShadowMapGenerationStage = require("../RenderStages/ShadowMapGenerationStage");
import HitAreaRenderStage = require("../RenderStages/HitAreaRenderStage");
class BasicRendererConfigurator extends ConfiguratorBase {
    public get TextureBuffers(): GeneraterInfo {
        return {
            "gbuffer.primary":
            {
                generater: "rendererfit",
                internalFormat: "RGBA",
                element: "FLOAT"
            },
            "light.diffuse": {
                generater: "rendererfit",
                internalFormat: "RGB",
                element: "UBYTE"
            }
            ,
            "light.specular": {
                generater: "rendererfit",
                internalFormat: "RGB",
                element: "UBYTE"
            },
            "hitarea":
            {
                generater: "rendererfit",
                internalFormat: "RGBA",
                element: "UBYTE"
            }
        };
    }

    public getStageChain(target: BasicRenderer): RenderStageChain[] {
        return [
            {
                buffers:
                {

                },
                stage: new ShadowMapGenerationStage(target)
            },
            {
                buffers:
                {
                    OUT: "hitarea"
                },
                stage: new HitAreaRenderStage(target)
            },
            {
              buffers:{
                 PRIMARY: "gbuffer.primary"
              },
              stage:new RSMLRenderStage(target,require("../RenderStages/BuiltIn/GBuffer.html"))
            },
            {
                buffers: {
                    PRIMARY: "gbuffer.primary",
                    DIFFUSE: "light.diffuse",
                    SPECULAR: "light.specular"
                },
                stage: new RSMLRenderStage(target,require("../RenderStages/BuiltIn/LightAccumulationStage.html"))
            },
            {
                buffers: {
                    DLIGHT: "light.diffuse",
                    SLIGHT: "light.specular",
                    OUT: "default"
                },
                stage: new RSMLRenderStage(target,require('../RenderStages/BuiltIn/ForwardShading.html'))
            }];
    }
}

export = BasicRendererConfigurator;
