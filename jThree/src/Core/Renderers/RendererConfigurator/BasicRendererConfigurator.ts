import Vector3 from "../../../Math/Vector3";
import StageChainTemplate from "../StageChainTemplate";
﻿import GeneraterInfo from "../TextureGeneraters/GeneraterInfoChunk";
import BasicRenderer from "../BasicRenderer";
import ConfiguratorBase from "./RendererConfiguratorBase";
class BasicRendererConfigurator extends ConfiguratorBase {
  public get TextureBuffers(): GeneraterInfo[] {
    return [
      {
        name: "gbuffer.primary",
        generater: "rendererfit",
        internalFormat: "RGBA",
        element: "FLOAT"
      },
      {
        name: "light.diffuse",
        generater: "rendererfit",
        internalFormat: "RGB",
        element: "UBYTE"
      },
      {
        name: "light.specular",
        generater: "rendererfit",
        internalFormat: "RGB",
        element: "UBYTE"
      },
      {
        name: "hitarea",
        generater: "rendererfit",
        internalFormat: "RGBA",
        element: "UBYTE"
      },
      {
        name: "main",
        generater: "rendererfit",
        internalFormat: "RGBA",
        element: "UBYTE"
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
          PRIMARY: "gbuffer.primary"
        },
        stage: "jthree.basic.gbuffer"
      },
      {
        buffers: {
          PRIMARY: "gbuffer.primary",
          DIFFUSE: "light.diffuse",
          SPECULAR: "light.specular"
        },
        stage: "jthree.basic.light"
      },
      {
        buffers: {
          DLIGHT: "light.diffuse",
          SLIGHT: "light.specular",
          OUT: "main"
        },
        stage: "jthree.basic.foward"
      },
      {
        buffers: {
          MAIN: "main",
          PRIMARY: "gbuffer.primary",
          OUT: "default"
        },
        stage: "jthree.basic.fogExp2",
        variables: {
          density: 0,
          fogColor: new Vector3(1.0, 1.0, 1.0)
        }
      }];
  }
}

export default BasicRendererConfigurator;
