import Environment from "../Core/Environment";

/**
 * Provides safe xml read feature.
 */
export default class XMLReader {

  /**
   * parse XML to Element Tree
   * @param doc xml document string
   */
  public static parseXML(doc: string): Element {
    const parsed = Environment.DomParser.parseFromString(doc, "text/xml");
    if (!parsed || parsed.getElementsByTagName("parsererror").length > 0) {
      const err = Environment.XMLSerializer.serializeToString(parsed);
      throw new Error(`Error parsing XML: ${err}`);
    }

    return parsed.documentElement;
  }
}
