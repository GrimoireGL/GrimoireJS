import JThreeObject from "./JThreeObject";
import { InvalidArgumentException } from "../Exceptions";
/**
* The class for implementing in Event-Driven architecture.
*/
class JThreeEvent extends JThreeObject {
    constructor(...args) {
        super(...args);
        /**
        * The variable to contain handlers references.
        */
        this._eventHandlers = [];
    }
    /**
    * Call all of handler you subscribed.
    */
    fire(object, eventArg) {
        this._eventHandlers.forEach((h) => h(object, eventArg));
    }
    /**
    *Add the handler you pass.
    *@param handler the handler you want to add.
    */
    addListener(handler) {
        if (typeof handler === "undefined") {
            throw new InvalidArgumentException("you can not add undefined as event handler");
        }
        this._eventHandlers.push(handler);
    }
    /**
    * Remove the handler you passing.
    * @param handler the handler you want to remove.
    */
    removeListener(handler) {
        for (let i = 0; i < this._eventHandlers.length; i++) {
            const val = this._eventHandlers[i];
            if (val === handler) {
                this._eventHandlers.splice(i, 1);
                break;
            }
        }
    }
}
export default JThreeEvent;
