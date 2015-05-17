import MatrixBase = require("./MatrixBase");
import Vector2 = require("./Vector2");
import Vector3 = require("./Vector3");
import Vector4 = require("./Vector4");
import ILinearObjectGenerator = require("./ILinearObjectGenerator");
import Exceptions = require("../Exceptions");
import Collection = require("../Base/Collections/Collection");
import MatrixFactory = require("./MatrixFactory");
import IEnumrator = require("../Base/Collections/IEnumrator");
import MatrixEnumerator = require("./MatrixEnumerator");
import Delegates=require('../Delegates');
import Quaternion = require("./Quaternion");
class Matrix extends MatrixBase implements ILinearObjectGenerator<Matrix> {
    public static zero(): Matrix {
        return Matrix.fromElements(0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0);
    }

    public static identity(): Matrix {
        return Matrix.fromElements(1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1);
    }

    public static fromElements(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33): Matrix {
        return new Matrix(new Float32Array([m00, m10, m20, m30, m01, m11, m21, m31, m02, m12, m22, m32, m03, m13, m23, m33]));
    }

    public static fromFunc(f:Delegates.Func2<number,number,number>)
    {
               return new Matrix(new Float32Array([f(0, 0), f(1, 0), f(2, 0), f(3, 0), f(0, 1), f(1, 1), f(2, 1), f(3, 1), f(0, 2), f(1, 2), f(2, 2), f(3, 2), f(0, 3), f(1, 3), f(2, 3), f(3, 3)]));
    }

    get rawElements(): Float32Array {
        return this.elements;
    }

    private elements: Float32Array = new Float32Array(16);

    private isValidArray(arr: Float32Array): boolean {
        if (arr.length !== 16) return false;
        return true;
    }

    constructor(arr: Float32Array) {
        super();
        if (!this.isValidArray(arr)) throw new Exceptions.InvalidArgumentException("Invalid matrix source was passed.");
        this.elements = arr;
    }

    getAt(row: number, colmun: number): number {
        return this.elements[colmun * 4 + row];
    }

    private setAt(colmun: number, row: number, val: number) {
        this.elements.set[colmun * 4 + row] = val;
    }

    getBySingleIndex(index: number): number {
        return this.elements[index];
    }

    getColmun(col: number): Vector4 {
        return new Vector4(this.elements[col * 4], this.elements[col * 4 + 1], this.elements[col * 4 + 2], this.elements[col * 4 + 3]);
    }

/**
* Get row
* @params row [0-3]
*/
    getRow(row: number):Vector4 {
        return new Vector4(this.elements[row], this.elements[row + 4], this.elements[row + 8], this.elements[row + 12]);
    }

    isNaN(): boolean {
        var result: boolean = false;
        Collection.foreach<number>(this, (a) => {
            if (isNaN(a)) result = true;
        });
        return result;
    }

    static equal(m1: Matrix, m2: Matrix): boolean {
        return Matrix.elementEqual(m1, m2);
    }

    static add(m1: Matrix, m2: Matrix): Matrix {
        return this.elementAdd(m1, m2, m1.getFactory());
    }

    static subtract(m1: Matrix, m2: Matrix): Matrix {
        return this.elementSubtract(m1, m2, m1.getFactory());
    }

    static scalarMultiply(s: number, m: Matrix): Matrix {
        return this.elementScalarMultiply(m, s, m.getFactory());
    }

    static multiply(m1: Matrix, m2: Matrix): Matrix {
        return Matrix.fromFunc((i, j) => {
            var sum = 0;
            Collection.foreachPair(m1.getRow(i), m2.getColmun(j), (i, j, k) => {
                sum += i * j;
            });
            return sum;
        });
    }

    static negate(m: Matrix): Matrix {
        return this.elementNegate(m, m.getFactory());
    }

    static transpose(m: Matrix): Matrix {
        return Matrix.fromFunc((i,j)=>m.getAt(j,i));
    }

    static transformPoint(m: Matrix, v: Vector3): Vector3 {
        var vt=Matrix.transform(m,new Vector4(v.X,v.Y,v.Z,1));
        console.log(vt.toString());
        return (new Vector3(vt.X,vt.Y,vt.Z)).multiplyWith(1/vt.W);
    }

