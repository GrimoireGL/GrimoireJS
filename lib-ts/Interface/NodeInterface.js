var XMLReader_1 = require("../Base/XMLReader");
var GomlParser_1 = require("../Node/GomlParser");
var ComponentInterface_1 = require("./ComponentInterface");
var NodeInterface = (function () {
    function NodeInterface(nodes) {
        this.nodes = nodes;
    }
    NodeInterface.prototype.queryFunc = function (query) {
        return new ComponentInterface_1["default"](this.queryComponents(query));
    };
    NodeInterface.prototype.queryComponents = function (query) {
        return null; // TODO: implement!
    };
    NodeInterface.prototype.attr = function (attrName, value) {
        if (value === void 0) {
            // return Attribute.
            this.forEach(function (node) {
                var attr = node.attributes.get(attrName);
                if (!attr) {
                    return attr;
                }
            });
        }
        else {
            // set value.
            this.forEach(function (node) {
                var attr = node.attributes.get(attrName);
                if (!attr) {
                    attr.Value = value;
                }
            });
        }
    };
    NodeInterface.prototype.on = function (eventName, listener) {
        this.forEach(function (node) {
            node.on(eventName, listener);
        });
    };
    NodeInterface.prototype.off = function (eventName, listener) {
        this.forEach(function (node) {
            node.removeListener(eventName, listener);
        });
    };
    NodeInterface.prototype.append = function (tag) {
        this.forEach(function (node) {
            var elems = XMLReader_1["default"].parseXML(tag);
            var nodes = elems.map(function (elem) { return GomlParser_1["default"].parse(elem); });
            nodes.forEach(function (child) {
                node.addChild(child);
            });
        });
    };
    NodeInterface.prototype.remove = function (child) {
        this.forEach(function (node) {
            node.removeChild(child);
        });
    };
    NodeInterface.prototype.forEach = function (callback) {
        this.nodes.forEach(function (array) {
            array.forEach(function (node) {
                callback(node);
            });
        });
    };
    NodeInterface.prototype.setEnable = function (enable) {
        this.forEach(function (node) {
            node.enable = !!enable;
        });
    };
    return NodeInterface;
})();
exports["default"] = NodeInterface;
