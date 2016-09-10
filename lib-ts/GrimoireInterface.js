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
var ComponentDeclaration_1 = require("./Node/ComponentDeclaration");
var Component_1 = require("./Node/Component");
var NamespacedSet_1 = require("./Base/NamespacedSet");
var NodeDeclaration_1 = require("./Node/NodeDeclaration");
var NamespacedIdentity_1 = require("./Base/NamespacedIdentity");
var GomlInterface_1 = require("./Interface/GomlInterface");
var NamespacedDictionary_1 = require("./Base/NamespacedDictionary");
var Ensure_1 = require("./Base/Ensure");
var util_1 = require("util");
var GrimoireInterfaceImpl = (function () {
    function GrimoireInterfaceImpl() {
        this.nodeDeclarations = new NamespacedDictionary_1["default"]();
        this.converters = new NamespacedDictionary_1["default"]();
        this.componentDeclarations = new NamespacedDictionary_1["default"]();
        this.rootNodes = {};
        this.loadTasks = [];
        this.nodeDictionary = {};
    }
    /**
     * Generate namespace helper function
     * @param  {string} ns namespace URI to be used
     * @return {[type]}    the namespaced identity
     */
    GrimoireInterfaceImpl.prototype.ns = function (ns) {
        return function (name) { return new NamespacedIdentity_1["default"](ns, name); };
    };
    /**
     * Register plugins
     * @param  {(}      loadTask [description]
     * @return {[type]}          [description]
     */
    GrimoireInterfaceImpl.prototype.register = function (loadTask) {
        this.loadTasks.push(loadTask);
    };
    GrimoireInterfaceImpl.prototype.resolvePlugins = function () {
        for (var i = 0; i < this.loadTasks.length; i++) {
            yield this.loadTasks[i]();
        }
    };
    // TODO test
    /**
     * register custom component
     * @param  {string                |   NamespacedIdentity} name          [description]
     * @param  {IAttributeDeclaration }} attributes           [description]
     * @param  {Object                |   (new                 (}           obj           [description]
     * @return {[type]}                       [description]
     */
    GrimoireInterfaceImpl.prototype.registerComponent = function (name, obj) {
        name = Ensure_1["default"].ensureTobeNamespacedIdentity(name);
        var attrs = obj["attributes"];
        obj = this._ensureTobeComponentConstructor(obj);
        this.componentDeclarations.set(name, new ComponentDeclaration_1["default"](name, attrs, obj));
    };
    GrimoireInterfaceImpl.prototype.registerNode = function (name, requiredComponents, defaultValues, superNode) {
        name = Ensure_1["default"].ensureTobeNamespacedIdentity(name);
        requiredComponents = Ensure_1["default"].ensureTobeNamespacedIdentityArray(requiredComponents);
        defaultValues = Ensure_1["default"].ensureTobeNamespacedDictionary(defaultValues, name.ns);
        superNode = Ensure_1["default"].ensureTobeNamespacedIdentity(superNode);
        this.nodeDeclarations.set(name, new NodeDeclaration_1["default"](name, NamespacedSet_1["default"].fromArray(requiredComponents), defaultValues, superNode));
    };
    GrimoireInterfaceImpl.prototype.registerConverter = function (name, converter) {
        name = Ensure_1["default"].ensureTobeNamespacedIdentity(name);
        this.converters.set(name, { name: name, convert: converter });
    };
    GrimoireInterfaceImpl.prototype.addRootNode = function (tag, node) {
        tag.setAttribute("x-rootNodeId", node.id);
        this.rootNodes[node.id] = node;
        return node.id;
    };
    GrimoireInterfaceImpl.prototype.getRootNode = function (scriptTag) {
        var id = scriptTag.getAttribute("x-rootNodeId");
        return this.rootNodes[id];
    };
    GrimoireInterfaceImpl.prototype.queryRootNodes = function (query) {
        var scriptTags = document.querySelectorAll(query);
        var nodes = [];
        for (var i = 0; i < scriptTags.length; i++) {
            var node = this.getRootNode(scriptTags.item(i));
            if (node) {
                nodes.push(node);
            }
        }
        return nodes;
    };
    /**
     * This method is not for users.
     * Just for unit testing.
     *
     * Clear all configuration that GrimoireInterface contain.
     */
    GrimoireInterfaceImpl.prototype.clear = function () {
        this.nodeDeclarations.clear();
        this.componentDeclarations.clear();
        this.converters.clear();
        for (var key in this.rootNodes) {
            delete this.rootNodes[key];
        }
        this.loadTasks.splice(0, this.loadTasks.length);
    };
    /**
     * Ensure the given object or constructor to be an constructor inherits Component;
     * @param  {Object | (new ()=> Component} obj [The variable need to be ensured.]
     * @return {[type]}      [The constructor inherits Component]
     */
    GrimoireInterfaceImpl.prototype._ensureTobeComponentConstructor = function (obj) {
        if (typeof obj === "function") {
            if (!(obj.prototype instanceof Component_1["default"]) && obj !== Component_1["default"]) {
                throw new Error("Component constructor must extends Component class.");
            }
        }
        else if (typeof obj === "object") {
            var newCtor = function () { return; };
            util_1.inherits(newCtor, Component_1["default"]);
            for (var key in obj) {
                newCtor.prototype[key] = obj[key];
            }
            obj = newCtor;
        }
        else if (!obj) {
            obj = Component_1["default"];
        }
        return obj;
    };
    return GrimoireInterfaceImpl;
})();
var context = new GrimoireInterfaceImpl();
var obtainGomlInterface = function (query) {
    var gomlContext = new GomlInterface_1["default"](context.queryRootNodes(query));
    var queryFunc = gomlContext.queryFunc.bind(gomlContext);
    Object.setPrototypeOf(queryFunc, gomlContext);
    return queryFunc;
};
// const bindedFunction = obtainGomlInterface.bind(context);
Object.setPrototypeOf(obtainGomlInterface, context);
exports["default"] = obtainGomlInterface;
