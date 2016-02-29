import StageChainTemplate from "../StageChainTemplate";
﻿import GeneraterInfo from "../TextureGeneraters/GeneraterInfoChunk";
import BasicRenderer from "../BasicRenderer";
import ConfiguratorBase from "./RendererConfiguratorBase";
class BasicRendererConfigurator extends ConfiguratorBase {
  public get TextureBuffers(): GeneraterInfo[] {
    return [
      {
        name: "depth",
        generater: "rendererfit",
        elementLayout: "RGB",
        elementFormat: "UBYTE"
      },
      {
        name: "gbuffer.primary",
        generater: "rendererfit",
        elementLayout: "RGBA",
        elementFormat: "UBYTE"
      },
      {
        name: "light.diffuse",
        generater: "rendererfit",
        elementLayout: "RGB",
        elementFormat: "UBYTE"
      },
      {
        name: "light.specular",
        generater: "rendererfit",
        elementLayout: "RGB",
        elementFormat: "UBYTE"
      },
      {
        name: "hitarea",
        generater: "rendererfit",
        elementLayout: "RGBA",
        elementFormat: "UBYTE"
      },
      {
        name: "main",
        generater: "rendererfit",
        elementLayout: "RGBA",
        elementFormat: "UBYTE"
      },
      {
        name: "output",
        generater: "rendererfit",
        elementLayout: "RGBA",
        elementFormat: "UBYTE"
      }
    ];
  }

  public getStageChain(target: BasicRenderer): StageChainTemplate[] {
    return [
      {
        buffers:
        {
          OUT: "hitarea"
        },
        stage: "jthree.hitarea"
      },
      {
        buffers: {
          DEPTH: "depth",
          PRIMARY: "gbuffer.primary"
        },
        stage: "jthree.basic.gbuffer"
      },
      {
        buffers: {
          DEPTH: "depth",
          PRIMARY: "gbuffer.primary",
          DIFFUSE: "light.diffuse",
          SPECULAR: "light.specular"
        },
        stage: "jthree.basic.light"
      },
      {
        buffers: {
          GBUFFER: "gbuffer.primary",
          DLIGHT: "light.diffuse",
          SLIGHT: "light.specular",
          OUT: "output"
        },
        stage: "jthree.basic.foward"
      },
      {
        buffers: {
          INPUT: "output",
          OUT: "default"
        },
        stage: "jthree.basic.fxaa",
        variables: {
          reduceMin: 0.05,
          reduceMul: 0.1,
          spanMax: 3
        }
      }];
    // },
    // {
    //   buffers: {
    //     MAIN: "main",
    //     PRIMARY: "gbuffer.primary",
    //     OUT: "output"
    //   },
    //   stage: "jthree.basic.fogExp2",
    //   variables: {
    //     density: 2.0,
    //   }
    // },
    // {
    //   buffers: {
    //     INPUT: "output",
    //     OUT: "default"
    //   },
    //   stage: "jthree.basic.fxaa",
    //   variables: {
    //     reduceMin: 0.05,
    //     reduceMul: 0.1,
    //     spanMax: 3
    //   }
    // }];
  }
}

export default BasicRendererConfigurator;
