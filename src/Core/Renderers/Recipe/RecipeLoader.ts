import XMLReader from "../../../Base/XMLReader";
/**
 * Provides initialization for renderer from xml configuration file.
 */
class RecipeLoader {

    public static parseRender(configure: string): void {
        const rendererRecipe = {};
        const xmlDocument = XMLReader.parseXML(configure);
        const rootElement = XMLReader.getSingleElement(xmlDocument, "recipe");
        const texturesElement = XMLReader.getSingleElement(rootElement, "textures", true);
        RecipeLoader._parseTextures(texturesElement);
    }
    /**
     * Parse textures elements
     * @param {BasicRenderer} renderer     [description]
     * @param {Element}       texturesNode [description]
     */
    private static _parseTextures(texturesNode: Element): void {
        debugger;
        const textureNodes = XMLReader.getChildElements(texturesNode);
        const textureRecipes = [];
        for (let i = 0; i < textureNodes.length; i++) {
            // iterate for all textures
            const textureNode = textureNodes[i];
            const generaterName = textureNode.nodeName; // the node name will be used as generater.(like renderer-fit)
            const textureName = XMLReader.getAttribute(textureNode, "name", true);
            // create bufferGenerationInfo
            textureRecipes.push({
                generater: generaterName,
                name: textureName,
                params: XMLReader.getAttributes(textureNode)
            });
        }
    }
}

export default RecipeLoader;
