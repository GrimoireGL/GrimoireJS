import StageChainTemplate from "../StageChainTemplate";
import GeneraterInfo from "../TextureGeneraters/GeneraterInfoChunk";
import BasicRenderer from "../BasicRenderer";
import ConfiguratorBase from "./RendererConfiguratorBase";
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

export default BasicRendererConfigurator;
