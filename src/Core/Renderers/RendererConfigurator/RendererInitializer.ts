import XMLReader from "../../../Base/XMLReader";
import BasicRenderer from "../BasicRenderer";
/**
 * Provides initialization for renderer from xml configuration file.
 */
class RenderPathInitializer {

    public static initializeRenderer(renderer: BasicRenderer, configure: string): void {
        const xmlDocument = XMLReader.parseXML(configure);
        const rootElement = xmlDocument.getElementsByName("config");
        if (rootElement.length !== 1) {
            throw new Error("Invalid count of renderer-path elements. The count of renderer-path element are allowed only 1.");
        }
        RenderPathInitializer._parseRoot(renderer, rootElement.item(0));
    }

    public static parseRender(configure: string): void {

    }

    private static _parseRoot(renderer: BasicRenderer, rootElement: Element): void {
        const texturesElement = rootElement.getElementsByTagName("textures");
        RenderPathInitializer._parseTextures(renderer, texturesElement.item(0));
    }

    /**
     * Parse textures elements
     * @param {BasicRenderer} renderer     [description]
     * @param {Element}       texturesNode [description]
     */
    private static _parseTextures(renderer: BasicRenderer, texturesNode: Element): void {
        const textureNodes = texturesNode.childNodes;
        for (let i = 0; i < textureNodes.length; i++) {
            // iterate for all textures
            const textureNode = textureNodes.item(i);
            const generaterName = textureNode.nodeName; // the node name will be used as generater.(like renderer-fit)
            const textureName = textureNode.attributes.getNamedItem("name");
            if (!textureName) {
                throw new Error("Render buffer name must be specified");
            }
            // create bufferGenerationInfo
            const bufferGenerationInfo = {
                generater: generaterName,
                name: textureName.value
            };
            for (let j = 0; j < textureNode.attributes.length; j++) {
                const attribute = textureNode.attributes.item(j);
                if (attribute.name === "name" || attribute.name === "generater") {
                    continue;
                }
                bufferGenerationInfo[attribute.name] = attribute.value;
            }
            renderer.bufferSet.appendBuffer(bufferGenerationInfo);
        }
    }

    /**
     * Parse render path elements
     */
    private static _parsePath(renderer: BasicRenderer, pathesNode: Element): void {

    }
}

export default RenderPathInitializer;
