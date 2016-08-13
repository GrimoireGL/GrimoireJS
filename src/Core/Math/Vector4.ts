import VectorBase from "./VectorBase";
import {GLM, vec4} from "gl-matrix";

class Vector4 extends VectorBase {

  public static get XUnit(): Vector4 {
    return new Vector4(1, 0, 0, 0);
  }

  public static get YUnit(): Vector4 {
    return new Vector4(0, 1, 0, 0);
  }

  public static get ZUnit(): Vector4 {
    return new Vector4(0, 0, 1, 0);
  }

  public static get WUnit(): Vector4 {
    return new Vector4(0, 0, 0, 1);
  }

  public static get One(): Vector4 {
    return new Vector4(1, 1, 1, 1);
  }

  public static get Zero(): Vector4 {
    return new Vector4(0, 0, 0, 0);
  }

  public static copy(vec: Vector4): Vector4 {
    return new Vector4(vec.X, vec.Y, vec.Z, vec.W);
  }

  public static dot(v1: Vector4, v2: Vector4): number {
    return vec4.dot(v1.rawElements, v2.rawElements);
  }

  public static add(v1: Vector4, v2: Vector4): Vector4 {
    const newVec = vec4.create();
    return new Vector4(vec4.add(newVec, v1.rawElements, v2.rawElements));
  }

  public static subtract(v1: Vector4, v2: Vector4): Vector4 {
    const newVec = vec4.create();
    return new Vector4(vec4.sub(newVec, v1.rawElements, v2.rawElements));
  }

  public static multiply(s: number, v: Vector4): Vector4 {
    const newVec = vec4.create();
    return new Vector4(vec4.scale(newVec, v.rawElements, s));
  }

  public static negate(v1: Vector4): Vector4 {
    return Vector4.multiply(-1, v1);
  }

  public static equals(v1: Vector4, v2: Vector4): boolean {
    return VectorBase.__elementEquals(v1, v2);
  }

  public static nearlyEquals(v1: Vector4, v2: Vector4): boolean {
    return VectorBase.__nearlyElementEquals(v1, v2);
  }

  public static normalize(v1: Vector4): Vector4 {
    const newVec = vec4.create();
    return new Vector4(vec4.normalize(newVec, v1.rawElements));
  }


  public static min(v1: Vector4, v2: Vector4): Vector4 {
    return new Vector4(VectorBase.__fromGenerationFunction(v1, v2, (i, _v1, _v2) => Math.min(_v1.rawElements[i], _v2.rawElements[i])));
  }

  public static max(v1: Vector4, v2: Vector4): Vector4 {
    return new Vector4(VectorBase.__fromGenerationFunction(v1, v2, (i, _v1, _v2) => Math.max(_v1.rawElements[i], _v2.rawElements[i])));
  }

  public static angle(v1: Vector4, v2: Vector4): number {
    return Math.acos(Vector4.dot(v1.normalized, v2.normalized));
  }

  public static parse(str: string): Vector4 {
    const parseResult = VectorBase.__parse(str);
    const elements = parseResult.elements;
    if (!elements || (elements.length !== 1 && elements.length !== 4)) {
      return undefined;
    }
    let result;
    if (elements.length === 1) {
      result = new Vector4(elements[0], elements[0], elements[0], elements[0]);
    } else {
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

  /*
   * Static properties
   */
  constructor(x: GLM.IArray);
  constructor(x: number, y: number, z: number, w: number);
  constructor(x: number | GLM.IArray, y?: number, z?: number, w?: number) {
    super();
    if (typeof y === "undefined") {
      this.rawElements = <GLM.IArray>x;
      return;
    }
    this.rawElements = [<number>x, y, z, w];
  }

  public get normalized() {
    return this.multiplyWith(1 / this.magnitude);
  }

  public get X() {
    return this.rawElements[0];
  }

  public get Y() {
    return this.rawElements[1];
  }

  public get Z() {
    return this.rawElements[2];
  }

  public get W() {
    return this.rawElements[3];
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

  public set W(w: number) {
    this.rawElements[3] = +w;
  }

  public normalizeThis(): Vector4 {
    return Vector4.normalize(this);
  }

  public dotWith(v: Vector4): number {
    return Vector4.dot(this, v);
  }

  public addWith(v: Vector4): Vector4 {
    return Vector4.add(this, v);
  }

  public subtractWith(v: Vector4): Vector4 {
    return Vector4.subtract(this, v);
  }

  public multiplyWith(s: number): Vector4 {
    return Vector4.multiply(s, this);
  }

  public negateThis(): Vector4 {
    return Vector4.negate(this);
  }

  public equalWith(v: Vector4): boolean {
    return Vector4.equals(this, v);
  }

  public nearlyEqualWith(v: Vector4): boolean {
    return Vector4.nearlyEquals(this, v);
  }

  public get ElementCount(): number { return 4; }

  public toString(): string {
    return `(${this.X}, ${this.Y}, ${this.Z}, ${this.W})`;
  }

  public toDisplayString(): string {
    return `Vector4${this.toString() }`;
  }

  public toMathematicaString(): string {
    return `{${this.X},${this.Y},${this.Z},${this.W}}`;
  }

}


export default Vector4;
