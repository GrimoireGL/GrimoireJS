import Vector4 from "./Vector4";
import Vector3 from "./Vector3";
import Vector2 from "./Vector2";
/**
 *  The array object for managing vectors having specific dimension.
 */
class VectorArray {
    constructor(length) {
        if (length) {
            this.rawElements = new Array(length);
        }
        else {
            this.rawElements = [];
        }
    }
    /**
     * Generate vector array filled with zero vectors.
     * @param  {number}      dimension [description]
     * @param  {number}      length   [description]
     * @return {VectorArray}          [description]
     */
    static zeroVectorArray(dimension, length) {
        const array = new VectorArray(dimension * length);
        for (let i = 0; i < dimension * length; i++) {
            array.rawElements[i] = 0;
        }
        array._dimension = 0;
        return array;
    }
    static equal(v1, v2) {
        if (v1.ElementCount === v2.ElementCount) {
            return VectorArray.elementEqual(v1, v2);
        }
    }
    static elementEqual(v1, v2) {
        for (let i = 0; i < v1.ElementCount; i++) {
            if (v1.rawElements[i] !== v2.rawElements[i]) {
                return false;
            }
        }
        return true;
    }
    appendVector(vector) {
        this._verifyDimension(vector);
        this.rawElements.push(vector.rawElements);
    }
    setVector(index, vector) {
        this._verifyDimension(vector);
        for (let elemIndex = 0; elemIndex < vector.ElementCount; elemIndex++) {
            this.rawElements[index * this._dimension + elemIndex] = vector.rawElements[elemIndex];
        }
        return;
    }
    setRawArray(index, rawArray) {
        for (let elemIndex = 0; elemIndex < this._dimension; elemIndex++) {
            this.rawElements[index * this._dimension + elemIndex] = rawArray[elemIndex] ? rawArray[elemIndex] : 0;
        }
        return;
    }
    getVector(index) {
        switch (this._dimension) {
            case 2:
                return new Vector2(this.rawElements[index * this._dimension + 0], this.rawElements[index * this._dimension + 1]);
            case 3:
                return new Vector3(this.rawElements[index * this._dimension + 0], this.rawElements[index * this._dimension + 1], this.rawElements[index * this._dimension + 2]);
            case 4:
                return new Vector4(this.rawElements[index * this._dimension + 0], this.rawElements[index * this._dimension + 1], this.rawElements[index * this._dimension + 2], this.rawElements[index * this._dimension + 3]);
            default:
                return null;
        }
    }
    setVectorArray(vectors, offset = 0) {
        if (vectors.length === 0) {
            return;
        }
        this._verifyDimension(vectors[0]);
        vectors.forEach((e, i) => {
            if (this._dimension !== e.ElementCount) {
                throw new Error(`Unmatch unit size of vector element! at:${i}`);
            }
            for (let elemIndex = 0; elemIndex < this._dimension; elemIndex++) {
                this.rawElements[offset + this._dimension * i + elemIndex] = e.rawElements[elemIndex];
            }
        });
        return;
    }
    getVectorArray() {
        if (this.rawElements.length === 0) {
            return [];
        }
        const result = new Array(this.rawElements.length / this._dimension);
        for (let i = 0; i < result.length; i++) {
            result[i] = this.getVector(i);
        }
        return result;
    }
    get dimension() {
        return this._dimension;
    }
    _verifyDimension(vector) {
        if (typeof this._dimension !== "undefined" && this._dimension !== vector.ElementCount) {
            throw new Error("Unmatch unit size of vectors!");
        }
        else if (typeof this._dimension === "undefined") {
            this._dimension = vector.ElementCount;
        }
    }
}
export default VectorArray;
