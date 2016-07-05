import GeneraterInfoChunk from "../TextureGeneraters/GeneraterInfoChunk";
import StageChainTemplate from "../StageChainTemplate";
import BasicRenderer from "../BasicRenderer";

class RendererConfiguratorBase {
  public get TextureBuffers(): GeneraterInfoChunk[] {
    return null;
  }

  public getStageChain(target: BasicRenderer): StageChainTemplate[] {
    return null;
  }
}

export default RendererConfiguratorBase;
