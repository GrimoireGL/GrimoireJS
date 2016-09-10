var GomlNode_1 = require("./GomlNode");
var GrimoireInterface_1 = require("../GrimoireInterface");
var NodeDeclaration = (function () {
    function NodeDeclaration(name, _requiredComponents, _defaultAttributes, inherits) {
        this.name = name;
        this._requiredComponents = _requiredComponents;
        this._defaultAttributes = _defaultAttributes;
        this.inherits = inherits;
    }
    Object.defineProperty(NodeDeclaration.prototype, "requiredComponents", {
        get: function () {
            if (!this._requiredComponentsActual) {
                this._resolveInherites();
            }
            return this._requiredComponentsActual;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeDeclaration.prototype, "defaultAttributes", {
        get: function () {
            if (!this._defaultAttributesActual) {
                this._resolveInherites();
            }
            return this._defaultAttributesActual;
        },
        enumerable: true,
        configurable: true
    });
    NodeDeclaration.prototype.createNode = function (element) {
        var components = this.requiredComponents;
        var componentsArray = components.toArray().map(function (id) {
            var declaration = GrimoireInterface_1["default"].componentDeclarations.get(id);
            if (!declaration) {
                throw new Error("component '" + id.fqn + "' is not found.");
            }
            return declaration.generateInstance();
        });
        var requiredAttrs = componentsArray.map(function (c) { return c.attributes.toArray(); })
            .reduce(function (pre, current) { return pre === undefined ? current : pre.concat(current); }, []);
        return new GomlNode_1["default"](this, element, componentsArray, requiredAttrs);
    };
    NodeDeclaration.prototype._resolveInherites = function () {
        // console.log("resolveInherits");
        if (!this.inherits) {
            // console.log("\tnothing inherits");
            this._requiredComponentsActual = this._requiredComponents;
            this._defaultAttributesActual = this._defaultAttributes;
            return;
        }
        var inherits = GrimoireInterface_1["default"].nodeDeclarations.get(this.inherits);
        var inheritedRequiredComponents = inherits.requiredComponents;
        var inheritedDefaultAttribute = inherits.defaultAttributes;
        this._requiredComponentsActual = this._requiredComponents.clone().merge(inheritedRequiredComponents);
        this._defaultAttributesActual = this._defaultAttributes.pushDictionary(inheritedDefaultAttribute);
    };
    return NodeDeclaration;
})();
exports["default"] = NodeDeclaration;
