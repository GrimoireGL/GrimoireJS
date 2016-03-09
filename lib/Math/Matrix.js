import MatrixBase from "./MatrixBase";
import Vector3 from "./Vector3";
import Vector4 from "./Vector4";
import { mat4, vec3, vec4, quat } from "gl-matrix";
class Matrix extends MatrixBase {
    constructor(arr) {
        super();
        if (arr) {
            this.rawElements = arr;
        }
        else {
            this.rawElements = mat4.create();
        }
    }
    static zero() {
        return new Matrix([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    }
    static identity() {
        return new Matrix(mat4.create());
    }
    static fromElements(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
        return new Matrix([m00, m10, m20, m30, m01, m11, m21, m31, m02, m12, m22, m32, m03, m13, m23, m33]);
    }
    static fromFunc(f) {
        return new Matrix([f(0, 0), f(1, 0), f(2, 0), f(3, 0), f(0, 1), f(1, 1), f(2, 1), f(3, 1), f(0, 2), f(1, 2), f(2, 2), f(3, 2), f(0, 3), f(1, 3), f(2, 3), f(3, 3)]);
    }
    static equals(m1, m2) {
        return Matrix.__elementEquals(m1, m2);
    }
    static add(m1, m2) {
        const mat = mat4.create();
        for (let i = 0; i < 16; i++) {
            mat[i] = m1.rawElements[i] + m2.rawElements[i];
        }
        return new Matrix(mat);
    }
    static subtract(m1, m2) {
        return Matrix.add(m1, Matrix.negate(m2));
    }
    static scalarMultiply(s, m) {
        const newMat = mat4.create();
        mat4.multiply(newMat, [s, 0, 0, 0, 0, s, 0, 0, 0, 0, s, 0, 0, 0, 0, s], m.rawElements);
        return new Matrix(newMat);
    }
    static multiply(m1, m2) {
        const newMat = mat4.create();
        return new Matrix(mat4.mul(newMat, m1.rawElements, m2.rawElements));
    }
    static trs(t, rot, s) {
        const newMat = mat4.create();
        const cacheMat = mat4.create();
        mat4.mul(newMat, mat4.translate(newMat, mat4.create(), t.rawElements), mat4.fromQuat(cacheMat, rot.rawElements));
        mat4.scale(newMat, newMat, s.rawElements);
        return new Matrix(newMat);
    }
    static negate(m) {
        return this.scalarMultiply(-1, m);
    }
    static transpose(m) {
        const newMat = mat4.create();
        return new Matrix(mat4.transpose(newMat, m.rawElements));
    }
    static transformPoint(m, t) {
        const newVec = vec3.create();
        vec3.transformMat4(newVec, t.rawElements, m.rawElements);
        return new Vector3(newVec);
    }
    static transformNormal(m, t) {
        const newVec = vec4.create();
        const trans = vec4.create();
        trans[0] = t.X;
        trans[1] = t.Y;
        trans[2] = t.Z;
        trans[3] = 0;
        vec4.transformMat4(newVec, trans, m.rawElements);
        return new Vector3(newVec[0], newVec[1], newVec[2]);
    }
    static transform(m, t) {
        const newVec = vec4.create();
        const trans = vec4.create();
        trans[0] = t.X;
        trans[1] = t.Y;
        trans[2] = t.Z;
        trans[3] = t.W;
        vec4.transformMat4(newVec, trans, m.rawElements);
        return new Vector4(newVec[0], newVec[1], newVec[2], newVec[3]);
    }
    /**
     * Retrieve determinant of passed matrix
     */
    static determinant(m) {
        return mat4.determinant(m.rawElements);
    }
    /**
     * Compute inverted passed matrix.
     */
    static inverse(m) {
        const newMat = mat4.create();
        return new Matrix(mat4.invert(newMat, m.rawElements));
    }
    /**
     * Generate linear translation transform matrix.
     */
    static translate(v) {
        const newMat = mat4.create();
        mat4.translate(newMat, newMat, v.rawElements);
        return new Matrix(newMat);
    }
    /**
     * Generate linear scaling transform matrix.
     */
    static scale(v) {
        const newMat = mat4.create();
        mat4.scale(newMat, newMat, v.rawElements);
        return new Matrix(newMat);
    }
    static rotateX(angle) {
        const newMat = mat4.create();
        mat4.rotateX(newMat, newMat, angle);
        return new Matrix(newMat);
    }
    static rotateY(angle) {
        const newMat = mat4.create();
        mat4.rotateY(newMat, newMat, angle);
        return new Matrix(newMat);
    }
    static rotateZ(angle) {
        const newMat = mat4.create();
        mat4.rotateZ(newMat, newMat, angle);
        return new Matrix(newMat);
    }
    static rotationQuaternion(quat_) {
        const quaternion = quat.create();
        const newMat = mat4.create();
        quat.normalize(quaternion, quat_.rawElements);
        mat4.fromQuat(newMat, quaternion);
        return new Matrix(newMat);
    }
    static frustum(left, right, bottom, top, near, far) {
        const newMat = mat4.create();
        mat4.frustum(newMat, left, right, bottom, top, near, far);
        return new Matrix(newMat);
    }
    static ortho(left, right, bottom, top, near, far) {
        const newMat = mat4.create();
        mat4.ortho(newMat, left, right, bottom, top, near, far);
        return new Matrix(newMat);
    }
    static perspective(fovy, aspect, near, far) {
        const newMat = mat4.create();
        mat4.perspective(newMat, fovy, aspect, near, far);
        return new Matrix(newMat);
    }
    static lookAt(eye, lookAt, up) {
        const newMat = mat4.create();
        mat4.lookAt(newMat, eye.rawElements, lookAt.rawElements, up.rawElements);
        return new Matrix(newMat);
    }
    getAt(row, colmun) {
        return this.rawElements[colmun * 4 + row];
    }
    setAt(row, colmun, val) {
        this.rawElements[colmun * 4 + row] = val;
    }
    getBySingleIndex(index) {
        return this.rawElements[index];
    }
    getColmun(col) {
        return new Vector4(this.rawElements[col * 4], this.rawElements[col * 4 + 1], this.rawElements[col * 4 + 2], this.rawElements[col * 4 + 3]);
    }
    /**
    * Get row
    * @params row [0-3]
    */
    getRow(row) {
        return new Vector4(this.rawElements[row], this.rawElements[row + 4], this.rawElements[row + 8], this.rawElements[row + 12]);
    }
    multiplyWith(m) {
        return Matrix.multiply(this, m);
    }
    toString() {
        return (`|${this.getBySingleIndex(0)} ${this.getBySingleIndex(4)} ${this.getBySingleIndex(8)} ${this.getBySingleIndex(12)}|\n
                 |${this.getBySingleIndex(1)} ${this.getBySingleIndex(5)} ${this.getBySingleIndex(9)} ${this.getBySingleIndex(13)}|\n
                 |${this.getBySingleIndex(2)} ${this.getBySingleIndex(6)} ${this.getBySingleIndex(10)} ${this.getBySingleIndex(14)}|\n
                 |${this.getBySingleIndex(3)} ${this.getBySingleIndex(7)} ${this.getBySingleIndex(11)} ${this.getBySingleIndex(15)}|`);
    }
    toMathematicaString() {
        return (`{{${this.getBySingleIndex(0)},${this.getBySingleIndex(4)},${this.getBySingleIndex(8)},${this.getBySingleIndex(12)}},
                  {${this.getBySingleIndex(1)},${this.getBySingleIndex(5)},${this.getBySingleIndex(9)},${this.getBySingleIndex(13)}},
                  {${this.getBySingleIndex(2)},${this.getBySingleIndex(6)},${this.getBySingleIndex(10)},${this.getBySingleIndex(14)}},
                  {${this.getBySingleIndex(3)},${this.getBySingleIndex(7)},${this.getBySingleIndex(11)},${this.getBySingleIndex(15)}}}`);
    }
    get ElementCount() { return 16; }
    get RowCount() { return 4; }
    get ColmunCount() { return 4; }
}
export default Matrix;
