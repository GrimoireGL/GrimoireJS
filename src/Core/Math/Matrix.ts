
import MatrixBase from "./MatrixBase";
import Vector3 from "./Vector3";
import Vector4 from "./Vector4";
import Quaternion from "./Quaternion";
import {GLM, mat4, vec3, vec4, quat} from "gl-matrix";
class Matrix extends MatrixBase {

  public static zero(): Matrix {
    return new Matrix([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  }

  public static identity(): Matrix {
    return new Matrix(mat4.create());
  }

  public static fromElements(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33): Matrix {
    return new Matrix([m00, m10, m20, m30, m01, m11, m21, m31, m02, m12, m22, m32, m03, m13, m23, m33]);
  }

  public static fromFunc(f: (w: number, h: number) => number): Matrix {
    return new Matrix([f(0, 0), f(1, 0), f(2, 0), f(3, 0), f(0, 1), f(1, 1), f(2, 1), f(3, 1), f(0, 2), f(1, 2), f(2, 2), f(3, 2), f(0, 3), f(1, 3), f(2, 3), f(3, 3)]);
  }

  public static equals(m1: Matrix, m2: Matrix): boolean {
    return Matrix.__elementEquals(m1, m2);
  }

  public static add(m1: Matrix, m2: Matrix): Matrix {
    const mat = mat4.create();
    for (let i = 0; i < 16; i++) {
      mat[i] = m1.rawElements[i] + m2.rawElements[i];
    }
    return new Matrix(mat);
  }

  public static subtract(m1: Matrix, m2: Matrix): Matrix {
    return Matrix.add(m1, Matrix.negate(m2));
  }

  public static scalarMultiply(s: number, m: Matrix): Matrix {
    const newMat = mat4.create();
    mat4.multiply(newMat, [s, 0, 0, 0, 0, s, 0, 0, 0, 0, s, 0, 0, 0, 0, s], m.rawElements);
    return new Matrix(newMat);
  }

  public static multiply(m1: Matrix, m2: Matrix): Matrix {
    const newMat = mat4.create();
    return new Matrix(mat4.mul(newMat, m1.rawElements, m2.rawElements));
  }

  public static trs(t: Vector3, rot: Quaternion, s: Vector3): Matrix {
    const newMat = mat4.create(); const cacheMat = mat4.create();
    mat4.mul(newMat, mat4.translate(newMat, mat4.create(), t.rawElements), mat4.fromQuat(cacheMat, rot.rawElements));
    mat4.scale(newMat, newMat, s.rawElements);
    return new Matrix(newMat);
  }

  public static negate(m: Matrix): Matrix {
    return this.scalarMultiply(-1, m);
  }

  public static transpose(m: Matrix): Matrix {
    const newMat = mat4.create();
    return new Matrix(mat4.transpose(newMat, m.rawElements));
  }

  public static transformPoint(m: Matrix, t: Vector3): Vector3 {
    const newVec = vec3.create();
    vec3.transformMat4(newVec, t.rawElements, m.rawElements);
    return new Vector3(newVec);
  }

  public static transformNormal(m: Matrix, t: Vector3): Vector3 {
    const newVec = vec4.create();
    const trans = vec4.create();
    trans[0] = t.X; trans[1] = t.Y; trans[2] = t.Z; trans[3] = 0;
    vec4.transformMat4(newVec, trans, m.rawElements);
    return new Vector3(newVec[0], newVec[1], newVec[2]);
  }

  public static transform(m: Matrix, t: Vector4): Vector4 {
    const newVec = vec4.create();
    const trans = vec4.create();
    trans[0] = t.X; trans[1] = t.Y; trans[2] = t.Z; trans[3] = t.W;
    vec4.transformMat4(newVec, trans, m.rawElements);
    return new Vector4(newVec[0], newVec[1], newVec[2], newVec[3]);
  }

  /**
   * Retrieve determinant of passed matrix
   */
  public static determinant(m: Matrix): number {
    return mat4.determinant(m.rawElements);
  }

  /**
   * Compute inverted passed matrix.
   */
  public static inverse(m: Matrix): Matrix {
    const newMat = mat4.create();
    return new Matrix(mat4.invert(newMat, m.rawElements));
  }

  /**
   * Generate linear translation transform matrix.
   */
  public static translate(v: Vector3): Matrix {
    const newMat = mat4.create();
    mat4.translate(newMat, newMat, v.rawElements);
    return new Matrix(newMat);
  }

  /**
   * Generate linear scaling transform matrix.
   */
  public static scale(v: Vector3): Matrix {
    const newMat = mat4.create();
    mat4.scale(newMat, newMat, v.rawElements);
    return new Matrix(newMat);
  }

  public static rotateX(angle: number): Matrix {
    const newMat = mat4.create();
    mat4.rotateX(newMat, newMat, angle);
    return new Matrix(newMat);
  }

  public static rotateY(angle: number): Matrix {
    const newMat = mat4.create();
    mat4.rotateY(newMat, newMat, angle);
    return new Matrix(newMat);
  }

  public static rotateZ(angle: number): Matrix {
    const newMat = mat4.create();
    mat4.rotateZ(newMat, newMat, angle);
    return new Matrix(newMat);
  }

  public static rotationQuaternion(quat_: Quaternion): Matrix {
    const quaternion = quat.create();
    const newMat = mat4.create();
    quat.normalize(quaternion, quat_.rawElements);
    mat4.fromQuat(newMat, quaternion);
    return new Matrix(newMat);
  }

  public static frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix {
    const newMat = mat4.create();
    mat4.frustum(newMat, left, right, bottom, top, near, far);
    return new Matrix(newMat);
  }

  public static ortho(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix {
    const newMat = mat4.create();
    mat4.ortho(newMat, left, right, bottom, top, near, far);
    return new Matrix(newMat);
  }

  public static perspective(fovy: number, aspect: number, near: number, far: number): Matrix {
    const newMat = mat4.create();
    mat4.perspective(newMat, fovy, aspect, near, far);
    return new Matrix(newMat);
  }

  public static lookAt(eye: Vector3, lookAt: Vector3, up: Vector3): Matrix {
    const newMat = mat4.create();
    mat4.lookAt(newMat, eye.rawElements, lookAt.rawElements, up.rawElements);
    return new Matrix(newMat);
  }

  constructor(arr?: GLM.IArray) {
    super();
    if (arr) {
      this.rawElements = arr;
    } else {
      this.rawElements = mat4.create();
    }
  }

  public getAt(row: number, colmun: number): number {
    return this.rawElements[colmun * 4 + row];
  }

  public setAt(row: number, colmun: number, val: number): void {
    this.rawElements[colmun * 4 + row] = val;
  }

  public getBySingleIndex(index: number): number {
    return this.rawElements[index];
  }

  public getColmun(col: number): Vector4 {
    return new Vector4(this.rawElements[col * 4], this.rawElements[col * 4 + 1], this.rawElements[col * 4 + 2], this.rawElements[col * 4 + 3]);
  }

  /**
  * Get row
  * @params row [0-3]
  */
  public getRow(row: number): Vector4 {
    return new Vector4(this.rawElements[row], this.rawElements[row + 4], this.rawElements[row + 8], this.rawElements[row + 12]);
  }

  public multiplyWith(m: Matrix): Matrix {
    return Matrix.multiply(this, m);
  }

  public equalWith(m: Matrix): boolean {
    return Matrix.equals(m, this);
  }

  public toString(): string {
    return (`|${this.getBySingleIndex(0) } ${this.getBySingleIndex(4) } ${this.getBySingleIndex(8) } ${this.getBySingleIndex(12) }|\n
                 |${this.getBySingleIndex(1) } ${this.getBySingleIndex(5) } ${this.getBySingleIndex(9) } ${this.getBySingleIndex(13) }|\n
                 |${this.getBySingleIndex(2) } ${this.getBySingleIndex(6) } ${this.getBySingleIndex(10) } ${this.getBySingleIndex(14) }|\n
                 |${this.getBySingleIndex(3) } ${this.getBySingleIndex(7) } ${this.getBySingleIndex(11) } ${this.getBySingleIndex(15) }|`);
  }

  public toMathematicaString(): string {
    return (`{{${this.getBySingleIndex(0) },${this.getBySingleIndex(4) },${this.getBySingleIndex(8) },${this.getBySingleIndex(12) }},
                  {${this.getBySingleIndex(1) },${this.getBySingleIndex(5) },${this.getBySingleIndex(9) },${this.getBySingleIndex(13) }},
                  {${this.getBySingleIndex(2) },${this.getBySingleIndex(6) },${this.getBySingleIndex(10) },${this.getBySingleIndex(14) }},
                  {${this.getBySingleIndex(3) },${this.getBySingleIndex(7) },${this.getBySingleIndex(11) },${this.getBySingleIndex(15) }}}`);
  }

  public get ElementCount(): number { return 16; }

  public get RowCount(): number { return 4; }

  public get ColmunCount(): number { return 4; }

}
export default Matrix;
