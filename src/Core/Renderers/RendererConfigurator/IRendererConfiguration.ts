import PathRecipe from "../PathRecipe";
import BufferRecipe from "../TextureGeneraters/BufferRecipe";
interface IRendererConfiguration {
    buffers: BufferRecipe[];
    path:PathRecipe[];
}

export default IRendererConfiguration;
