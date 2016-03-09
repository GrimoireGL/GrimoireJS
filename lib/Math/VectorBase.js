import { InvalidStringException } from "../Exceptions";
class VectorBase {
    constructor() {
        this._magnitudeSquaredCache = -1;
        this._magnitudeCache = -1;
    }
    get magnitude() {
        if (this._magnitudeCache < 0) {
            this._magnitudeCache = Math.sqrt(this.sqrMagnitude);
        }
        return this._magnitudeCache;
    }
    get ElementCount() {
        return 0;
    }
    get sqrMagnitude() {
        if (this._magnitudeSquaredCache < 0) {
            let sum = 0;
            let r = this.rawElements;
            for (let i = 0; i < this.ElementCount; i++) {
                sum += r[i] * r[i];
            }
            this._magnitudeSquaredCache = sum;
        }
        return this._magnitudeSquaredCache;
    }
    static __elementEquals(v1, v2) {
        if (v1.ElementCount !== v2.ElementCount) {
            return false;
        }
        for (let i = 0; i < v1.ElementCount; i++) {
            if (v1.rawElements[i] !== v2.rawElements[i]) {
                return false;
            }
        }
        return true;
    }
    static __nearlyElementEquals(v1, v2) {
        if (v1.ElementCount !== v2.ElementCount) {
            return false;
        }
        let error = 0.01;
        for (let i = 0; i < v1.ElementCount; i++) {
            if (Math.abs(v1.rawElements[i] - v2.rawElements[i]) > error) {
                return false;
            }
        }
        return true;
    }
    static __fromGenerationFunction(v1, v2, gen) {
        let f = new Float32Array(v1.ElementCount);
        for (let i = 0; i < f.length; i++) {
            f[i] = gen(i, v1, v2);
        }
        return f;
    }
    static __parse(str) {
        const checkRegex = /(-?)([\d,E\+\-\.]+)?(n)?\(([-\d,E\+\.\s]+)\)/g;
        const matches = checkRegex.exec(str);
        if (matches) {
            if (!matches[4]) {
                throw new InvalidStringException(`The specified string '${str}' is not containing braced vector.`);
            }
            return {
                needNormalize: matches[3] === "n",
                needNegate: matches[1] === "-",
                coefficient: parseFloat(matches[2]),
                elements: VectorBase._parseRawVector(matches[4])
            };
        }
        else {
            // Assume this is simplified format.
            return {
                needNormalize: false,
                needNegate: false,
                elements: VectorBase._parseRawVector(str),
                coefficient: undefined
            };
        }
    }
    static _parseRawVector(str) {
        const splitted = str.split(",");
        const result = new Array(splitted.length);
        for (let i = 0; i < splitted.length; i++) {
            result[i] = parseFloat(splitted[i]);
            if (isNaN(result[i])) {
                return undefined;
            }
        }
        return result;
    }
}
export default VectorBase;
