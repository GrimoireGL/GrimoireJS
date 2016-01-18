import VectorBase = require("./VectorBase");
import glm = require("gl-matrix");

class Vector4 extends VectorBase {
  /*
   * Static properties
   */

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

  constructor(x: glm.GLM.IArray);
  constructor(x: number, y: number, z: number, w: number);
  constructor(x: number | glm.GLM.IArray, y?: number, z?: number, w?: number) {
    super();
    if (typeof y === 'undefined') {
      this.rawElements = <glm.GLM.IArray>x;
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

  public static dot(v1: Vector4, v2: Vector4) {
    return glm.vec4.dot(v1.rawElements, v2.rawElements);
  }

  public static add(v1: Vector4, v2: Vector4): Vector4 {
    var newVec = glm.vec4.create();
    return new Vector4(glm.vec4.add(newVec, v1.rawElements, v2.rawElements));
  }

  public static subtract(v1: Vector4, v2: Vector4): Vector4 {
    var newVec = glm.vec4.create();
    return new Vector4(glm.vec4.sub(newVec, v1.rawElements, v2.rawElements));
  }

  public static multiply(s: number, v: Vector4): Vector4 {
    var newVec = glm.vec4.create();
    return new Vector4(glm.vec4.scale(newVec, v.rawElements, s));
  }

  public static negate(v1: Vector4): Vector4 {
    return Vector4.multiply(-1, v1);
  }

  public static equal(v1: Vector4, v2: Vector4): boolean {
    return VectorBase.elementEqual(v1, v2);
  }

  public static normalize(v1: Vector4): Vector4 {
    var newVec = glm.vec4.create();
    return new Vector4(glm.vec4.normalize(newVec, v1.rawElements));
  }


  public static min(v1: Vector4, v2: Vector4): Vector4 {
    return new Vector4(VectorBase.fromGenerationFunction(v1, v2, (i, v1, v2) => Math.min(v1.rawElements[i], v2.rawElements[i])));
  }

  public static max(v1: Vector4, v2: Vector4): Vector4 {
    return new Vector4(VectorBase.fromGenerationFunction(v1, v2, (i, v1, v2) => Math.max(v1.rawElements[i], v2.rawElements[i])));
  }

  public static angle(v1: Vector4, v2: Vector4): number {
    return Math.acos(Vector4.dot(v1.normalized, v2.normalized));
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
    return Vector4.subtract(v, this);
  }

  public multiplyWith(s: number): Vector4 {
    return Vector4.multiply(s, this);
  }

  public negateThis(): Vector4 {
    return Vector4.negate(this);
  }

  public equalWith(v: Vector4): boolean {
    return Vector4.equal(this, v);
  }

  public get ElementCount(): number { return 4; }

  public toString(): string {
    return `(${this.X}, ${this.Y}, ${this.Z}, ${this.W})`;
  }

  public toDisplayString(): string {
    return `Vector4${this.toString() }`;
  }

  public toMathematicaString() {
    return `{${this.X},${this.Y},${this.Z},${this.W}}`;
  }

  public static parse(str: string): Vector4 {
    var resultVec: Vector4;
    //1,0,2.0,3.0
    //-(1.0,2.0,3.0)
    //n(1.0,2.0,3.0) normalized
    //1.0
    //check attributes
    var negativeMatch = str.match(/^-(n?\(.+\))$/);
    var needNegate = false;
    if (negativeMatch) {
      needNegate = true;
      str = negativeMatch[1];
    }
    var normalizeMatch = str.match(/^-?n(\(.+\))$/);
    var needNormalize = false;
    if (normalizeMatch) {
      needNormalize = true;
      str = normalizeMatch[1];
    }
    //check body
    str = str.match(/^n?\(?([^\)]+)\)?$/)[1];
    var strNums = str.split(/,/g);
    if (strNums.length == 1) {
      var elemNum: number = parseFloat(strNums[0]);
      if (isNaN(elemNum)) return undefined;
      resultVec = new Vector4(elemNum, elemNum, elemNum, elemNum);
    } else if (strNums.length == 4) {
      resultVec = new Vector4(parseFloat(strNums[0]), parseFloat(strNums[1]), parseFloat(strNums[2]), parseFloat(strNums[3]));
    } else {
      return undefined;
    }
    if (needNormalize) resultVec = resultVec.normalizeThis();
    if (needNegate) resultVec = resultVec.negateThis();
    return resultVec;
  }

}


export = Vector4;
