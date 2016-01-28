import JsHack = require("./JsHack");
/**
 * Most based object for any jthree related classes.
 * @type {[type]}
 */
class JThreeObject {
    /**
     * Obtain stringfied object.
     * If this method was not overridden, this method return class name.
     * @return {string} stringfied object
     */
    public toString(): string {
        return JsHack.getObjectName(this);
    }

    /**
     * Obtain class name
     * @return {string} Class name of the instance.
     */
    public getTypeName(): string {
        return JsHack.getObjectName(this);
    }
}

export = JThreeObject;
