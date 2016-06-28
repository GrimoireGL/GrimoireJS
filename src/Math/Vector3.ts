import VectorBase from "./VectorBase";
import {GLM, vec3} from "gl-matrix";

class Vector3 extends VectorBase {

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

  public static copy(source: Vector3): Vector3 {
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

  public static equals(v1: Vector3, v2: Vector3): boolean {
    return VectorBase.__elementEquals(v1, v2);
  }

  public static nearlyEquals(v1: Vector3, v2: Vector3): boolean {
    return VectorBase.__nearlyElementEquals(v1, v2);
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
    return new Vector3(VectorBase.__fromGenerationFunction(v1, v2, (i, _v1, _v2) => Math.min(_v1.rawElements[i], _v2.rawElements[i])));
  }
  public static max(v1: Vector3, v2: Vector3): Vector3 {
    return new Vector3(VectorBase.__fromGenerationFunction(v1, v2, (i, _v1, _v2) => Math.max(_v1.rawElements[i], _v2.rawElements[i])));
  }

  public static angle(v1: Vector3, v2: Vector3): number {
    return Math.acos(Vector3.dot(v1.normalized, v2.normalized));
  }

  public static parse(str: string): Vector3 {
    const parseResult = VectorBase.__parse(str);
    const elements = parseResult.elements;

    if (!elements || (elements.length !== 1 && elements.length !== 3)) {
      return undefined;
    }
    let result;
    if (elements.length === 1) {
      result = new Vector3(elements[0], elements[0], elements[0]);
    } else {
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
    return Vector3.equals(this, v);
  }

  public nearlyEqualWith(v: Vector3): boolean {
    return Vector3.nearlyEquals(this, v);
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
