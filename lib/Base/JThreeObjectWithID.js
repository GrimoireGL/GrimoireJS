import JThreeObject from "./JThreeObject";
import JThreeID from "./JThreeID";
/**
 * JThree object with unique ID to identify object instancies.
 * @type {[type]}
 */
class JThreeObjectWithID extends JThreeObject {
    constructor(id) {
        super();
        this._id = id || JThreeID.getUniqueRandom(10);
    }
    /**
     * Provides an ID related to this instance to identify.
     */
    get ID() {
        return this._id;
    }
    set ID(id) {
        this._id = id;
    }
}
export default JThreeObjectWithID;
