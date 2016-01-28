import VectorBase from "./VectorBase";
import {GLM, vec2} from "gl-matrix";
class Vector2 extends VectorBase {

  public static get XUnit(): Vector2 {
    return new Vector2(1, 0);
  }

  public static get YUnit(): Vector2 {
    return new Vector2(0, 1);
  }

  public static get One(): Vector2 {
    return new Vector2(1, 1);
  }

  public static get Zero(): Vector2 {
    return new Vector2(0, 0);
  }

  public static copy(vec: Vector2) {
    return new Vector2(vec.X, vec.Y);
  }

  public static parse(str: string): Vector2 {
    let resultVec: Vector2;
    // 1,0,2.0
    // -(1.0,2.0)
    // n(1.0,2.0) normalized
    // 1.0
    // check attributes
    const negativeMatch = str.match(/^-(n?\(.+\))$/);
    let needNegate = false;
    if (negativeMatch) {
      needNegate = true;
      str = negativeMatch[1];
    }
    const normalizeMatch = str.match(/^-?n(\(.+\))$/);
    let needNormalize = false;
    if (normalizeMatch) {
      needNormalize = true;
      str = normalizeMatch[1];
    }
    // check body
    str = str.match(/^n?\(?([^\)]+)\)?$/)[1];
    const strNums = str.split(/,/g);
    if (strNums.length === 1) {
      let elemNum: number = parseFloat(strNums[0]);
      if (isNaN(elemNum)) { return undefined; }
      resultVec = new Vector2(elemNum, elemNum);
    } else if (strNums.length === 2) {
      resultVec = new Vector2(parseFloat(strNums[0]), parseFloat(strNums[1]));
    } else {
      return undefined;
    }
    if (needNormalize) {
      resultVec = resultVec.normalizeThis();
    }
    if (needNegate) {
      resultVec = resultVec.negateThis();
    }

    if (isNaN(resultVec.X) || isNaN(resultVec.Y)) {
      console.error("Element is NaN", resultVec);
    }
    return resultVec;
  }

  constructor(x: number, y: number);
  constructor(x: GLM.IArray);
  constructor(x: number | GLM.IArray, y?: number) {
    super();
    if (typeof y === "undefined") {
      this.rawElements = <GLM.IArray>x;
      return;
    }
    this.rawElements = [<number>x, y];
  }

  public get normalized() {
    return this.multiplyWith(1 / this.magnitude);
  }

  public get X(): number {
    return this.rawElements[0];
  }

  public get Y(): number {
    return this.rawElements[1];
  }

  public set X(x: number) {
    this.rawElements[0] = +x;
  }

  public set Y(y: number) {
    this.rawElements[1] = +y;
  }

  public static dot(v1: Vector2, v2: Vector2): number {
    return vec2.dot(v1.rawElements, v2.rawElements);
  }

  public static add(v1: Vector2, v2: Vector2): Vector2 {
    const newVec = vec2.create();
    return new Vector2(vec2.add(newVec, v1.rawElements, v2.rawElements));
  }

  public static subtract(v1: Vector2, v2: Vector2): Vector2 {
    const newVec = vec2.create();
    return new Vector2(vec2.sub(newVec, v1.rawElements, v2.rawElements));
  }

  public static multiply(s: number, v: Vector2): Vector2 {
    const newVec = vec2.create();
    return new Vector2(vec2.scale(newVec, v.rawElements, s));
  }

  public static negate(v1: Vector2): Vector2 {
    return Vector2.multiply(-1, v1);
  }

  public static equal(v1: Vector2, v2: Vector2): boolean {
    return VectorBase.elementEqual(v1, v2);
  }

  public static normalize(v1: Vector2): Vector2 {
    const newVec = vec2.create();
    return new Vector2(vec2.normalize(newVec, v1.rawElements));
  }

  public static min(v1: Vector2, v2: Vector2): Vector2 {
    return new Vector2(VectorBase.fromGenerationFunction(v1, v2, (i, v1_, v2_) => Math.min(v1_.rawElements[i], v2_.rawElements[i])));
  }

  public static max(v1: Vector2, v2: Vector2): Vector2 {
    return new Vector2(VectorBase.fromGenerationFunction(v1, v2, (i, v1_, v2_) => Math.max(v1_.rawElements[i], v2_.rawElements[i])));
  }

  public static angle(v1: Vector2, v2: Vector2): number {
    return Math.acos(Vector2.dot(v1.normalized, v2.normalized));
  }

  public dotWith(v: Vector2): number {
    return Vector2.dot(this, v);
  }

  public addWith(v: Vector2): Vector2 {
    return Vector2.add(this, v);
  }

  public subtractWith(v: Vector2): Vector2 {
    return Vector2.subtract(v, this);
  }

  public multiplyWith(s: number): Vector2 {
    return Vector2.multiply(s, this);
  }

  public negateThis(): Vector2 {
    return Vector2.negate(this);
  }

  public equalWith(v: Vector2): boolean {
    return Vector2.equal(this, v);
  }

  public normalizeThis(): Vector2 {
    return Vector2.normalize(this);
  }

  public toString(): string {
    return `(${this.X}}, ${this.Y})`;
  }

  public toDisplayString(): string {
    return `Vector2${this.toString() }`;
  }

  public get ElementCount(): number { return 2; }

  public toMathematicaString() {
    return `{${this.X},${this.Y}}`;
  }
}

export default Vector2;
