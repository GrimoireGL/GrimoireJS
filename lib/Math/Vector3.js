import VectorBase from "./VectorBase";
import { vec3 } from "gl-matrix";
class Vector3 extends VectorBase {
    constructor(x, y, z) {
        super();
        if (typeof y === "undefined") {
            this.rawElements = x;
            return;
        }
        this.rawElements = [x, y, z];
    }
    static get XUnit() {
        return new Vector3(1, 0, 0);
    }
    static get YUnit() {
        return new Vector3(0, 1, 0);
    }
    static get ZUnit() {
        return new Vector3(0, 0, 1);
    }
    static get Zero() {
        return new Vector3(0, 0, 0);
    }
    static get One() {
        return new Vector3(1, 1, 1);
    }
    static copy(source) {
        return new Vector3(source.X, source.Y, source.Z);
    }
    static dot(v1, v2) {
        return vec3.dot(v1.rawElements, v2.rawElements);
    }
    static add(v1, v2) {
        const newVec = vec3.create();
        return new Vector3(vec3.add(newVec, v1.rawElements, v2.rawElements));
    }
    static subtract(v1, v2) {
        const newVec = vec3.create();
        return new Vector3(vec3.sub(newVec, v1.rawElements, v2.rawElements));
    }
    static multiply(s, v) {
        const newVec = vec3.create();
        return new Vector3(vec3.scale(newVec, v.rawElements, s));
    }
    static negate(v1) {
        return Vector3.multiply(-1, v1);
    }
    static equals(v1, v2) {
        return VectorBase.__elementEquals(v1, v2);
    }
    static nearlyEquals(v1, v2) {
        return VectorBase.__nearlyElementEquals(v1, v2);
    }
    static normalize(v1) {
        const newVec = vec3.create();
        return new Vector3(vec3.normalize(newVec, v1.rawElements));
    }
    static cross(v1, v2) {
        const newVec = vec3.create();
        return new Vector3(vec3.cross(newVec, v1.rawElements, v2.rawElements));
    }
    static min(v1, v2) {
        return new Vector3(VectorBase.__fromGenerationFunction(v1, v2, (i, _v1, _v2) => Math.min(_v1.rawElements[i], _v2.rawElements[i])));
    }
    static max(v1, v2) {
        return new Vector3(VectorBase.__fromGenerationFunction(v1, v2, (i, _v1, _v2) => Math.max(_v1.rawElements[i], _v2.rawElements[i])));
    }
    static angle(v1, v2) {
        return Math.acos(Vector3.dot(v1.normalized, v2.normalized));
    }
    static parse(str) {
        const parseResult = VectorBase.__parse(str);
        const elements = parseResult.elements;
        if (!elements || (elements.length !== 1 && elements.length !== 3)) {
            return undefined;
        }
        let result;
        if (elements.length === 1) {
            result = new Vector3(elements[0], elements[0], elements[0]);
        }
        else {
            result = new Vector3(elements[0], elements[1], elements[2]);
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
    toMathematicaString() {
        return `{${this.X},${this.Y},${this.Z}}`;
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
    set X(x) {
        this.rawElements[0] = +x;
    }
    set Y(y) {
        this.rawElements[1] = +y;
    }
    set Z(z) {
        this.rawElements[2] = +z;
    }
    normalizeThis() {
        return Vector3.normalize(this);
    }
    dotWith(v) {
        return Vector3.dot(this, v);
    }
    addWith(v) {
        return Vector3.add(this, v);
    }
    subtractWith(v) {
        return Vector3.subtract(this, v);
    }
    multiplyWith(s) {
        return Vector3.multiply(s, this);
    }
    negateThis() {
        return Vector3.negate(this);
    }
    equalWith(v) {
        return Vector3.equals(this, v);
    }
    nearlyEqualWith(v) {
        return Vector3.nearlyEquals(this, v);
    }
    crossWith(v) {
        return Vector3.cross(this, v);
    }
    toString() {
        return `(${this.X}, ${this.Y}, ${this.Z})`;
    }
    toDisplayString() {
        return `Vector3${this.toString()}`;
    }
    get ElementCount() { return 3; }
}
export default Vector3;
