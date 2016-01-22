import RSMLRenderStage = require("../RenderStages/RSML/RSMLRenderStage");
import GeneraterInfo = require("../TextureGeneraters/GeneraterInfoChunk");
import RenderStageChain = require("../RenderStageChain");
import BasicRenderer = require("../BasicRenderer");
import ConfiguratorBase = require("./RendererConfiguratorBase");
class BasicRendererConfigurator extends ConfiguratorBase {
  public get TextureBuffers(): GeneraterInfo[] {
    return [];
  }

  public getStageChain(target: BasicRenderer): RenderStageChain[] {
    return [
      {
        buffers: {
          DLIGHT: "light.diffuse",
          SLIGHT: "light.specular",
          OUT: "default"
        },
        stage: new RSMLRenderStage(target, require("../RenderStages/BuiltIn/ForwardShading.html"))
      }];
  }
}

export = BasicRendererConfigurator;
