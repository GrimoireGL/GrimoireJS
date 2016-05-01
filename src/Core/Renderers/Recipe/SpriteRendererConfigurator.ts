import PathRecipe from "../PathRecipe";
import GeneraterInfo from "../TextureGeneraters/BufferRecipe";
import BasicRenderer from "../BasicRenderer";
import ConfiguratorBase from "./RendererConfiguratorBase";
class SpriteRendererConfigurator extends ConfiguratorBase {
  public get TextureBuffers(): GeneraterInfo[] {
    return [];
  }

  public getStageChain(target: BasicRenderer): PathRecipe[] {
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

export default SpriteRendererConfigurator;
