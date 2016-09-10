var GrimoireInterface_1 = require("../GrimoireInterface");
var NodeInterface_1 = require("./NodeInterface");
/**
 * Provides interfaces to treat whole goml tree for each.
 */
var GomlInterface = (function () {
    function GomlInterface(rootNodes) {
        this.rootNodes = rootNodes;
    }
    GomlInterface.prototype.queryFunc = function (query) {
        var context = new NodeInterface_1["default"](this.queryNodes(query));
        var queryFunc = context.queryFunc.bind(context);
        Object.setPrototypeOf(queryFunc, context);
        return queryFunc;
    };
    GomlInterface.prototype.queryNodes = function (query) {
        console.log("gomlit:query");
        console.log("root count: " + this.rootNodes.length);
        return this.rootNodes.map(function (root) {
            console.log(root.element.querySelectorAll);
            var nodelist = root.element.querySelectorAll(query);
            console.log("queryresult: " + nodelist.length);
            var nodes = [];
            for (var i = 0; i < nodelist.length; i++) {
                var node = GrimoireInterface_1["default"].nodeDictionary[nodelist.item(i).getAttribute("x-gr-id")];
                if (node) {
                    nodes.push(node);
                }
            }
            return nodes;
        });
    };
    return GomlInterface;
})();
exports["default"] = GomlInterface;
