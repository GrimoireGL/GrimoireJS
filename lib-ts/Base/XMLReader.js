/**
 * Provides safe xml read feature.
 */
var XMLReader = (function () {
    function XMLReader() {
    }
    XMLReader.parseXML = function (doc, rootElementName) {
        var parsed = XMLReader._parser.parseFromString(doc, "text/xml");
        if (rootElementName) {
            if (parsed.documentElement.tagName.toUpperCase() !== rootElementName.toUpperCase()) {
                throw new Error("Specified document is invalid.");
            } // TODO should throw more detail error
        }
        return [parsed.documentElement]; //TODO: implenent!
    };
    XMLReader.getElements = function (elem, name) {
        var result = [];
        var elems = elem.getElementsByTagName(name);
        for (var i = 0; i < elems.length; i++) {
            result.push(elems.item(i));
        }
        return result;
    };
    XMLReader.getSingleElement = function (elem, name, mandatory) {
        var result = XMLReader.getElements(elem, name);
        if (result.length === 1) {
            return result[0];
        }
        else if (result.length === 0) {
            if (mandatory) {
                throw new Error("The mandatory element " + name + " was required, but not found");
            }
            else {
                return null;
            }
        }
        else {
            throw new Error("The element " + name + " requires to exist in single. But there is " + result.length + " count of elements");
        }
    };
    XMLReader.getAttribute = function (elem, name, mandatory) {
        var result = elem.attributes.getNamedItem(name);
        if (result) {
            return result.value;
        }
        else if (mandatory) {
            throw new Error("The mandatory attribute " + name + " was required, but it was not found");
        }
        else {
            return null;
        }
    };
    XMLReader.getAttributeFloat = function (elem, name, mandatory) {
        var resultStr = XMLReader.getAttribute(elem, name, mandatory);
        return parseFloat(resultStr);
    };
    XMLReader.getAttributeInt = function (elem, name, mandatory) {
        var resultStr = XMLReader.getAttribute(elem, name, mandatory);
        return parseInt(resultStr, 10);
    };
    XMLReader.getChildElements = function (elem) {
        var children = elem.childNodes;
        var result = [];
        for (var i = 0; i < children.length; i++) {
            if (children.item(i) instanceof Element) {
                result.push(children.item(i));
            }
        }
        return result;
    };
    XMLReader.getAttributes = function (elem, ns) {
        var result = {};
        var attrs = elem.attributes;
        for (var i = 0; i < attrs.length; i++) {
            var attr = attrs.item(i);
            if (!ns || attr.namespaceURI === ns) {
                result[attr.localName] = attr.value;
            }
        }
        return result;
    };
    XMLReader._parser = new DOMParser();
    return XMLReader;
})();
exports["default"] = XMLReader;
