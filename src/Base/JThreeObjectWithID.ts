import JThreeObject from "./JThreeObject";
import JThreeID from "./JThreeID";
import IIDObject from "./IIDObject";

/**
 * JThree object with unique ID to identify object instancies.
 * @type {[type]}
 */
class JThreeObjectWithID extends JThreeObject implements IIDObject {
    constructor(id?: string) {
        super();
        this.id = id || JThreeID.getUniqueRandom(10);
    }

    /**
     * ID related to this instance to identify.
     */
    public id: string;
}

export default JThreeObjectWithID;
