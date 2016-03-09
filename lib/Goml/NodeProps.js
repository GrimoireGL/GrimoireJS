import { EventEmitter } from "events";
class NodeProps extends EventEmitter {
    constructor() {
        super();
        this._props = {};
    }
    /**
     * set Prop. Relative events is fired.
     * @param  {string} key   [description]
     * @param  {any}    value [description]
     * @return {IProps}       [description]
     */
    setProp(key, value) {
        this._props[key] = value;
        this.emit(key, value);
        return { [key]: value };
    }
    /**
     * Set event listener to prop.
     * instantly_exec is true, callbackfn will be called instantly.
     * @param  {string}                key            [description]
     * @param  {(value: any) => void} callbackfn     [description]
     * @param  {boolean}               instantly_exec [description]
     * @return {(value: any) => void}                [description]
     */
    setEventToProp(key, callbackfn, instantly_exec) {
        this.on(key, callbackfn);
        if (instantly_exec && this._props[key] !== undefined) {
            callbackfn(this._props[key]);
        }
        return callbackfn;
    }
    /**
     * Get props.
     * This method is not recommended to use due to lack of consistency.
     * Use #setEventToProp to add change handler.
     *
     * @param  {string} key [description]
     * @return {any}        [description]
     */
    getProp(key) {
        return this._props[key];
    }
}
export default NodeProps;
