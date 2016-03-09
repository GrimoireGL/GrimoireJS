import JThreeObject from "../Base/JThreeObject";
import GomlAttribute from "./GomlAttribute";
import isUndefined from "lodash.isundefined";
/**
 * The class managing attributes of a node.
 */
class AttributeDictionary extends JThreeObject {
    /**
     * @param {node} the node this attribute dictionary has.
     */
    constructor(node) {
        super();
        this._attributes = {};
        this._node = node;
    }
    forEachAttr(callbackfn) {
        Object.keys(this._attributes).forEach((k) => {
            let v = this._attributes[k];
            callbackfn(v, k, this._attributes);
        }, this);
        return this;
    }
    getValue(attrName) {
        const attr = this._attributes[attrName];
        if (attr === undefined) {
            console.warn(`attribute "${attrName}" is not found.`);
        }
        else {
            return attr.Value;
        }
    }
    getValueStr(attrName) {
        const attr = this._attributes[attrName];
        if (attr === undefined) {
            console.warn(`attribute "${attrName}" is not found.`);
        }
        else {
            return attr.ValueStr;
        }
    }
    setValue(attrName, value) {
        const attr = this._attributes[attrName];
        if (attr === undefined) {
            console.warn(`attribute "${attrName}" is not found.`);
        }
        else {
            if (attr.constant) {
                console.error(`attribute: ${attrName} is constant attribute`);
                return;
            }
            attr.Value = value;
        }
    }
    setValueStr(attrName, value) {
        this.setValue(attrName, value);
    }
    getAttribute(attrName) {
        return this._attributes[attrName];
    }
    getAllAttributes() {
        return this._attributes;
    }
    getAnimater(attrName, beginTime, duration, beginVal, endVal, easing, onComplete) {
        const attr = this._attributes[attrName];
        if (attr === undefined) {
            console.warn(`attribute \"${attrName}\" is not found.`);
        }
        else {
            return attr.Converter.getAnimater(attr, beginVal, endVal, beginTime, duration, easing, onComplete);
        }
    }
    /**
     * Check the attribute passed is defined or not.
     */
    isDefined(attrName) {
        return this._attributes[attrName] !== undefined;
    }
    /**
     * Define attributes to the node.
     *
     * This method must not be called outside of Node classes.
     * If you define already defined attribute, it will be replaced.
     */
    defineAttribute(attributes) {
        // console.log("attributes_declaration", attributes);
        for (let key in attributes) {
            const attribute = attributes[key];
            const converter = this._node.nodeManager.configurator.getConverter(attribute.converter);
            if (!converter && (!attribute.reserved || !isUndefined(attribute.converter))) {
                throw new Error(`Converter \"${attribute.converter}\" is not found`);
            }
            const existed_attribute = this.getAttribute(key);
            let gomlAttribute = null;
            if (existed_attribute && existed_attribute.reserved) {
                // console.log("define_attribute(override)", key, attribute, this.node.getTypeName());
                gomlAttribute = existed_attribute;
                gomlAttribute.Converter = converter;
                gomlAttribute.constant = attribute.constant;
                gomlAttribute.Value = gomlAttribute.ValueStr;
                gomlAttribute.reserved = false;
                gomlAttribute.on("changed", attribute.onchanged.bind(this._node));
            }
            else {
                gomlAttribute = new GomlAttribute(key, attribute.value, converter, attribute.reserved, attribute.constant);
                if (attribute.reserved) {
                }
                else {
                    // console.log("define_attribute", key, attribute, this.node.getTypeName());
                    if (attribute.onchanged) {
                        gomlAttribute.on("changed", attribute.onchanged.bind(this._node));
                    }
                    else {
                        console.warn(`attribute "${key}" does not have onchange event handler. this causes lack of attribute's consistency.`);
                    }
                }
                this._attributes[key] = gomlAttribute;
            }
            if (this._node.Mounted && !gomlAttribute.reserved) {
                gomlAttribute.notifyValueChanged();
            }
        }
    }
    /**
     * Reserve attribute for define.
     *
     * This method could be called from outside of Node classes.
     */
    reserveAttribute(name, value) {
        const attribute = { [name]: { value, reserved: true } };
        this.defineAttribute(attribute);
        return this.getAttribute(name);
    }
    /**
     * Emit change events to all attributes
     */
    emitChangeAll() {
        Object.keys(this._attributes).forEach((k) => {
            let v = this._attributes[k];
            if (typeof v.Value !== "undefined") {
                v.notifyValueChanged();
            }
        });
    }
    updateValue(attrName) {
        if (typeof attrName === "undefined") {
            Object.keys(this._attributes).forEach((k) => {
                let v = this._attributes[k];
                v.notifyValueChanged();
            });
        }
        else {
            const target = this._attributes[attrName];
            target.notifyValueChanged();
        }
    }
}
export default AttributeDictionary;
