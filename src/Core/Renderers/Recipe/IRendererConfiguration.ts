import PathRecipe from "../PathRecipe";
import BufferRecipe from "../TextureGeneraters/BufferRecipe";
interface IRendererRecipe {
    buffers: BufferRecipe[];
    path: PathRecipe[];
}

export default IRendererRecipe;
