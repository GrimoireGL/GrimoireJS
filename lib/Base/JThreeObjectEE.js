import { EventEmitter } from "events";
import JThreeObject from "./JThreeObject";
/**
 * EventEmitterをmixinしたJThreeObject
 */
class JThreeObjectEE extends JThreeObject {
    constructor() {
        super();
    }
}
function applyMixins(derivedCtor, baseCtors) {
    baseCtors.forEach((baseCtor) => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}
applyMixins(JThreeObjectEE, [EventEmitter]);
export default JThreeObjectEE;
