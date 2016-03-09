import { EventEmitter } from "events";
import JThreeObjectWithID from "./JThreeObjectWithID";
/**
 * EventEmitterをmixinしたJThreeObjectWithID
 */
class JThreeObjectEEWithID extends JThreeObjectWithID {
    constructor(id) {
        super(id);
    }
}
function applyMixins(derivedCtor, baseCtors) {
    baseCtors.forEach((baseCtor) => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}
applyMixins(JThreeObjectEEWithID, [EventEmitter]);
export default JThreeObjectEEWithID;
