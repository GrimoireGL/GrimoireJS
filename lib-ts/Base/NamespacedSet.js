var NamespacedSet = (function () {
    function NamespacedSet() {
        /**
         * The map to containing all values managed by fqn.
         * @type {Map<string, V>}
         */
        this._fqnObjectMap = new Map();
    }
    NamespacedSet.fromArray = function (array) {
        var nSet = new NamespacedSet();
        nSet.pushArray(array);
        return nSet;
    };
    NamespacedSet.prototype.push = function (item) {
        this._fqnObjectMap.set(item.fqn, item);
        return this;
    };
    NamespacedSet.prototype.pushArray = function (item) {
        var _this = this;
        item.forEach(function (v) {
            _this.push(v);
        });
        return this;
    };
    NamespacedSet.prototype.values = function () {
        return this._fqnObjectMap.values();
    };
    NamespacedSet.prototype.toArray = function () {
        var ret = [];
        var values = this.values();
        for (var _i = 0; _i < values.length; _i++) {
            var val = values[_i];
            ret.push(val);
        }
        return ret;
    };
    NamespacedSet.prototype.clone = function () {
        var newSet = new NamespacedSet();
        var values = this.values();
        for (var _i = 0; _i < values.length; _i++) {
            var i = values[_i];
            newSet.push(i);
        }
        return newSet;
    };
    NamespacedSet.prototype.merge = function (other) {
        var values = other.values();
        for (var _i = 0; _i < values.length; _i++) {
            var elem = values[_i];
            this.push(elem);
        }
        return this;
    };
    return NamespacedSet;
})();
exports["default"] = NamespacedSet;
