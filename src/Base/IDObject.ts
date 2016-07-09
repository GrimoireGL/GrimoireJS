import IIDObject from "./IIDObject";
import IDGenerator from "./IDGenerator";
import JsHack from "./JsHack";
/**
 * Most based object for any Grimoire.js related classes.
 * @type {[type]}
 */
class IDObject implements IIDObject {
    /**
     * ID related to this instance to identify.
     */
    public id: string;

    constructor(id?: string) {
        this.id = id || IDGenerator.getUniqueRandom(10);
    }
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

export default IDObject;
