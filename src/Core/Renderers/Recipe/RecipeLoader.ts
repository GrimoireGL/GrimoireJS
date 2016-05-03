import XMLReader from "../../../Base/XMLReader";
import IRendererRecipe from "./IRendererRecipe";
import ITextureRecipe from "./ITextureRecipe";
import IStageRecipe from "./IStageRecipe";
/**
 * Provides initialization for renderer from xml configuration file.
 */
class RecipeLoader {

    public static bufferPrefixNamespace: string = "http://grimoire.gl/ns/recipe/buffer-prefix";

    public static variablePrefixNamespace: string = "http://grimoire.gl/ns/recipe/variable-prefix";

    public static parseRender(configure: string): IRendererRecipe {
        const rendererRecipe: IRendererRecipe = <IRendererRecipe>{};
        const xmlDocument = XMLReader.parseXML(configure);
        const rootElement = XMLReader.getSingleElement(xmlDocument, "recipe");
        const texturesElement = XMLReader.getSingleElement(rootElement, "textures", true);
        const pathElement = XMLReader.getSingleElement(rootElement, "path", true);
        rendererRecipe.textures = RecipeLoader._parseTextures(texturesElement);
        rendererRecipe.stages = RecipeLoader._parseStages(pathElement);
        console.log(rendererRecipe);
        return rendererRecipe;
    }
    /**
     * Parse textures elements
     * @param {BasicRenderer} renderer     [description]
     * @param {Element}       texturesNode [description]
     */
    private static _parseTextures(texturesNode: Element): ITextureRecipe[] {
        const textureNodes = XMLReader.getChildElements(texturesNode);
        const textureRecipes: ITextureRecipe[] = [];
        for (let i = 0; i < textureNodes.length; i++) {
            // iterate for all textures
            const textureNode = textureNodes[i];
            const textureName = XMLReader.getAttribute(textureNode, "name", true);
            // create bufferGenerationInfo
            textureRecipes.push({
                generater: XMLReader.getElementFQN(textureNode),
                name: textureName,
                params: XMLReader.getAttributes(textureNode)
            });
            // TODO check whether the specified generater name actually existing or not.
        }
        return textureRecipes;
    }

    private static _parseStages(stagesNode: Element): IStageRecipe[] {
        const stageNodes = XMLReader.getChildElements(stagesNode);
        const stageRecipes: IStageRecipe[] = [];
        for (let i = 0; i < stageNodes.length; i++) {
            const stageNode = stageNodes[i];
            stageRecipes.push({
                stage: XMLReader.getElementFQN(stageNode),
                buffers: XMLReader.getAttributes(stageNode, RecipeLoader.bufferPrefixNamespace),
                variables: XMLReader.getAttributes(stageNode, RecipeLoader.variablePrefixNamespace)
            });
        }
        return stageRecipes;
    }
}

export default RecipeLoader;
