/**
 * Provides safe xml read feature.
 */
class XMLReader {

    private static _parser: DOMParser = new DOMParser();

    public static parseXML(document: string): Document;
    public static parseXML(documentContainObject: any): Document;
    public static parseXML(document: any): Document {
        switch (typeof document) {
            case "string":
                return XMLReader._parser.parseFromString(document as string, "text/xml");
            case "object":
                if (document.default) {
                    return XMLReader._parser.parseFromString(document.default as string, "text/xml");
                }
                throw new Error("Unexpected argument");
        }
    }

    public static getElements(elem: Document | Element, name: string): Element[] {
        const result: Element[] = [];
        const elems = elem.getElementsByTagName(name);
        for (let i = 0; i < elems.length; i++) {
            result.push(elems.item(i));
        }
        return result;
    }

    public static getSingleElement(elem: Document | Element, name: string, mandatory?: boolean): Element {
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

    public static getAttribute(elem: Document | Element, name: string, mandatory?: boolean): string {
        const result = elem.attributes.getNamedItem(name);
        if (result) {
            return result.value;
        } else if (mandatory) {
            throw new Error(`The mandatory attribute ${name} was required, but it was not found`);
        } else {
            return null;
        }
    }

    public static getAttributeFloat(elem: Document | Element, name: string, mandatory?: boolean): number {
        const resultStr = XMLReader.getAttribute(elem, name, mandatory);
        return parseFloat(resultStr);
    }

    public static getAttributeInt(elem: Document | Element, name: string, mandatory?: boolean): number {
        const resultStr = XMLReader.getAttribute(elem, name, mandatory);
        return parseInt(resultStr, 10);
    }

    public static getChildElements(elem: Document | Element): Element[] {
        const children = elem.childNodes;
        const result: Element[] = [];
        for (let i = 0; i < children.length; i++) {
            if (children.item(i) instanceof Element) {
                result.push(children.item(i) as Element);
            }
        }
        return result;
    }

    public static getAttributes(elem: Document | Element, ns?: string): { [key: string]: string } {
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

    public static getElementFQN(elem: Document | Element): string {
        return XMLReader.generateFQN(elem.namespaceURI, elem.localName);
    }

    public static generateFQN(ns: string, name: string): string {
        return `{${ns}}${name}`;
    }
}

export default XMLReader;
