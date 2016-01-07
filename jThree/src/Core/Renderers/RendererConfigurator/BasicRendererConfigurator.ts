import RSMLRenderStageBase = require("../RenderStages/RSML/RSMLRenderStageBase");
﻿import GeneraterInfo = require("../TextureGeneraters/GeneraterInfo");
import RenderStageChain = require("../RenderStageChain");
import BasicRenderer = require("../BasicRenderer");
import AccumulationStage = require("../RenderStages/LightAccumulationStage");
import ShadingStage = require("../RenderStages/FowardShadingStage");
import ConfiguratorBase = require("./RendererConfiguratorBase");
import SkyBoxStage = require("../RenderStages/SkyBoxStage");
import GBufferStage = require("../RenderStages/GBuffer/GBufferStage");
import ShadowMapGenerationStage = require("../RenderStages/ShadowMapGenerationStage");
import HitAreaRenderStage = require("../RenderStages/HitAreaRenderStage");
class BasicRendererConfigurator extends ConfiguratorBase {
  private static rsmlTest:string = `<?xml version="1.0" encoding="UTF-8"?>
  <rsml>
    <stage name="jthree.basic.rsmlTest">
      <technique type="material" target="scene" materialGroup="jthree.materials.gbuffer">
        <fbo>
          <rbo clearDepth="1.0"/>
          <color name="OUT" clearColor="0,0,0,0" register="0"/>
        </fbo>
      </technique>
    </stage>
  </rsml>
`;

    public get TextureBuffers(): GeneraterInfo {
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
                buffers: {
                    PRIMARY: "gbuffer.primary",
                    SECOUNDARY: "gbuffer.secoundary",
                    THIRD: "gbuffer.third"
                },
                stage: new GBufferStage(target)
            },
            {
                buffers: {
                    PRIMARY: "gbuffer.primary",
                    SECOUNDARY: "gbuffer.secoundary",
                    THIRD: "gbuffer.third",
                    DIFFUSE: "light.diffuse",
                    SPECULAR: "light.specular"
                },
                stage: new AccumulationStage(target)
            },
            {
              buffers: {
                OUT: "hitarea"
              },
              stage: new RSMLRenderStageBase(target,BasicRendererConfigurator.rsmlTest)
            },
            {
                buffers: {
                    DLIGHT: "light.diffuse",
                    SLIGHT: "light.specular",
                    OUT: "default"
                },
                stage: new ShadingStage(target)
            }];
    }
}

export = BasicRendererConfigurator;
