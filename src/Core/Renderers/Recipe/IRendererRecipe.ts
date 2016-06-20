import IStageRecipe from "./IStageRecipe";
import ITextureRecipe from "./ITextureRecipe";
interface IRendererRecipe {
    textures: ITextureRecipe[];
    stages: IStageRecipe[];
}

export default IRendererRecipe;
