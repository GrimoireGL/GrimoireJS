import StageChainTemplate = require("../StageChainTemplate");
import GeneraterInfo = require("../TextureGeneraters/GeneraterInfoChunk");
import BasicRenderer = require("../BasicRenderer");
import ConfiguratorBase = require("./RendererConfiguratorBase");
class BasicRendererConfigurator extends ConfiguratorBase {
  public get TextureBuffers(): GeneraterInfo[] {
    return [];
  }

  public getStageChain(target: BasicRenderer): StageChainTemplate[] {
    return [
      {
        buffers: {
          DLIGHT: "light.diffuse",
          SLIGHT: "light.specular",
          OUT: "default"
        },
        stage: "jthree.basic.foward"
      }];
  }
}

export = BasicRendererConfigurator;
