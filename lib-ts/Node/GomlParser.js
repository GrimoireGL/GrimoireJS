var GrimoireInterface_1 = require("../GrimoireInterface");
/**
 * Parser of Goml to Node utilities.
 * This class do not store any nodes and goml properties.
 */
var GomlParser = (function () {
    function GomlParser() {
    }
    /**
     * Parse Goml to Node
     * @param {HTMLElement} soruce [description]
     */
    GomlParser.parse = function (source) {
        var newNode = GomlParser._createNode(source);
        if (!newNode) {
            // when specified node could not be found
            console.warn("\"" + source.tagName + "\" was not parsed.");
            return null;
        }
        // Parse children recursively
        var children = source.childNodes;
        if (children && children.length !== 0) {
            var regexToFindComponent = /\.COMPONENTS$/mi; // TODO might needs to fix
            for (var i = 0; i < children.length; i++) {
                var child = children.item(i);
                if (GomlParser._isElement(child)) {
                    // parse as components
                    if (regexToFindComponent.test(child.nodeName)) {
                        GomlParser._parseComponents(newNode, child);
                        source.removeChild(child);
                        continue;
                    }
                    // parse as child node.
                    var newChildNode = GomlParser.parse(child);
                    if (newChildNode) {
                        newNode.addChild(newChildNode, null, false);
                    }
                }
            }
        }
        return newNode;
    };
    /**
     * GomlNodeの生成、初期化を行います。
     * @param  {HTMLElement}      elem         [description]
     * @param  {GomlConfigurator} configurator [description]
     * @return {GomlTreeNodeBase}              [description]
     */
    GomlParser._createNode = function (elem) {
        var _this = this;
        // console.log("createNode" + elem);
        var tagName = elem.localName;
        var recipe = GrimoireInterface_1["default"].nodeDeclarations.get(elem);
        if (!recipe) {
            throw new Error("Tag \"" + tagName + "\" is not found.");
        }
        var defaultValues = recipe.defaultAttributes;
        var newNode = recipe.createNode(elem);
        // AtributeをDOMから設定、できなければノードのデフォルト値で設定、それもできなければATTRのデフォルト値
        newNode.forEachAttr(function (attr, key) {
            _this._parseAttribute(attr, elem, defaultValues.get(attr.name));
        });
        elem.setAttribute("x-gr-id", newNode.id);
        GrimoireInterface_1["default"].nodeDictionary[newNode.id] = newNode;
        return newNode;
    };
    GomlParser._parseComponents = function (node, componentsTag) {
        var _this = this;
        var componentNodes = componentsTag.childNodes;
        if (!componentNodes) {
            return;
        }
        for (var i = 0; i < componentNodes.length; i++) {
            var componentNode = componentNodes.item(i);
            if (componentNode.nodeType !== Node.ELEMENT_NODE) {
                continue; // Skip if the node was not element
            }
            var component = GrimoireInterface_1["default"].componentDeclarations.get(componentNode);
            if (!component) {
                throw new Error("Component " + componentNode.tagName + " is not found.");
            }
            // コンポーネントの属性がタグの属性としてあればそれを、なければデフォルトを、それもなければ必須属性はエラー
            component.attributeDeclarations.forEach(function (attr) {
                _this._parseAttribute(attr.generateAttributeInstance(), componentNode);
            });
            node.addComponent(component.generateInstance());
        }
    };
    GomlParser._isElement = function (node) {
        return node.nodeType === Node.ELEMENT_NODE;
    };
    GomlParser._parseAttribute = function (attr, tag, defaultValue) {
        var attrName = attr.name;
        var attrDictionary = {};
        var domAttr = tag.attributes;
        for (var i = 0; i < domAttr.length; i++) {
            var attrNode = domAttr.item(i);
            var name_1 = attrNode.name.toUpperCase();
            attrDictionary[name_1] = attrNode.value;
        }
        var tagAttrValue = attrDictionary[attrName.name];
        if (!!tagAttrValue) {
            attr.Value = tagAttrValue;
        }
        else if (defaultValue !== void 0) {
            attr.Value = defaultValue;
        }
    };
    return GomlParser;
})();
exports["default"] = GomlParser;
