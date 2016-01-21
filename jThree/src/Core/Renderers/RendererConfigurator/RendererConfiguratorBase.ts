import GeneraterInfoChunk = require("../TextureGeneraters/GeneraterInfoChunk");
import RenderStageChain = require("../RenderStageChain");
import BasicRenderer = require("../BasicRenderer");

class RendererConfiguratorBase {
  public get TextureBuffers(): GeneraterInfoChunk[] {
    return null;
  }

  public getStageChain(target: BasicRenderer): RenderStageChain[] {
    return null;
  }
}

export = RendererConfiguratorBase;
