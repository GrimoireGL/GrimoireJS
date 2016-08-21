import ITreeInitializedInfo from "./ITreeInitializedInfo";
import GrimoireInterface from "../GrimoireInterface";
import GomlParser from "./GomlParser";
import XMLReader from "../Base/XMLReader";
import XMLHttpRequestAsync from "../Base/XMLHttpRequestAsync";
/**
 * Provides the features to fetch Goml source.
 */
class GomlLoader {
  /**
   * Obtain the Goml source from specified tag.
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
    const rootNode = GomlParser.parse(doc[0], null, scriptTag);
    GrimoireInterface.addRootNode(scriptTag, rootNode);
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
      pArray[i] = GomlLoader.loadFromScriptTag(tags.item(i) as HTMLScriptElement);
    }
    return Promise.all<void>(pArray);
  }

  /**
   * Load all Goml sources contained in HTML.
   * @return {Promise<void>} [the promise to wait for all goml loading]
   */
  public static async loadForPage(): Promise<void> {
    await GomlLoader.loadFromQuery('script[type="text/goml"]');
  }
}

export default GomlLoader;
