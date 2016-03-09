import jThreeObject from "../Base/JThreeObject";
class AttributePromiseRegistry extends jThreeObject {
    constructor() {
        super();
        /**
         * promise objects which is registed.
         */
        this._promises = [];
        /**
         * this flag is true when async method is called.
         * @type {boolean}
         */
        this._asyncing = false;
        /**
         * all expected arguments object of all promises.
         * @type {GomlAttribute[]}
         */
        this._asyncObjects = [];
        /**
         * callback function which is called when all promise objects are resolved.
         * @type {[type]}
         */
        this._allOfCallbackfn = null;
    }
    /**
     * register promise object and expected callback arguments object when promise is resolved.
     * @param {Q.Promise<GomlAttribute>} promise        [description]
     * @param {GomlAttribute}            callbackObject [description]
     */
    register(promise, callbackObject) {
        this._promises.push(promise);
        this._asyncObjects.push(callbackObject);
        if (this._asyncing) {
            promise.then((ga) => {
                this._thenCallbacckfn(ga);
            });
        }
    }
    /**
     * sync all registered promises.
     * @param {() => void} callbackfn [description]
     */
    async(callbackfn) {
        this._asyncing = true;
        this._allOfCallbackfn = callbackfn;
        this._promises.forEach((p) => {
            p.then((ga) => {
                this._thenCallbacckfn(ga);
            });
        });
    }
    /**
     * clear all async sequence.
     */
    clear() {
        this._asyncing = false;
        this._promises = [];
        this._asyncObjects = [];
        this._allOfCallbackfn = null;
    }
    /**
     * [_thenCallbacckfn description]
     * @param {GomlAttribute} ga [description]
     */
    _thenCallbacckfn(ga) {
        const index = this._asyncObjects.indexOf(ga);
        if (index !== -1) {
            this._asyncObjects.splice(index, 1);
        }
        else {
            throw Error("registered object does not equal to callback object");
        }
        console.log(this._asyncObjects);
        if (this._asyncObjects.length === 0) {
            this._allOfCallbackfn();
            this.clear();
        }
    }
}
export default AttributePromiseRegistry;
