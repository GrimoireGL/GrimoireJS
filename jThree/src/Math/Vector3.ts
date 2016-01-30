import VectorBase from "./VectorBase";
import {GLM, vec3} from "gl-matrix";

class Vector3 extends VectorBase {

  constructor(x: number, y: number, z: number);
  constructor(x: GLM.IArray);
  constructor(x: number | GLM.IArray, y?: number, z?: number) {
    super();
    if (typeof y === "undefined") {
      this.rawElements = <GLM.IArray>x;
      return;
    }
    this.rawElements = [<number>x, y, z];
  }

  public static get XUnit(): Vector3 {
    return new Vector3(1, 0, 0);
  }

  public static get YUnit(): Vector3 {
    return new Vector3(0, 1, 0);
  }

  public static get ZUnit(): Vector3 {
    return new Vector3(0, 0, 1);
  }

  public static get Zero(): Vector3 {
    return new Vector3(0, 0, 0);
  }

  public static get One(): Vector3 {
    return new Vector3(1, 1, 1);
  }

  public static copy(source: Vector3) {
    return new Vector3(source.X, source.Y, source.Z);
  }

  public static dot(v1: Vector3, v2: Vector3): number {
    return vec3.dot(v1.rawElements, v2.rawElements);
  }

  public static add(v1: Vector3, v2: Vector3): Vector3 {
    const newVec = vec3.create();
    return new Vector3(vec3.add(newVec, v1.rawElements, v2.rawElements));
  }

  public static subtract(v1: Vector3, v2: Vector3): Vector3 {
    const newVec = vec3.create();
    return new Vector3(vec3.sub(newVec, v1.rawElements, v2.rawElements));
  }

  public static multiply(s: number, v: Vector3): Vector3 {
    const newVec = vec3.create();
    return new Vector3(vec3.scale(newVec, v.rawElements, s));
  }

  public static negate(v1: Vector3): Vector3 {
    return Vector3.multiply(-1, v1);
  }

  public static equal(v1: Vector3, v2: Vector3): boolean {
    return VectorBase.elementEqual(v1, v2);
  }

  public static normalize(v1: Vector3): Vector3 {
    const newVec = vec3.create();
    return new Vector3(vec3.normalize(newVec, v1.rawElements));
  }

  public static cross(v1: Vector3, v2: Vector3): Vector3 {
    const newVec = vec3.create();
    return new Vector3(vec3.cross(newVec, v1.rawElements, v2.rawElements));
  }


  public static min(v1: Vector3, v2: Vector3): Vector3 {
    return new Vector3(VectorBase.fromGenerationFunction(v1, v2, (i, _v1, _v2) => Math.min(_v1.rawElements[i], _v2.rawElements[i])));
  }
  public static max(v1: Vector3, v2: Vector3): Vector3 {
    return new Vector3(VectorBase.fromGenerationFunction(v1, v2, (i, _v1, _v2) => Math.max(_v1.rawElements[i], _v2.rawElements[i])));
  }

  public static angle(v1: Vector3, v2: Vector3): number {
    return Math.acos(Vector3.dot(v1.normalized, v2.normalized));
  }

  public static parse(str: string): Vector3 {
    let resultVec: Vector3;
    // 1,0,2.0,3.0
    // -(1.0,2.0,3.0)
    // n(1.0,2.0,3.0) normalized
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
      resultVec = new Vector3(elemNum, elemNum, elemNum);
    } else if (strNums.length === 3) {
      resultVec = new Vector3(parseFloat(strNums[0]), parseFloat(strNums[1]), parseFloat(strNums[2]));
    } else {
      return undefined;
    }
    if (needNormalize) {
      resultVec.normalizeThis();
    }
    if (needNegate) {
      resultVec = resultVec.negateThis();
    }
    if (isNaN(resultVec.X) || isNaN(resultVec.Y) || isNaN(resultVec.Z)) {
      console.error("Element is NaN", resultVec);
    }
    return resultVec;
  }

  public toMathematicaString(): string {
    return `{${this.X},${this.Y},${this.Z}}`;
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

  public get Z(): number {
    return this.rawElements[2];
  }

  public set X(x: number) {
    this.rawElements[0] = +x;
  }

  public set Y(y: number) {
    this.rawElements[1] = +y;
  }

  public set Z(z: number) {
    this.rawElements[2] = +z;
  }

  public normalizeThis(): Vector3 {
    return Vector3.normalize(this);
  }

  public dotWith(v: Vector3): number {
    return Vector3.dot(this, v);
  }

  public addWith(v: Vector3): Vector3 {
    return Vector3.add(this, v);
  }

  public subtractWith(v: Vector3): Vector3 {
    return Vector3.subtract(this, v);
  }

  public multiplyWith(s: number): Vector3 {
    return Vector3.multiply(s, this);
  }

  public negateThis(): Vector3 {
    return Vector3.negate(this);
  }

  public equalWith(v: Vector3): boolean {
    return Vector3.equal(this, v);
  }

  public crossWith(v: Vector3): Vector3 {
    return Vector3.cross(this, v);
  }

  public toString(): string {
    return `(${this.X}, ${this.Y}, ${this.Z})`;
  }

  public toDisplayString(): string {
    return `Vector3${this.toString() }`;
  }

  public get ElementCount(): number { return 3; }

}

export default Vector3;
