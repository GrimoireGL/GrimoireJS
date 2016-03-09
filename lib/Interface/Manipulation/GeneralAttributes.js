import J3Object from "../J3Object";
import J3ObjectBase from "../J3ObjectBase";
import isString from "lodash.isstring";
import isUndefined from "lodash.isundefined";
import isPlainObject from "lodash.isplainobject";
import isFunction from "lodash.isfunction";
class GeneralAttribute extends J3ObjectBase {
    static _setAttr(node, attributeName, value) {
        if (node.attributes.isDefined(attributeName)) {
            node.attributes.setValue(attributeName, value);
        }
        else {
            const gomlAttribute = node.attributes.reserveAttribute(attributeName, value);
            gomlAttribute.on("changed", (ga) => {
                node.props.getProp("elem").setAttribute(attributeName, ga.Value);
            });
            gomlAttribute.notifyValueChanged();
        }
    }
    attr(argu0, argu1) {
        if (this.length === 0) {
            throw new Error("No target");
        }
        if (isString(argu0)) {
            switch (true) {
                case (isUndefined(argu1)):
                    return this[0].attributes.getValueStr(argu0);
                case (isFunction(argu1)):
                    throw new Error("Not implemented yet");
                default:
                    J3Object.each(this, (i, node) => {
                        GeneralAttribute._setAttr(node, argu0, argu1);
                    });
                    return this;
            }
        }
        else if (isPlainObject(argu0)) {
            Object.keys(argu0).forEach((attributeName) => {
                GeneralAttribute._setAttr(this[0], attributeName, argu0[attributeName]);
            });
            return this;
        }
        else {
            throw new Error("Argument type is not correct");
        }
    }
    attrObj(argu0, argu1) {
        if (this.length === 0) {
            throw new Error("No target");
        }
        if (isString(argu0)) {
            switch (true) {
                case (isUndefined(argu1)):
                    return this[0].attributes.getValue(argu0);
                default:
                    J3Object.each(this, (i, node) => {
                        GeneralAttribute._setAttr(node, argu0, argu1);
                    });
                    return this;
            }
        }
        else if (isPlainObject(argu0)) {
            Object.keys(argu0).forEach((attributeName) => {
                GeneralAttribute._setAttr(this[0], attributeName, argu0[attributeName]);
            });
            return this;
        }
        else {
            throw new Error("Argument type is not correct");
        }
    }
}
export default GeneralAttribute;
