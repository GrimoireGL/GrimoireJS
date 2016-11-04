/**
 * Provides safe xml read feature.
 */
class XMLReader {

  private static _parser: DOMParser = new DOMParser();

  public static parseXML(doc: string, rootElementName?: string): Element[] {
    let isParseError = (parsedDocument: Document) => {
      var errorneousParse = XMLReader._parser.parseFromString('<', 'text/xml');
      let parsererrorNS = errorneousParse.getElementsByTagName("parsererror")[0].namespaceURI;
      if (parsererrorNS === 'http://www.w3.org/1999/xhtml') {
        return parsedDocument.getElementsByTagName("parsererror").length > 0;
      }
      return parsedDocument.getElementsByTagNameNS(parsererrorNS, 'parsererror').length > 0;
    };
    const parsed = XMLReader._parser.parseFromString(doc as string, "text/xml");
    if (isParseError(parsed)) {
      throw new Error('Error parsing XML');
    }
    if (rootElementName) {
      if (parsed.documentElement.tagName.toUpperCase() !== rootElementName.toUpperCase()) {
        throw new Error("Specified document is invalid.");
      }// TODO should throw more detail error
    }

    return [parsed.documentElement]; // TODO: implenent!
  }

  public static getElements(elem: Element, name: string): Element[] {
    const result: Element[] = [];
    const elems = elem.getElementsByTagName(name);
    for (let i = 0; i < elems.length; i++) {
      result.push(elems.item(i));
    }
    return result;
  }

  public static getSingleElement(elem: Element, name: string, mandatory?: boolean): Element {
    const result = XMLReader.getElements(elem, name);
    if (result.length === 1) {
      return result[0];
    } else if (result.length === 0) { // When the element was not found
      if (mandatory) {
        throw new Error(`The mandatory element ${name} was required, but not found`);
      } else {
        return null;
      }
    } else {
      throw new Error(`The element ${name} requires to exist in single. But there is ${result.length} count of elements`);
    }
  }

  public static getAttribute(elem: Element, name: string, mandatory?: boolean): string {
    const result = elem.attributes.getNamedItem(name);
    if (result) {
      return result.value;
    } else if (mandatory) {
      throw new Error(`The mandatory attribute ${name} was required, but it was not found`);
    } else {
      return null;
    }
  }

  public static getAttributeFloat(elem: Element, name: string, mandatory?: boolean): number {
    const resultStr = XMLReader.getAttribute(elem, name, mandatory);
    return parseFloat(resultStr);
  }

  public static getAttributeInt(elem: Element, name: string, mandatory?: boolean): number {
    const resultStr = XMLReader.getAttribute(elem, name, mandatory);
    return parseInt(resultStr, 10);
  }

  public static getChildElements(elem: Element): Element[] {
    const children = elem.childNodes;
    const result: Element[] = [];
    for (let i = 0; i < children.length; i++) {
      if (children.item(i) instanceof Element) {
        result.push(children.item(i) as Element);
      }
    }
    return result;
  }

  public static getAttributes(elem: Element, ns?: string): { [key: string]: string } {
    const result: { [key: string]: string } = {};
    const attrs = elem.attributes;
    for (let i = 0; i < attrs.length; i++) {
      const attr = attrs.item(i);
      if (!ns || attr.namespaceURI === ns) {
        result[attr.localName] = attr.value;
      }
    }
    return result;
  }
}

export default XMLReader;
