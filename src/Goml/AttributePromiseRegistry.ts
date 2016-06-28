import jThreeObject from "../Base/JThreeObject";
import GomlAttribute from "./GomlAttribute";
import Q from "q";

class AttributePromiseRegistry extends jThreeObject {
    /**
     * If true, async syncing is now available.
     * @type {boolean}
     */
    public enabled: boolean = false;

    /**
     * promise objects which is registed.
     */
    private _promises: Q.Promise<GomlAttribute>[] = [];

    /**
     * this flag is true when async method is called.
     * @type {boolean}
     */
    private _asyncing: boolean = false;

    /**
     * all expected arguments object of all promises.
     * @type {GomlAttribute[]}
     */
    private _asyncObjects: GomlAttribute[] = [];

    /**
     * callback function which is called when all promise objects are resolved.
     * @type {[type]}
     */
    private _allOfCallbackfn: () => void = null;

    constructor() {
        super();
    }
    /**
     * register promise object and expected callback arguments object when promise is resolved.
     * @param {Q.Promise<GomlAttribute>} promise        [description]
     * @param {GomlAttribute}            callbackObject [description]
     */
    public register(promise: Q.Promise<GomlAttribute>, callbackObject: GomlAttribute): void {
        this._promises.push(promise);
        this._asyncObjects.push(callbackObject);
        if (this._asyncing) {
            promise.then((ga) => {
                this._thenCallbackfn(ga);
            });
        }
    }

    /**
     * sync all registered promises.
     * @param {() => void} callbackfn [description]
     */
    public async(callbackfn: () => void): void {
        this._asyncing = true;
        this._allOfCallbackfn = callbackfn;
        this._promises.forEach((p) => {
            p.then((ga) => {
                this._thenCallbackfn(ga);
            });
        });
    }

    /**
     * clear all async sequence.
     */
    public clear(): void {
        this._asyncing = false;
        this._promises = [];
        this._asyncObjects = [];
        this._allOfCallbackfn = null;
    }

    /**
     * [_thenCallbackfn description]
     * @param {GomlAttribute} ga [description]
     */
    private _thenCallbackfn(ga: GomlAttribute): void {
        const index = this._asyncObjects.indexOf(ga);
        if (index !== -1) {
            this._asyncObjects.splice(index, 1);
        } else {
            throw Error("registered object does not equal to callback object");
        }
        // console.log(this._asyncObjects);
        if (this._asyncObjects.length === 0) {
            this._allOfCallbackfn();
            this.clear();
        }
    }
}

export default AttributePromiseRegistry;
