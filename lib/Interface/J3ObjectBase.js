class J3ObjectBase {
    constructor() {
        this.length = 0;
    }
    __setArray(arr) {
        Array.prototype.splice.call(this, 0, this.length);
        Array.prototype.push.apply(this, arr);
    }
    __getArray() {
        return Array.prototype.map.call(this, (v) => v);
    }
}
export default J3ObjectBase;
