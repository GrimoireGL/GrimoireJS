"use strict";
var GomlConfigurator_1 = require("./GomlConfigurator");
var NodeRecipe = (function () {
    function NodeRecipe(name, requiredComponents, requiredComponentsForChildren, defaultAttributes) {
        this._name = name;
        this._requiredComponents = requiredComponents;
        this._requiredComponentsForChildren = requiredComponentsForChildren;
        this.DefaultAttributes = defaultAttributes;
    }
    NodeRecipe.prototype.createNode = function (inheritedRequiredConponents) {
        var configurator = GomlConfigurator_1.default.Instance;
        var requiredComponents = this._requiredComponents;
        if (inheritedRequiredConponents) {
            requiredComponents = requiredComponents.concat(inheritedRequiredConponents);
            requiredComponents = requiredComponents.filter(function (x, i, self) { return self.indexOf(x) === i; });
        }
        var components = requiredComponents.map(function (name) { return configurator.getComponent(name); });
        return null;
    };
    return NodeRecipe;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NodeRecipe;
