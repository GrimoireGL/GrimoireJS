import ITreeInitializedInfo from "./ITreeInitializedInfo";
import GrimoireInterface from "../GrimoireInterface";
import GOMLParser from "./GomlParser";
import XMLReader from "../Base/XMLReader";
import XMLHttpRequestAsync from "../Base/XMLHttpRequestAsync";
/**
 * Provides the features to fetch GOML source.
 */
class GOMLLoader {
    /**
     * Obtain the GOML source from specified tag.
     * @param  {HTMLScriptElement} scriptTag [the script tag to load]
     * @return {Promise<void>}               [the promise to wait for loading]
     */
    public static async loadFromScriptTag(scriptTag: HTMLScriptElement): Promise<void> {
        const srcAttr = scriptTag.getAttribute("src");
        let source: string;
        if (srcAttr) {
            // ignore text element
            const req = new XMLHttpRequest();
            req.open("GET", srcAttr);
            await XMLHttpRequestAsync.send(req);
            source = req.responseText;
        } else {
            source = scriptTag.text;
        }
        const doc = XMLReader.parseXML(source, "GOML");
        const rootNode = GOMLParser.parse(doc.documentElement);
        const nodeId = GrimoireInterface.addScriptNode(scriptTag, rootNode);
        rootNode.broadcastMessage("treeInitialized", <ITreeInitializedInfo>{
            ownerScriptTag: scriptTag,
            id: nodeId
        });
    }
    /**
     * Load from the script tags which will be found with specified query.
     * @param  {string}          query [the query to find script tag]
     * @return {Promise<void[]>}       [the promise to wait for all goml loading]
     */
    public static loadFromQuery(query: string): Promise<void[]> {
        const tags = document.querySelectorAll(query);
        const pArray: Promise<void>[] = [];
        for (let i = 0; i < tags.length; i++) {
            pArray[i] = GOMLLoader.loadFromScriptTag(tags.item(i) as HTMLScriptElement);
        }
        return Promise.all<void>(pArray);
    }

    /**
     * Load all GOML sources contained in HTML.
     * @return {Promise<void>} [the promise to wait for all goml loading]
     */
    public static async loadForPage(): Promise<void> {
        await GOMLLoader.loadFromQuery('script[type="text/goml"]');
    }
}

export default GOMLLoader;
