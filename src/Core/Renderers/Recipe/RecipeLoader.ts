import XMLReader from "../../../Base/XMLReader";
/**
 * Provides initialization for renderer from xml configuration file.
 */
class RecipeLoader {
    // deprecated
    // public static initializeRenderer(renderer: BasicRenderer, configure: string): void {
    //     const xmlDocument = XMLReader.parseXML(configure);
    //     const rootElement = xmlDocument.getElementsByName("config");
    //     if (rootElement.length !== 1) {
    //         throw new Error("Invalid count of renderer-path elements. The count of renderer-path element are allowed only 1.");
    //     }
    //     RecipeLoader._parseRoot(renderer, rootElement.item(0));
    // }

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
        const textureNodes = XMLReader.getChildElements(texturesNode);
        const textureRecipes = [];
        for (let i = 0; i < textureNodes.length; i++) {
            // iterate for all textures
            const textureNode = textureNodes[i];
            const generaterName = textureNode.nodeName; // the node name will be used as generater.(like renderer-fit)
            const textureName = XMLReader.getAttribute(textureNode, "name", true);
            // create bufferGenerationInfo
            const bufferGenerationInfo = {
                generater: generaterName,
                name: textureName
            };
            for (let j = 0; j < textureNode.attributes.length; j++) {
                const attribute = textureNode.attributes.item(j);
                if (attribute.name === "name" || attribute.name === "generater") {
                    continue;
                }
                bufferGenerationInfo[attribute.name] = attribute.value;
            }
            textureRecipes.push(bufferGenerationInfo);
        }
    }
}

export default RecipeLoader;
