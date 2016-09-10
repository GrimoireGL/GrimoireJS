var Ensure_1 = require("../Base/Ensure");
var NamespacedDictionary_1 = require("../Base/NamespacedDictionary");
var AttributeDeclaration_1 = require("./AttributeDeclaration");
var ComponentDeclaration = (function () {
    function ComponentDeclaration(name, attributes, ctor) {
        this.name = name;
        this.ctor = ctor;
        this.attributeDeclarations = new NamespacedDictionary_1["default"]();
        for (var key in attributes) {
            var val = attributes[key];
            var converter = Ensure_1["default"].ensureTobeNamespacedIdentity(val.converter);
            var attr = new AttributeDeclaration_1["default"](this, key, val.defaultValue, converter);
            this.attributeDeclarations.set(attr.name, attr);
        }
    }
    ComponentDeclaration.prototype.generateInstance = function () {
        var instance = new this.ctor();
        instance.name = this.name;
        instance.attributes = this.attributeDeclarations.map(function (attrDec) { return attrDec.generateAttributeInstance(); });
        return instance;
    };
    return ComponentDeclaration;
})();
exports["default"] = ComponentDeclaration;
