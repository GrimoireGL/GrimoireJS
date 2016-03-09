import VectorBase from "./VectorBase";
import { vec4 } from "gl-matrix";
class Vector4 extends VectorBase {
    constructor(x, y, z, w) {
        super();
        if (typeof y === "undefined") {
            this.rawElements = x;
            return;
        }
        this.rawElements = [x, y, z, w];
    }
    get normalized() {
        return this.multiplyWith(1 / this.magnitude);
    }
    get X() {
        return this.rawElements[0];
    }
    get Y() {
        return this.rawElements[1];
    }
    get Z() {
        return this.rawElements[2];
    }
    get W() {
        return this.rawElements[3];
    }
    set X(x) {
        this.rawElements[0] = +x;
    }
    set Y(y) {
        this.rawElements[1] = +y;
    }
    set Z(z) {
        this.rawElements[2] = +z;
    }
    set W(w) {
        this.rawElements[3] = +w;
    }
    static get XUnit() {
        return new Vector4(1, 0, 0, 0);
    }
    static get YUnit() {
        return new Vector4(0, 1, 0, 0);
    }
    static get ZUnit() {
        return new Vector4(0, 0, 1, 0);
    }
    static get WUnit() {
        return new Vector4(0, 0, 0, 1);
    }
    static get One() {
        return new Vector4(1, 1, 1, 1);
    }
    static get Zero() {
        return new Vector4(0, 0, 0, 0);
    }
    static copy(vec) {
        return new Vector4(vec.X, vec.Y, vec.Z, vec.W);
    }
    static dot(v1, v2) {
        return vec4.dot(v1.rawElements, v2.rawElements);
    }
    static add(v1, v2) {
        const newVec = vec4.create();
        return new Vector4(vec4.add(newVec, v1.rawElements, v2.rawElements));
    }
    static subtract(v1, v2) {
        const newVec = vec4.create();
        return new Vector4(vec4.sub(newVec, v1.rawElements, v2.rawElements));
    }
    static multiply(s, v) {
        const newVec = vec4.create();
        return new Vector4(vec4.scale(newVec, v.rawElements, s));
    }
    static negate(v1) {
        return Vector4.multiply(-1, v1);
    }
    static equals(v1, v2) {
        return VectorBase.__elementEquals(v1, v2);
    }
    static nearlyEquals(v1, v2) {
        return VectorBase.__nearlyElementEquals(v1, v2);
    }
    static normalize(v1) {
        const newVec = vec4.create();
        return new Vector4(vec4.normalize(newVec, v1.rawElements));
    }
    static min(v1, v2) {
        return new Vector4(VectorBase.__fromGenerationFunction(v1, v2, (i, _v1, _v2) => Math.min(_v1.rawElements[i], _v2.rawElements[i])));
    }
    static max(v1, v2) {
        return new Vector4(VectorBase.__fromGenerationFunction(v1, v2, (i, _v1, _v2) => Math.max(_v1.rawElements[i], _v2.rawElements[i])));
    }
    static angle(v1, v2) {
        return Math.acos(Vector4.dot(v1.normalized, v2.normalized));
    }
    static parse(str) {
        const parseResult = VectorBase.__parse(str);
        const elements = parseResult.elements;
        if (!elements || (elements.length !== 1 && elements.length !== 4)) {
            return undefined;
        }
        let result;
        if (elements.length === 1) {
            result = new Vector4(elements[0], elements[0], elements[0], elements[0]);
        }
        else {
            result = new Vector4(elements[0], elements[1], elements[2], elements[3]);
        }
        if (parseResult.needNormalize) {
            result = result.normalizeThis();
        }
        if (parseResult.coefficient) {
            result = result.multiplyWith(parseResult.coefficient);
        }
        if (parseResult.needNegate) {
            result = result.negateThis();
        }
        return result;
    }
    normalizeThis() {
        return Vector4.normalize(this);
    }
    dotWith(v) {
        return Vector4.dot(this, v);
    }
    addWith(v) {
        return Vector4.add(this, v);
    }
    subtractWith(v) {
        return Vector4.subtract(this, v);
    }
    multiplyWith(s) {
        return Vector4.multiply(s, this);
    }
    negateThis() {
        return Vector4.negate(this);
    }
    equalWith(v) {
        return Vector4.equals(this, v);
    }
    nearlyEqualWith(v) {
        return Vector4.nearlyEquals(this, v);
    }
    get ElementCount() { return 4; }
    toString() {
        return `(${this.X}, ${this.Y}, ${this.Z}, ${this.W})`;
    }
    toDisplayString() {
        return `Vector4${this.toString()}`;
    }
    toMathematicaString() {
        return `{${this.X},${this.Y},${this.Z},${this.W}}`;
    }
}
export default Vector4;
