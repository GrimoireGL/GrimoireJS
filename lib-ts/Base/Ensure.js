var NamespacedIdentity_1 = require("./NamespacedIdentity");
var NamespacedDictionary_1 = require("./NamespacedDictionary");
/**
 * Provides static methods to ensure arguments are valid type.
 */
var Ensure = (function () {
    function Ensure() {
    }
    /**
     * Ensure specified str being string
     * @param  {string | number}      str [description]
     * @return {string}      [description]
     */
    Ensure.ensureString = function (str) {
        if (typeof str === "string") {
            return str;
        }
        else if (typeof str === "number") {
            return str.toString();
        }
        else {
            throw new Error("Specified argument can not convert into string");
        }
    };
    /**
     * Ensure specified number being number
     * @param  {string | number}      str [description]
     * @return {string}      [description]
     */
    Ensure.ensureNumber = function (num) {
        if (typeof num === "string") {
            return parseInt(num, 10);
        }
        else if (typeof num === "number") {
            return num;
        }
        else {
            throw new Error("specified argument can not be converted into number");
        }
    };
    Ensure.ensureTobeNamespacedIdentity = function (name) {
        if (!name) {
            return undefined;
        }
        if (typeof name === "string") {
            return new NamespacedIdentity_1["default"](name);
        }
        else {
            return name;
        }
    };
    Ensure.ensureTobeNamespacedIdentityArray = function (names) {
        if (!names) {
            return [];
        }
        var newArr = [];
        for (var i = 0; i < names.length; i++) {
            newArr.push(this.ensureTobeNamespacedIdentity(names[i]));
        }
        return newArr;
    };
    Ensure.ensureTobeNamespacedDictionary = function (dict, defaultNamespace) {
        if (!dict) {
            return new NamespacedDictionary_1["default"]();
        }
        if (dict instanceof NamespacedDictionary_1["default"]) {
            return dict;
        }
        else {
            var newDict = new NamespacedDictionary_1["default"]();
            for (var key in dict) {
                newDict.set(new NamespacedIdentity_1["default"](defaultNamespace, key), dict[key]);
            }
            return newDict;
        }
    };
    return Ensure;
})();
exports["default"] = Ensure;