    static transformNormal(m: Matrix, v: Vector3): Vector3 {
        var result: Float32Array = new Float32Array(3);
        for (var i = 0; i < 3; i++) {
            result[i] = 0;
            Collection.foreachPair(m.getRow(i), v, (r, v, index) => {
                result[i] += r * v;
            });
        }
        return v.getFactory().fromArray(result);
    }

    static transform(m: Matrix, v: Vector4): Vector4 {
        var result: Float32Array = new Float32Array(4);
        for (var i = 0; i < 4; i++) {
            result[i] = 0;
            Collection.foreachPair(m.getRow(i), v, (r, v, index) => {
                result[i] += r * v;
            });
        }
        return v.getFactory().fromArray(result);
    }

    /**
     * Retrieve determinant of passed matrix
     */
    static determinant(m: Matrix): number {
        var m00 = m.getAt(0, 0), m01 = m.getAt(0, 1), m02 = m.getAt(0, 2), m03 = m.getAt(0, 3);
        var m10 = m.getAt(1, 0), m11 = m.getAt(1, 1), m12 = m.getAt(1, 2), m13 = m.getAt(1, 3);
        var m20 = m.getAt(2, 0), m21 = m.getAt(2, 1), m22 = m.getAt(2, 2), m23 = m.getAt(2, 3);
        var m30 = m.getAt(3, 0), m31 = m.getAt(3, 1), m32 = m.getAt(3, 2), m33 = m.getAt(3, 3);
        return m03 * m12 * m21 * m30 - m02 * m13 * m21 * m30 - m03 * m11 * m22 * m30 + m01 * m13 * m22 * m30 +
            m02 * m11 * m23 * m30 - m01 * m12 * m23 * m30 - m03 * m12 * m20 * m31 + m02 * m13 * m20 * m31 +
            m03 * m10 * m22 * m31 - m00 * m13 * m22 * m31 - m02 * m10 * m23 * m31 + m00 * m12 * m23 * m31 +
            m03 * m11 * m20 * m32 - m01 * m13 * m20 * m32 - m03 * m10 * m21 * m32 + m00 * m13 * m21 * m32 +
            m01 * m10 * m23 * m32 - m00 * m11 * m23 * m32 - m02 * m11 * m20 * m33 + m01 * m12 * m20 * m33 +
            m02 * m10 * m21 * m33 - m00 * m12 * m21 * m33 - m01 * m10 * m22 * m33 + m00 * m11 * m22 * m33;
    }

