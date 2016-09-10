var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, Promise, generator) {
    return new Promise(function (resolve, reject) {
        generator = generator.call(thisArg, _arguments);
        function cast(value) { return value instanceof Promise && value.constructor === Promise ? value : new Promise(function (resolve) { resolve(value); }); }
        function onfulfill(value) { try { step("next", value); } catch (e) { reject(e); } }
        function onreject(value) { try { step("throw", value); } catch (e) { reject(e); } }
        function step(verb, value) {
            var result = generator[verb](value);
            result.done ? resolve(result.value) : cast(result.value).then(onfulfill, onreject);
        }
        step("next", void 0);
    });
};
var GrimoireInterface_1 = require("../GrimoireInterface");
var GomlParser_1 = require("./GomlParser");
var XMLReader_1 = require("../Base/XMLReader");
var XMLHttpRequestAsync_1 = require("../Base/XMLHttpRequestAsync");
/**
 * Provides the features to fetch Goml source.
 */
var GomlLoader = (function () {
    function GomlLoader() {
    }
    /**
     * Obtain the Goml source from specified tag.
     * @param  {HTMLScriptElement} scriptTag [the script tag to load]
     * @return {Promise<void>}               [the promise to wait for loading]
     */
    GomlLoader.loadFromScriptTag = function (scriptTag) {
        var srcAttr = scriptTag.getAttribute("src");
        var source;
        if (srcAttr) {
            // ignore text element
            var req = new XMLHttpRequest();
            req.open("GET", srcAttr);
            yield XMLHttpRequestAsync_1["default"].send(req);
            source = req.responseText;
        }
        else {
            source = scriptTag.text;
        }
        var doc = XMLReader_1["default"].parseXML(source, "GOML");
        var rootNode = GomlParser_1["default"].parse(doc[0]);
        var nodeId = GrimoireInterface_1["default"].addRootNode(scriptTag, rootNode);
        rootNode.broadcastMessage("treeInitialized", {
            ownerScriptTag: scriptTag,
            id: nodeId
        });
    };
    /**
     * Load from the script tags which will be found with specified query.
     * @param  {string}          query [the query to find script tag]
     * @return {Promise<void[]>}       [the promise to wait for all goml loading]
     */
    GomlLoader.loadFromQuery = function (query) {
        var tags = document.querySelectorAll(query);
        var pArray = [];
        for (var i = 0; i < tags.length; i++) {
            pArray[i] = GomlLoader.loadFromScriptTag(tags.item(i));
        }
        return Promise.all(pArray);
    };
    /**
     * Load all Goml sources contained in HTML.
     * @return {Promise<void>} [the promise to wait for all goml loading]
     */
    GomlLoader.loadForPage = function () {
        yield GomlLoader.loadFromQuery('script[type="text/goml"]');
    };
    return GomlLoader;
})();
exports["default"] = GomlLoader;
