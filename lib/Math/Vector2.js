import VectorBase from "./VectorBase";
import { vec2 } from "gl-matrix";
class Vector2 extends VectorBase {
    constructor(x, y) {
        super();
        if (typeof y === "undefined") {
            this.rawElements = x;
            return;
        }
        this.rawElements = [x, y];
    }
    static get XUnit() {
        return new Vector2(1, 0);
    }
    static get YUnit() {
        return new Vector2(0, 1);
    }
    static get One() {
        return new Vector2(1, 1);
    }
    static get Zero() {
        return new Vector2(0, 0);
    }
    static copy(vec) {
        return new Vector2(vec.X, vec.Y);
    }
    static parse(str) {
        const parseResult = VectorBase.__parse(str);
        const elements = parseResult.elements;
        if (elements.length !== 1 && elements.length !== 2) {
            return undefined;
        }
        let result;
        if (elements.length === 1) {
            result = new Vector2(elements[0], elements[0]);
        }
        else {
            result = new Vector2(elements[0], elements[1]);
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
    get normalized() {
        return this.multiplyWith(1 / this.magnitude);
    }
    get X() {
        return this.rawElements[0];
    }
    get Y() {
        return this.rawElements[1];
    }
    set X(x) {
        this.rawElements[0] = +x;
    }
    set Y(y) {
        this.rawElements[1] = +y;
    }
    static dot(v1, v2) {
        return vec2.dot(v1.rawElements, v2.rawElements);
    }
    static add(v1, v2) {
        const newVec = vec2.create();
        return new Vector2(vec2.add(newVec, v1.rawElements, v2.rawElements));
    }
    static subtract(v1, v2) {
        const newVec = vec2.create();
        return new Vector2(vec2.sub(newVec, v1.rawElements, v2.rawElements));
    }
    static multiply(s, v) {
        const newVec = vec2.create();
        return new Vector2(vec2.scale(newVec, v.rawElements, s));
    }
    static negate(v1) {
        return Vector2.multiply(-1, v1);
    }
    static equals(v1, v2) {
        return VectorBase.__elementEquals(v1, v2);
    }
    static nearlyEquals(v1, v2) {
        return VectorBase.__nearlyElementEquals(v1, v2);
    }
    static normalize(v1) {
        const newVec = vec2.create();
        return new Vector2(vec2.normalize(newVec, v1.rawElements));
    }
    static min(v1, v2) {
        return new Vector2(VectorBase.__fromGenerationFunction(v1, v2, (i, v1_, v2_) => Math.min(v1_.rawElements[i], v2_.rawElements[i])));
    }
    static max(v1, v2) {
        return new Vector2(VectorBase.__fromGenerationFunction(v1, v2, (i, v1_, v2_) => Math.max(v1_.rawElements[i], v2_.rawElements[i])));
    }
    static angle(v1, v2) {
        return Math.acos(Vector2.dot(v1.normalized, v2.normalized));
    }
    dotWith(v) {
        return Vector2.dot(this, v);
    }
    addWith(v) {
        return Vector2.add(this, v);
    }
    subtractWith(v) {
        return Vector2.subtract(v, this);
    }
    multiplyWith(s) {
        return Vector2.multiply(s, this);
    }
    negateThis() {
        return Vector2.negate(this);
    }
    equalWith(v) {
        return Vector2.equals(this, v);
    }
    nearlyEqualWith(v) {
        return Vector2.nearlyEquals(this, v);
    }
    normalizeThis() {
        return Vector2.normalize(this);
    }
    toString() {
        return `(${this.X}, ${this.Y})`;
    }
    toDisplayString() {
        return `Vector2${this.toString()}`;
    }
    get ElementCount() { return 2; }
    toMathematicaString() {
        return `{${this.X}, ${this.Y}}`;
    }
}
export default Vector2;
