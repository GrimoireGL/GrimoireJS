import BufferRecipe from "../TextureGeneraters/BufferRecipe";
import PathRecipe from "../PathRecipe";
import BasicRenderer from "../BasicRenderer";

class RendererConfiguratorBase {
  public get TextureBuffers(): BufferRecipe[] {
    return null;
  }

  public getStageChain(target: BasicRenderer): PathRecipe[] {
    return null;
  }
}

export default RendererConfiguratorBase;
