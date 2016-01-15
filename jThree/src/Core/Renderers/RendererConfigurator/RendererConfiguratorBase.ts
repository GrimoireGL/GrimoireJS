import GeneraterInfo = require("../TextureGeneraters/GeneraterInfo");
import RenderStageChain = require("../RenderStageChain");
import BasicRenderer = require("../BasicRenderer");

class RendererConfiguratorBase {
  public get TextureBuffers(): GeneraterInfo {
    return null;
  }

  public getStageChain(target: BasicRenderer): RenderStageChain[] {
    return null;
  }
}

export = RendererConfiguratorBase;
