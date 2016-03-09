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
