import GeneraterInfoChunk = require("../TextureGeneraters/GeneraterInfoChunk");
import StageChainTemplate = require("../StageChainTemplate");
import BasicRenderer = require("../BasicRenderer");

class RendererConfiguratorBase {
  public get TextureBuffers(): GeneraterInfoChunk[] {
    return null;
  }

  public getStageChain(target: BasicRenderer): StageChainTemplate[] {
    return null;
  }
}

export = RendererConfiguratorBase;
