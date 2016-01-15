import JThreeObject = require("./JThreeObject");
import JThreeID = require("./JThreeID");

/**
 * JThree object with unique ID to identify object instancies.
 * @type {[type]}
 */
class JThreeObjectWithID extends JThreeObject {
    constructor(id?: string) {
        super();
        this._id = id || JThreeID.getUniqueRandom(10);
    }

    /**
     * ID related to this instance to identify.
     */
    private _id: string;

    /**
     * Provides an ID related to this instance to identify.
     */
    public get ID(): string {
        return this._id;
    }

    public set ID(id: string) {
        this._id = id;
    }
}

export = JThreeObjectWithID;
