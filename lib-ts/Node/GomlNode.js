var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EEObject_1 = require("../Base/EEObject");
var NodeUtility_1 = require("./NodeUtility");
var NamespacedDictionary_1 = require("../Base/NamespacedDictionary");
var GomlNode = (function (_super) {
    __extends(GomlNode, _super);
    function GomlNode(recipe, element, components, attributes) {
        var _this = this;
        _super.call(this);
        this.children = [];
        this.sharedObject = {};
        this._mounted = false;
        this.nodeDeclaration = recipe;
        this.element = element;
        this._components = new NamespacedDictionary_1["default"]();
        components.forEach(function (c) {
            _this._components.set(c.name, c);
        });
        this.attributes = new NamespacedDictionary_1["default"]();
        attributes.forEach(function (attr) {
            _this.attributes.set(attr.name, attr);
        });
    }
    Object.defineProperty(GomlNode.prototype, "nodeName", {
        get: function () {
            return this.nodeDeclaration.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GomlNode.prototype, "parent", {
        get: function () {
            return this._parent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GomlNode.prototype, "Mounted", {
        get: function () {
            return this._mounted;
        },
        enumerable: true,
        configurable: true
    });
    GomlNode.prototype.sendMessage = function (message, args) {
        this._components.forEach(function (component) {
            var method = component[message];
            if (typeof method === "function") {
                method.bind(component)(args);
            }
        });
    };
    GomlNode.prototype.broadcastMessage = function (arg1, arg2, arg3) {
        if (typeof arg1 === "number") {
            var range = arg1;
            var message = arg2;
            var args = arg3;
            this.sendMessage(message, args);
            if (range > 0) {
                for (var i = 0; i < this.children.length; i++) {
                    this.children[i].broadcastMessage(range - 1, message, args);
                }
            }
        }
        else {
            var message = arg1;
            var args = arg2;
            this.sendMessage(message, args);
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].broadcastMessage(message, args);
            }
        }
    };
    // public broadcastMessage(name: string, args: any): void {
    //   this.sendMessage(name, args);
    // for (let i = 0; i < this.children.length; i++) {
    //   this.children[i].broadcastMessage(name, args);
    // }
    // }
    /**
     * Add child.
     * @param {GomlNode} Target node to be inserted.
     * @param {number}   index Index of insert location in children. If this argument is null or undefined, target will be inserted in last. If this argument is negative number, target will be inserted in index from last.
     */
    GomlNode.prototype.addChild = function (child, index, elementSync) {
        var _this = this;
        if (elementSync === void 0) { elementSync = true; }
        child._parent = this;
        child.sharedObject = this.sharedObject;
        child._components.forEach(function (compo) { compo.sharedObject = _this.sharedObject; });
        if (index != null && typeof index !== "number") {
            throw new Error("insert index should be number or null or undefined.");
        }
        var insertIndex = index == null ? this.children.length : index;
        this.children.splice(insertIndex, 0, child);
        // handling html
        if (elementSync) {
            var referenceElement = null;
            if (index != null) {
                referenceElement = this.element[NodeUtility_1["default"].getNodeListIndexByElementIndex(this.element, index)];
            }
            this.element.insertBefore(child.element, referenceElement);
        }
        // mounting
        if (this.mounted()) {
            child.setMounted(true);
        }
    };
    /**
     * Remove child.
     * @param {GomlNode} child Target node to be inserted.
     */
    GomlNode.prototype.removeChild = function (child) {
        for (var i = 0; i < this.children.length; i++) {
            var v = this.children[i];
            if (v === child) {
                child._parent = null;
                child.sharedObject = {};
                child._components.forEach(function (compo) { compo.sharedObject = child.sharedObject; });
                this.children.splice(i, 1);
                if (this.mounted()) {
                    child.setMounted(false);
                }
                // html handling
                this.element.removeChild(child.element);
                break;
            }
        }
    };
    /**
     * remove myself
     */
    GomlNode.prototype.remove = function () {
        if (this.parent) {
            this.parent.removeChild(this);
        }
        else {
            throw new Error("root Node cannot be removed.");
        }
    };
    GomlNode.prototype.forEachAttr = function (callbackfn) {
        this.attributes.forEach(callbackfn);
        return this;
    };
    GomlNode.prototype.getValue = function (attrName) {
        var attr = this.getAttribute(attrName);
        if (attr === undefined) {
            throw new Error("attribute \"" + attrName + "\" is not found.");
        }
        else {
            return attr.Value;
        }
    };
    GomlNode.prototype.setValue = function (attrName, value) {
        // TODO: 引数が名前空間を含むかどうかで分岐
        var attr = this.getAttribute(attrName);
        if (attr === undefined) {
            console.warn("attribute \"" + attrName + "\" is not found.");
        }
        else {
            throw new Error("root Node cannot be removed.");
        }
    };
    GomlNode.prototype.getAttribute = function (attrName) {
        var attr = this.attributes.get(attrName);
        if (!attr) {
            throw new Error("attribute \"" + attrName + "\" is not found.");
        }
        return attr;
    };
    /**
     * Set attribute
     * @param {string} name  attribute name string.
     * @param {any}    value attribute value.
     */
    GomlNode.prototype.setAttribute = function (name, value) {
        this.attributes.get(name).Value = value;
    };
    // /**
    //  * Get attribute.
    //  * @param  {string} name attribute name string.
    //  * @return {any}         attribute value.
    //  */
    // public getAttribute(name: string): any {
    //   return this._attributes.get(name);
    // }
    /**
     * Get mounted status.
     * @return {boolean} Whether this node is mounted or not.
     */
    GomlNode.prototype.emitChangeAll = function () {
        var _this = this;
        Object.keys(this.attributes).forEach(function (k) {
            var v = _this.attributes[k];
            v.forEach(function (attr) {
                if (typeof attr.Value !== "undefined") {
                }
            });
        });
    };
    GomlNode.prototype.updateValue = function (attrName) {
        var _this = this;
        if (typeof attrName === "undefined") {
            Object.keys(this.attributes).forEach(function (k) {
                var v = _this.attributes[k];
                v.forEach(function (attr) {
                    // attr.notifyValueChanged();
                });
            });
        }
        else {
        }
    };
    /**
     * Get mounted status.
     * @return {boolean} Whether this node is mounted or not.
     */
    GomlNode.prototype.mounted = function () {
        return this._mounted;
    };
    /**
     * Update mounted status and emit events
     * @param {boolean} mounted Mounted status.
     */
    GomlNode.prototype.setMounted = function (mounted) {
        if ((mounted && !this._mounted) || (!mounted && this._mounted)) {
            this._mounted = mounted;
            this.attributes.forEach(function (value) {
                value.responsively = true;
            });
            this.children.forEach(function (child) {
                child.setMounted(mounted);
            });
        }
    };
    /**
     * Get index of this node from parent.
     * @return {number} number of index.
     */
    GomlNode.prototype.index = function () {
        return this._parent.children.indexOf(this);
    };
    GomlNode.prototype.addComponent = function (component) {
        component.sharedObject = this.sharedObject;
        this._components.set(component.name, component);
    };
    GomlNode.prototype.getComponents = function () {
        return this._components;
    };
    return GomlNode;
})(EEObject_1["default"]);
exports["default"] = GomlNode;
