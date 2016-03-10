/**
 * Collections for JThreeObjectWithID
 */
class JThreeCollection {
    constructor() {
        /**
         * Managed collection
         * @type {{[key:string]:T} }
         */
        this._collection = {};
        this._length = 0;
    }
    /**
     * Obtain object by object ID
     * @param  {string} id object ID
     * @return {T}        obtained object
     */
    getById(id) {
        return this._collection[id];
    }
    /**
     * Check whether specified item is included in this collection
     * @param  {T}       item the object to check for
     * @return {boolean}      Whether the item is included or not.
     */
    isContained(item) {
        return !!this._collection[item.ID];
    }
    /**
     * Insert specified object into this collection.
     * If specified object has same ID with an object already inserted, old object will be replaced with new object.
     * @param  {T}       item the object to insert into
     * @return {boolean}      Whether specified object was replaced(false) or,simply inserted(true)
     */
    insert(item) {
        if (this.isContained(item)) {
            return false;
        }
        else {
            this._length++;
            this._collection[item.ID] = item;
            return true;
        }
    }
    /**
     * Delete specified object from this collection.
     * @param  {T}       item the object to delete
     * @return {boolean}      Whether specified object was already exist and deleted, or not.
     */
    del(item) {
        if (this.isContained(item)) {
            this._length--;
            delete this._collection[item.ID];
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * Execute passed function for each objects.
     * @param  {Delegates.Action3<T,string,JThreeCollection<T>>} act the function to exuecute for
     */
    each(act) {
        for (let elem in this._collection) {
            act(this._collection[elem], elem, this);
        }
    }
    /**
     * Basic array converted from this collection
     */
    asArray() {
        const array = new Array(this._length);
        let index = 0;
        for (let elem in this._collection) {
            array[index] = this._collection[elem];
            index++;
        }
        return array;
    }
    /**
     * Count of this collection
     */
    get length() {
        return this._length;
    }
}
export default JThreeCollection;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJhc2UvSlRocmVlQ29sbGVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQTs7R0FFRztBQUNIO0lBQUE7UUFDSTs7O1dBR0c7UUFDSyxnQkFBVyxHQUF5QixFQUFFLENBQUM7UUFFdkMsWUFBTyxHQUFXLENBQUMsQ0FBQztJQWdGaEMsQ0FBQztJQTlFRzs7OztPQUlHO0lBQ0ksT0FBTyxDQUFDLEVBQVU7UUFDckIsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxXQUFXLENBQUMsSUFBTztRQUN0QixNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLE1BQU0sQ0FBQyxJQUFPO1FBQ2pCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDakIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2YsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQ2pDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztJQUNMLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksR0FBRyxDQUFDLElBQU87UUFDZCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDZixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2pDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNqQixDQUFDO0lBQ0wsQ0FBQztJQUVEOzs7T0FHRztJQUNJLElBQUksQ0FBQyxHQUE0QztRQUNwRCxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUNoQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDNUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7T0FFRztJQUNJLE9BQU87UUFDVixNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdEMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDaEMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdEMsS0FBSyxFQUFFLENBQUM7UUFDWixDQUFDO1FBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUFXLE1BQU07UUFDYixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN4QixDQUFDO0FBQ0wsQ0FBQztBQUVELGVBQWUsZ0JBQWdCLENBQUMiLCJmaWxlIjoiQmFzZS9KVGhyZWVDb2xsZWN0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEpUaHJlZU9iamVjdFdpdGhJRCBmcm9tIFwiLi9KVGhyZWVPYmplY3RXaXRoSURcIjtcbmltcG9ydCB7QWN0aW9uM30gZnJvbSBcIi4uL0Jhc2UvRGVsZWdhdGVzXCI7XG4vKipcbiAqIENvbGxlY3Rpb25zIGZvciBKVGhyZWVPYmplY3RXaXRoSURcbiAqL1xuY2xhc3MgSlRocmVlQ29sbGVjdGlvbjxUIGV4dGVuZHMgSlRocmVlT2JqZWN0V2l0aElEPiB7XG4gICAgLyoqXG4gICAgICogTWFuYWdlZCBjb2xsZWN0aW9uXG4gICAgICogQHR5cGUge3tba2V5OnN0cmluZ106VH0gfVxuICAgICAqL1xuICAgIHByaXZhdGUgX2NvbGxlY3Rpb246IHsgW2tleTogc3RyaW5nXTogVCB9ID0ge307XG5cbiAgICBwcml2YXRlIF9sZW5ndGg6IG51bWJlciA9IDA7XG5cbiAgICAvKipcbiAgICAgKiBPYnRhaW4gb2JqZWN0IGJ5IG9iamVjdCBJRFxuICAgICAqIEBwYXJhbSAge3N0cmluZ30gaWQgb2JqZWN0IElEXG4gICAgICogQHJldHVybiB7VH0gICAgICAgIG9idGFpbmVkIG9iamVjdFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRCeUlkKGlkOiBzdHJpbmcpOiBUIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbGxlY3Rpb25baWRdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrIHdoZXRoZXIgc3BlY2lmaWVkIGl0ZW0gaXMgaW5jbHVkZWQgaW4gdGhpcyBjb2xsZWN0aW9uXG4gICAgICogQHBhcmFtICB7VH0gICAgICAgaXRlbSB0aGUgb2JqZWN0IHRvIGNoZWNrIGZvclxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgV2hldGhlciB0aGUgaXRlbSBpcyBpbmNsdWRlZCBvciBub3QuXG4gICAgICovXG4gICAgcHVibGljIGlzQ29udGFpbmVkKGl0ZW06IFQpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5fY29sbGVjdGlvbltpdGVtLklEXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnNlcnQgc3BlY2lmaWVkIG9iamVjdCBpbnRvIHRoaXMgY29sbGVjdGlvbi5cbiAgICAgKiBJZiBzcGVjaWZpZWQgb2JqZWN0IGhhcyBzYW1lIElEIHdpdGggYW4gb2JqZWN0IGFscmVhZHkgaW5zZXJ0ZWQsIG9sZCBvYmplY3Qgd2lsbCBiZSByZXBsYWNlZCB3aXRoIG5ldyBvYmplY3QuXG4gICAgICogQHBhcmFtICB7VH0gICAgICAgaXRlbSB0aGUgb2JqZWN0IHRvIGluc2VydCBpbnRvXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gICAgICBXaGV0aGVyIHNwZWNpZmllZCBvYmplY3Qgd2FzIHJlcGxhY2VkKGZhbHNlKSBvcixzaW1wbHkgaW5zZXJ0ZWQodHJ1ZSlcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5zZXJ0KGl0ZW06IFQpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuaXNDb250YWluZWQoaXRlbSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2xlbmd0aCsrO1xuICAgICAgICAgICAgdGhpcy5fY29sbGVjdGlvbltpdGVtLklEXSA9IGl0ZW07XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlbGV0ZSBzcGVjaWZpZWQgb2JqZWN0IGZyb20gdGhpcyBjb2xsZWN0aW9uLlxuICAgICAqIEBwYXJhbSAge1R9ICAgICAgIGl0ZW0gdGhlIG9iamVjdCB0byBkZWxldGVcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSAgICAgIFdoZXRoZXIgc3BlY2lmaWVkIG9iamVjdCB3YXMgYWxyZWFkeSBleGlzdCBhbmQgZGVsZXRlZCwgb3Igbm90LlxuICAgICAqL1xuICAgIHB1YmxpYyBkZWwoaXRlbTogVCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy5pc0NvbnRhaW5lZChpdGVtKSkge1xuICAgICAgICAgICAgdGhpcy5fbGVuZ3RoLS07XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fY29sbGVjdGlvbltpdGVtLklEXTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXhlY3V0ZSBwYXNzZWQgZnVuY3Rpb24gZm9yIGVhY2ggb2JqZWN0cy5cbiAgICAgKiBAcGFyYW0gIHtEZWxlZ2F0ZXMuQWN0aW9uMzxULHN0cmluZyxKVGhyZWVDb2xsZWN0aW9uPFQ+Pn0gYWN0IHRoZSBmdW5jdGlvbiB0byBleHVlY3V0ZSBmb3JcbiAgICAgKi9cbiAgICBwdWJsaWMgZWFjaChhY3Q6IEFjdGlvbjM8VCwgc3RyaW5nLCBKVGhyZWVDb2xsZWN0aW9uPFQ+Pik6IHZvaWQge1xuICAgICAgICBmb3IgKGxldCBlbGVtIGluIHRoaXMuX2NvbGxlY3Rpb24pIHtcbiAgICAgICAgICAgIGFjdCh0aGlzLl9jb2xsZWN0aW9uW2VsZW1dLCBlbGVtLCB0aGlzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJhc2ljIGFycmF5IGNvbnZlcnRlZCBmcm9tIHRoaXMgY29sbGVjdGlvblxuICAgICAqL1xuICAgIHB1YmxpYyBhc0FycmF5KCk6IFRbXSB7XG4gICAgICAgIGNvbnN0IGFycmF5ID0gbmV3IEFycmF5KHRoaXMuX2xlbmd0aCk7XG4gICAgICAgIGxldCBpbmRleCA9IDA7XG4gICAgICAgIGZvciAobGV0IGVsZW0gaW4gdGhpcy5fY29sbGVjdGlvbikge1xuICAgICAgICAgICAgYXJyYXlbaW5kZXhdID0gdGhpcy5fY29sbGVjdGlvbltlbGVtXTtcbiAgICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFycmF5O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvdW50IG9mIHRoaXMgY29sbGVjdGlvblxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgbGVuZ3RoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGVuZ3RoO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSlRocmVlQ29sbGVjdGlvbjtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
