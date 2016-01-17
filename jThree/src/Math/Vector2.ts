import VectorBase = require("./VectorBase");
import glm = require('gl-matrix');
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

  constructor(x: number, y: number);
  constructor(x: glm.GLM.IArray);
  constructor(x: number | glm.GLM.IArray, y?: number) {
    super();
    if (typeof y === 'undefined') {
      this.rawElements = <glm.GLM.IArray>x;
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
    return glm.vec2.dot(v1.rawElements, v2.rawElements);
  }

  public static add(v1: Vector2, v2: Vector2): Vector2 {
    var newVec = glm.vec2.create();
    return new Vector2(glm.vec2.add(newVec, v1.rawElements, v2.rawElements));
  }

  public static subtract(v1: Vector2, v2: Vector2): Vector2 {
    var newVec = glm.vec2.create();
    return new Vector2(glm.vec2.sub(newVec, v1.rawElements, v2.rawElements));
  }

  public static multiply(s: number, v: Vector2): Vector2 {
    var newVec = glm.vec2.create();
    return new Vector2(glm.vec2.scale(newVec, v.rawElements, s));
  }

  public static negate(v1: Vector2): Vector2 {
    return Vector2.multiply(-1, v1);
  }

  public static equal(v1: Vector2, v2: Vector2): boolean {
    return VectorBase.elementEqual(v1, v2);
  }

  public static normalize(v1: Vector2): Vector2 {
    var newVec = glm.vec2.create();
    return new Vector2(glm.vec2.normalize(newVec, v1.rawElements));
  }

  public static min(v1: Vector2, v2: Vector2): Vector2 {
    return new Vector2(VectorBase.fromGenerationFunction(v1, v2, (i, v1, v2) => Math.min(v1.rawElements[i], v2.rawElements[i])));
  }

  public static max(v1: Vector2, v2: Vector2): Vector2 {
    return new Vector2(VectorBase.fromGenerationFunction(v1, v2, (i, v1, v2) => Math.max(v1.rawElements[i], v2.rawElements[i])));
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
    return `Vector2${this.toString()}`;
  }

  public get ElementCount(): number { return 2; }

  public toMathematicaString() {
    return `{${this.X},${this.Y}}`;
  }
}

export =Vector2;
