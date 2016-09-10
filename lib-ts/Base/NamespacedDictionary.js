var NamespacedIdentity_1 = require("./NamespacedIdentity");
var NamespacedDictionary = (function () {
    function NamespacedDictionary() {
        this._nameObjectMap = new Map();
        this._fqnObjectMap = new Map();
    }
    NamespacedDictionary.prototype.set = function (key, value) {
        var namedChildMap;
        if (this._nameObjectMap.has(key.name)) {
            namedChildMap = this._nameObjectMap.get(key.name);
        }
        else {
            namedChildMap = new Map();
            this._nameObjectMap.set(key.name, namedChildMap);
        }
        namedChildMap.set(key.fqn, value);
        this._fqnObjectMap.set(key.fqn, value);
    };
    NamespacedDictionary.prototype.delete = function (key) {
        if (this._fqnObjectMap.has(key.fqn)) {
            var theMap = this._nameObjectMap.get(key.name);
            if (theMap.size === 1) {
                this._nameObjectMap.delete(key.name);
            }
            else {
                theMap.delete(key.fqn);
            }
            this._fqnObjectMap.delete(key.fqn);
        }
    };
    NamespacedDictionary.prototype.get = function (arg1, name) {
        if (typeof arg1 === "string") {
            if (name) {
                return this.get(new NamespacedIdentity_1["default"](arg1, name));
            }
            else {
                var namedMap = this._nameObjectMap.get(arg1.toUpperCase());
                if (!namedMap) {
                    return null;
                }
                if (namedMap.size === 1) {
                    var itr = namedMap.values();
                    return itr.next().value;
                }
                else {
                    throw new Error("Specified tag name " + arg1 + " is ambigious to identify.");
                }
            }
        }
        else {
            if (arg1 instanceof NamespacedIdentity_1["default"]) {
                return this.fromFQN(arg1.fqn);
            }
            else {
                if (arg1.prefix) {
                    return this.get(new NamespacedIdentity_1["default"](arg1.namespaceURI, arg1.localName));
                }
                else {
                    if (arg1.namespaceURI && this._fqnObjectMap.has(arg1.localName.toUpperCase() + "|" + arg1.namespaceURI.toUpperCase())) {
                        return this.get(new NamespacedIdentity_1["default"](arg1.namespaceURI.toUpperCase(), arg1.localName.toUpperCase()));
                    }
                    if (arg1 && arg1.ownerElement && arg1.ownerElement.namespaceURI && this._fqnObjectMap.has(arg1.localName.toUpperCase() + "|" + arg1.ownerElement.namespaceURI.toUpperCase())) {
                        return this.get(new NamespacedIdentity_1["default"](arg1.ownerElement.namespaceURI.toUpperCase(), arg1.localName.toUpperCase()));
                    }
                    return this.get(arg1.localName);
                }
            }
        }
    };
    NamespacedDictionary.prototype.fromFQN = function (fqn) {
        return this._fqnObjectMap.get(fqn);
    };
    NamespacedDictionary.prototype.isAmbigious = function (name) {
        return this._nameObjectMap.get(name.toUpperCase()).size > 1;
    };
    NamespacedDictionary.prototype.has = function (name) {
        return this._nameObjectMap.has(name);
    };
    NamespacedDictionary.prototype.pushDictionary = function (dict) {
        var _this = this;
        dict._fqnObjectMap.forEach(function (value, keyFQN) {
            var id = NamespacedIdentity_1["default"].fromFQN(keyFQN);
            _this.set(id, value);
        });
        return this;
    };
    NamespacedDictionary.prototype.toArray = function () {
        var ret = [];
        this._fqnObjectMap.forEach(function (value) {
            ret.push(value);
        });
        return ret;
    };
    NamespacedDictionary.prototype.forEach = function (callback) {
        this._fqnObjectMap.forEach(function (val, key) {
            callback(val, key);
        });
        return this;
    };
    NamespacedDictionary.prototype.map = function (callback) {
        var ret = new NamespacedDictionary();
        this._fqnObjectMap.forEach(function (val, fqn) {
            var id = NamespacedIdentity_1["default"].fromFQN(fqn);
            ret.set(id, callback(val, fqn));
        });
        return ret;
    };
    NamespacedDictionary.prototype.clear = function () {
        this._nameObjectMap.clear();
        this._fqnObjectMap.clear();
    };
    return NamespacedDictionary;
})();
exports["default"] = NamespacedDictionary;
