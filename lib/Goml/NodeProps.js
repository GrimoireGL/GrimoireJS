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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdvbWwvTm9kZVByb3BzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sUUFBUTtBQU1uQyx3QkFBd0IsWUFBWTtJQUdsQztRQUNFLE9BQU8sQ0FBQztRQUhGLFdBQU0sR0FBVyxFQUFFLENBQUM7SUFJNUIsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksT0FBTyxDQUFJLEdBQVcsRUFBRSxLQUFRO1FBQ3JDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3RCLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSSxjQUFjLENBQUksR0FBVyxFQUFFLFVBQThCLEVBQUUsY0FBd0I7UUFDNUYsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDekIsRUFBRSxDQUFDLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNyRCxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQy9CLENBQUM7UUFDRCxNQUFNLENBQUMsVUFBVSxDQUFDO0lBQ3BCLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0ksT0FBTyxDQUFJLEdBQVc7UUFDM0IsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDMUIsQ0FBQztBQUNILENBQUM7QUFFRCxlQUFlLFNBQVMsQ0FBQyIsImZpbGUiOiJHb21sL05vZGVQcm9wcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RXZlbnRFbWl0dGVyfSBmcm9tIFwiZXZlbnRzXCI7XG5cbmludGVyZmFjZSBJUHJvcHMge1xuICBba2V5OiBzdHJpbmddOiBhbnk7XG59XG5cbmNsYXNzIE5vZGVQcm9wcyBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIHByaXZhdGUgX3Byb3BzOiBJUHJvcHMgPSB7fTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIHNldCBQcm9wLiBSZWxhdGl2ZSBldmVudHMgaXMgZmlyZWQuXG4gICAqIEBwYXJhbSAge3N0cmluZ30ga2V5ICAgW2Rlc2NyaXB0aW9uXVxuICAgKiBAcGFyYW0gIHthbnl9ICAgIHZhbHVlIFtkZXNjcmlwdGlvbl1cbiAgICogQHJldHVybiB7SVByb3BzfSAgICAgICBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBwdWJsaWMgc2V0UHJvcDxUPihrZXk6IHN0cmluZywgdmFsdWU6IFQpOiBJUHJvcHMge1xuICAgIHRoaXMuX3Byb3BzW2tleV0gPSB2YWx1ZTtcbiAgICB0aGlzLmVtaXQoa2V5LCB2YWx1ZSk7XG4gICAgcmV0dXJuIHsgW2tleV06IHZhbHVlIH07XG4gIH1cblxuICAvKipcbiAgICogU2V0IGV2ZW50IGxpc3RlbmVyIHRvIHByb3AuXG4gICAqIGluc3RhbnRseV9leGVjIGlzIHRydWUsIGNhbGxiYWNrZm4gd2lsbCBiZSBjYWxsZWQgaW5zdGFudGx5LlxuICAgKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICAgICAgICAgIGtleSAgICAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtICB7KHZhbHVlOiBhbnkpID0+IHZvaWR9IGNhbGxiYWNrZm4gICAgIFtkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtICB7Ym9vbGVhbn0gICAgICAgICAgICAgICBpbnN0YW50bHlfZXhlYyBbZGVzY3JpcHRpb25dXG4gICAqIEByZXR1cm4geyh2YWx1ZTogYW55KSA9PiB2b2lkfSAgICAgICAgICAgICAgICBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBwdWJsaWMgc2V0RXZlbnRUb1Byb3A8VD4oa2V5OiBzdHJpbmcsIGNhbGxiYWNrZm46ICh2YWx1ZTogVCkgPT4gdm9pZCwgaW5zdGFudGx5X2V4ZWM/OiBib29sZWFuKTogKHZhbHVlOiBUKSA9PiB2b2lkIHtcbiAgICB0aGlzLm9uKGtleSwgY2FsbGJhY2tmbik7XG4gICAgaWYgKGluc3RhbnRseV9leGVjICYmIHRoaXMuX3Byb3BzW2tleV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgY2FsbGJhY2tmbih0aGlzLl9wcm9wc1trZXldKTtcbiAgICB9XG4gICAgcmV0dXJuIGNhbGxiYWNrZm47XG4gIH1cblxuICAvKipcbiAgICogR2V0IHByb3BzLlxuICAgKiBUaGlzIG1ldGhvZCBpcyBub3QgcmVjb21tZW5kZWQgdG8gdXNlIGR1ZSB0byBsYWNrIG9mIGNvbnNpc3RlbmN5LlxuICAgKiBVc2UgI3NldEV2ZW50VG9Qcm9wIHRvIGFkZCBjaGFuZ2UgaGFuZGxlci5cbiAgICpcbiAgICogQHBhcmFtICB7c3RyaW5nfSBrZXkgW2Rlc2NyaXB0aW9uXVxuICAgKiBAcmV0dXJuIHthbnl9ICAgICAgICBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBwdWJsaWMgZ2V0UHJvcDxUPihrZXk6IHN0cmluZyk6IFQge1xuICAgIHJldHVybiB0aGlzLl9wcm9wc1trZXldO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE5vZGVQcm9wcztcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