    /**
     * Compute inverted passed matrix.
     */
    static inverse(m: Matrix): Matrix {
        var det: number = Matrix.determinant(m);
        if (det == 0) throw new Exceptions.SingularMatrixException(m);
        var m00 = m.getAt(0, 0), m01 = m.getAt(0, 1), m02 = m.getAt(0, 2), m03 = m.getAt(0, 3);
        var m10 = m.getAt(1, 0), m11 = m.getAt(1, 1), m12 = m.getAt(1, 2), m13 = m.getAt(1, 3);
        var m20 = m.getAt(2, 0), m21 = m.getAt(2, 1), m22 = m.getAt(2, 2), m23 = m.getAt(2, 3);
        var m30 = m.getAt(3, 0), m31 = m.getAt(3, 1), m32 = m.getAt(3, 2), m33 = m.getAt(3, 3);
        m00 = m12 * m23 * m31 - m13 * m22 * m31 + m13 * m21 * m32 - m11 * m23 * m32 - m12 * m21 * m33 + m11 * m22 * m33;
        m01 = m03 * m22 * m31 - m02 * m23 * m31 - m03 * m21 * m32 + m01 * m23 * m32 + m02 * m21 * m33 - m01 * m22 * m33;
        m02 = m02 * m13 * m31 - m03 * m12 * m31 + m03 * m11 * m32 - m01 * m13 * m32 - m02 * m11 * m33 + m01 * m12 * m33;
        m03 = m03 * m12 * m21 - m02 * m13 * m21 - m03 * m11 * m22 + m01 * m13 * m22 + m02 * m11 * m23 - m01 * m12 * m23;
        m10 = m13 * m22 * m30 - m12 * m23 * m30 - m13 * m20 * m32 + m10 * m23 * m32 + m12 * m20 * m33 - m10 * m22 * m33;
        m11 = m02 * m23 * m30 - m03 * m22 * m30 + m03 * m20 * m32 - m00 * m23 * m32 - m02 * m20 * m33 + m00 * m22 * m33;
        m12 = m03 * m12 * m30 - m02 * m13 * m30 - m03 * m10 * m32 + m00 * m13 * m32 + m02 * m10 * m33 - m00 * m12 * m33;
        m13 = m02 * m13 * m20 - m03 * m12 * m20 + m03 * m10 * m22 - m00 * m13 * m22 - m02 * m10 * m23 + m00 * m12 * m23;
        m20 = m11 * m23 * m30 - m13 * m21 * m30 + m13 * m20 * m31 - m10 * m23 * m31 - m11 * m20 * m33 + m10 * m21 * m33;
        m21 = m03 * m21 * m30 - m01 * m23 * m30 - m03 * m20 * m31 + m00 * m23 * m31 + m01 * m20 * m33 - m00 * m21 * m33;
        m22 = m01 * m13 * m30 - m03 * m11 * m30 + m03 * m10 * m31 - m00 * m13 * m31 - m01 * m10 * m33 + m00 * m11 * m33;
        m23 = m03 * m11 * m20 - m01 * m13 * m20 - m03 * m10 * m21 + m00 * m13 * m21 + m01 * m10 * m23 - m00 * m11 * m23;
        m30 = m12 * m21 * m30 - m11 * m22 * m30 - m12 * m20 * m31 + m10 * m22 * m31 + m11 * m20 * m32 - m10 * m21 * m32;
        m31 = m01 * m22 * m30 - m02 * m21 * m30 + m02 * m20 * m31 - m00 * m22 * m31 - m01 * m20 * m32 + m00 * m21 * m32;
        m32 = m02 * m11 * m30 - m01 * m12 * m30 - m02 * m10 * m31 + m00 * m12 * m31 + m01 * m10 * m32 - m00 * m11 * m32;
        m33 = m01 * m12 * m20 - m02 * m11 * m20 + m02 * m10 * m21 - m00 * m12 * m21 - m01 * m10 * m22 + m00 * m11 * m22;
        m00 /= det;
        m01 /= det;
        m02 /= det;
        m03 /= det;
        m10 /= det;
        m11 /= det;
        m12 /= det;
        m13 /= det;
        m20 /= det;
        m21 /= det;
        m22 /= det;
        m23 /= det;
        m30 /= det;
        m31 /= det;
        m32 /= det;
        m33 /= det;
        return Matrix.fromElements(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33);
    }

    /**
     * Generate linear translation transform matrix.
     */
    static translate(v: Vector3): Matrix {
        var m: Matrix = Matrix.fromElements(
            1, 0, 0, v.X,
            0, 1, 0, v.Y,
            0, 0, 1, v.Z,
            0, 0, 0, 1
            );
        return m;
    }

    /**
     * Generate linear scaling transform matrix.
     */
    static scale(v: Vector3): Matrix {
        return Matrix.fromElements(
            v.X, 0, 0, 0,
            0, v.Y, 0, 0,
            0, 0, v.Z, 0,
            0, 0, 0, 1
            );
    }

    static rotateX(angle:number):Matrix{
      return Matrix.fromElements(
        1,0,0,0,
        0,Math.cos(angle),-Math.sin(angle),0,
        0,Math.sin(angle),Math.cos(angle),0,
        0,0,0,1
      );
    }

    static rotateY(angle:number):Matrix{
      return Matrix.fromElements(
        Math.cos(angle),0,Math.sin(angle),0,
        0,1,0,0,
        -Math.sin(angle),0,Math.cos(angle),0,
        0,0,0,1
      );
    }

    static rotateZ(angle:number):Matrix{
      return Matrix.fromElements(
        Math.cos(angle),-Math.sin(angle),0,0,
        Math.sin(angle),Math.cos(angle),0,0,
        0,0,1,0,
        0,0,0,1
      );
    }

    static RotationQuaternion(quat:Quaternion):Matrix
    {
      var q=quat.Normalize();
      var x=q.X,y=q.Y,z=q.Z,w=q.W;
      return Matrix.fromElements(
        1-2*y*y-2*z*z,2*x*y-2*w*z,2*x*z+2*w*y,0,
        2*x*y+2*w*z,1-2*x*x-2*z*z,2*y*z+2*w*x,0,
        2*x*z-2*w*y,2*y*z-2*w*x,1-2*x*x-2*y*y,0,
        0,0,0,1
      );
    }

    static frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix {
		var x = 2 * near / ( right - left );
		var y = 2 * near / ( top - bottom );

		var a = ( right + left ) / ( right - left );
		var b = ( top + bottom ) / ( top - bottom );
		var c = - ( far + near ) / ( far - near );
		var d = - 2 * far * near / ( far - near );

		return Matrix.fromElements(
            x,0,a,0,
            0,y,b,0,
            0,0,c,d,
            0,0,-1,0);
    }

    static ortho(left:number,right:number,bottom:number,top:number,near:number,far:number):Matrix
    {
        var tx=-(right+left)/(right-left);
        var ty=-(top+bottom)/(top-bottom);
        var tz=-(far+near)/(far-near);
        return Matrix.fromElements(
            2/(right-left),0,0,tx,
            0,2/(top-bottom),0,ty,
            0,0,-2/(far-near),tz,
            0,0,0,1
        );
    }

    static perspective(fovy: number, aspect: number, near: number, far: number): Matrix {
        var ymax = near * Math.tan(fovy*0.5);
		var ymin = - ymax;
		var xmin = ymin * aspect;
		var xmax = ymax * aspect;
      return Matrix.frustum(xmin, xmax, ymin, ymax, near, far);
    }

    static lookAt(eye: Vector3, lookAt: Vector3, up: Vector3): Matrix {
        var zAxis: Vector3 = Vector3.normalize(Vector3.subtract(eye,lookAt));
        var xAxis: Vector3 = Vector3.normalize(Vector3.cross(up,zAxis));
        var yAxis: Vector3 = Vector3.cross(zAxis,xAxis);
        return Matrix.fromElements(xAxis.X,xAxis.Y,xAxis.Z,-Vector3.dot(eye,xAxis),
                                    yAxis.X,yAxis.Y,yAxis.Z,-Vector3.dot(eye,yAxis),
                                    zAxis.X,zAxis.Y,zAxis.Z,-Vector3.dot(eye,zAxis),
                                  0,0,0,1);
    }

    multiplyWith(m: Matrix): Matrix {
        return Matrix.multiply(this, m);
    }



    toString(): string {
        return ("|{0} {4} {8} {12}|\n"+
                "|{1} {5} {9} {13}|\n"+
                "|{2} {6} {10} {14}|\n"+
                "|{3} {7} {11} {15}|").format(this.getBySingleIndex(0), this.getBySingleIndex(1), this.getBySingleIndex(2), this.getBySingleIndex(3), this.getBySingleIndex(4), this.getBySingleIndex(5), this.getBySingleIndex(6), this.getBySingleIndex(7), this.getBySingleIndex(8), this.getBySingleIndex(9), this.getBySingleIndex(10), this.getBySingleIndex(11), this.getBySingleIndex(12), this.getBySingleIndex(13), this.getBySingleIndex(14), this.getBySingleIndex(15));
    }

    getEnumrator(): IEnumrator<number> {
        return new MatrixEnumerator(this);
    }

    get ElementCount(): number { return 16; }

    private static factoryCache: MatrixFactory;


    getFactory(): MatrixFactory {
        Matrix.factoryCache = Matrix.factoryCache || new MatrixFactory();
        return Matrix.factoryCache;
    }

    get RowCount(): number { return 4; }

    get ColmunCount(): number { return 4; }
}
export=Matrix;
