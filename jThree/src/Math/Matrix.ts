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
import glm = require('glm');
class Matrix extends MatrixBase implements ILinearObjectGenerator<Matrix> {
    public static zero(): Matrix {
        return new Matrix([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
    }

    public static identity(): Matrix {
        return new Matrix(glm.mat4.create());
    }

    public static fromElements(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33): Matrix {
        return new Matrix([m00, m10, m20, m30, m01, m11, m21, m31, m02, m12, m22, m32, m03, m13, m23, m33]);
    }

    public static fromFunc(f:Delegates.Func2<number,number,number>)
    {
               return new Matrix([f(0, 0), f(1, 0), f(2, 0), f(3, 0), f(0, 1), f(1, 1), f(2, 1), f(3, 1), f(0, 2), f(1, 2), f(2, 2), f(3, 2), f(0, 3), f(1, 3), f(2, 3), f(3, 3)]);
    }
    
    private targetMatrix = glm.mat4.create();

    get rawElements(): Float32Array {
        return <Float32Array>this.targetMatrix;
    }

    private isValidArray(arr: Float32Array): boolean {
        if (arr.length !== 16) return false;
        return true;
    }

    constructor(arr:glm.GLM.IArray) {
        super();
       // if (!this.isValidArray(arr)) throw new Exceptions.InvalidArgumentException("Invalid matrix source was passed.");
        this.targetMatrix=arr;
    }

    getAt(row: number, colmun: number): number {
        return this.targetMatrix[colmun * 4 + row];
    }

    setAt(colmun: number, row: number, val: number) {
        this.targetMatrix[colmun * 4 + row] = val;
    }

    getBySingleIndex(index: number): number {
        return this.targetMatrix[index];
    }

    getColmun(col: number): Vector4 {
        return new Vector4(this.targetMatrix[col * 4], this.targetMatrix[col * 4 + 1], this.targetMatrix[col * 4 + 2], this.targetMatrix[col * 4 + 3]);
    }

/**
* Get row
* @params row [0-3]
*/
    getRow(row: number):Vector4 {
        return new Vector4(this.targetMatrix[row], this.targetMatrix[row + 4], this.targetMatrix[row + 8], this.targetMatrix[row + 12]);
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
        var newMat=glm.mat4.create();
        glm.mat4.multiply(newMat,[s,0,0,0,  0,s,0,0,  0,0,s,0 , 0,0,0,s],m.targetMatrix);
        return new Matrix(newMat);
    }

    static multiply(m1: Matrix, m2: Matrix): Matrix {
        var newMat=glm.mat4.create();
        return new Matrix(glm.mat4.mul(newMat,m1.targetMatrix,m2.targetMatrix));
    }

    static TRS(t:Vector3,rot:Quaternion,s:Vector3):Matrix
    {
       var newMat =glm.mat4.create();var cacheMat=glm.mat4.create();
       glm.mat4.mul(newMat,glm.mat4.translate(newMat,glm.mat4.create(),t.targetVector),glm.mat4.fromQuat(cacheMat,rot.targetQuat));
       glm.mat4.scale(newMat,newMat,s.targetVector);
      return new Matrix(newMat);
    }

    static negate(m: Matrix): Matrix {
        return this.scalarMultiply(-1,m);
    }

    static transpose(m: Matrix): Matrix {
        var newMat = glm.mat4.create();
        return new Matrix(glm.mat4.transpose(newMat,m.targetMatrix));
    }

    static transformPoint(m: Matrix, t: Vector3): Vector3 {
        var newVec=glm.vec4.create();
        var trans=glm.vec4.create();
       trans[0]=t.X;trans[1]=t.Y;trans[2]=t.Z;trans[3]=1.0;
        glm.vec4.transformMat4(newVec,trans,m.targetMatrix)
        glm.vec4.scale(newVec,newVec,newVec[3]);
        return new Vector3(newVec[0],newVec[1],newVec[2]);
    }

    static transformNormal(m: Matrix, t: Vector3): Vector3 {
        var newVec=glm.vec4.create();
        var trans=glm.vec4.create();
       trans[0]=t.X;trans[1]=t.Y;trans[2]=t.Z;trans[3]=0;
        glm.vec4.transformMat4(newVec,trans,m.targetMatrix)
        return new Vector3(newVec[0],newVec[1],newVec[2]);
    }

    static transform(m: Matrix, t: Vector4): Vector4 {
        var newVec=glm.vec4.create();
        var trans=glm.vec4.create();
       trans[0]=t.X;trans[1]=t.Y;trans[2]=t.Z;trans[3]=t.W;
        glm.vec4.transformMat4(newVec,trans,m.targetMatrix)
        return new Vector4(newVec[0],newVec[1],newVec[2],newVec[3]);
    }

    /**
     * Retrieve determinant of passed matrix
     */
    static determinant(m: Matrix): number {
        return glm.mat4.determinant(m.targetMatrix);
    }

    /**
     * Compute inverted passed matrix.
     */
    static inverse(m: Matrix): Matrix {
      var newMat=glm.mat4.create();
      return new Matrix(glm.mat4.invert(newMat,m.targetMatrix));
    }

    /**
     * Generate linear translation transform matrix.
     */
    static translate(v: Vector3): Matrix {
        var newMat=glm.mat4.create();
        glm.mat4.translate(newMat,newMat,v.targetVector);
        return new Matrix(newMat);
    }

    /**
     * Generate linear scaling transform matrix.
     */
    static scale(v: Vector3): Matrix {
        var newMat =glm.mat4.create();
        glm.mat4.scale(newMat,newMat,v.targetVector);
        return new Matrix(newMat);
    }
    
    static rotateX(angle:number):Matrix{
       var newMat = glm.mat4.create();
       glm.mat4.rotateX(newMat,newMat,angle);
       return new Matrix(newMat);
    }

    static rotateY(angle:number):Matrix{
       var newMat = glm.mat4.create();
       glm.mat4.rotateY(newMat,newMat,angle);
       return new Matrix(newMat);
    }

    static rotateZ(angle:number):Matrix{
       var newMat = glm.mat4.create();
       glm.mat4.rotateZ(newMat,newMat,angle);
       return new Matrix(newMat);
    }

    static RotationQuaternion(quat:Quaternion):Matrix
    {
      var quaternion= glm.quat.create();
      var newMat = glm.mat4.create();
      glm.quat.normalize(quaternion,quat.targetQuat);
      glm.mat4.fromQuat(newMat,quaternion);
      return new Matrix(newMat);
    }

    static frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix {
        var newMat=glm.mat4.create();
        glm.mat4.frustum(newMat,left,right,bottom,top,near,far);
		return new Matrix(newMat);
    }

    static ortho(left:number,right:number,bottom:number,top:number,near:number,far:number):Matrix
    {
        var newMat = glm.mat4.create();
        glm.mat4.ortho(newMat,left,right,bottom,top,near,far);
        return new Matrix(newMat);
    }

    static perspective(fovy: number, aspect: number, near: number, far: number): Matrix {
        var newMat = glm.mat4.create();
        glm.mat4.perspective(newMat,fovy,aspect,near,far);
        return new Matrix(newMat);
    }

    static lookAt(eye: Vector3, lookAt: Vector3, up: Vector3): Matrix {
        var newMat = glm.mat4.create();
        glm.mat4.lookAt(newMat,eye.targetVector,lookAt.targetVector,up.targetVector);
        return new Matrix(newMat);
    }

    multiplyWith(m: Matrix): Matrix {
        return Matrix.multiply(this, m);
    }



    toString(): string {
        return (`|${this.getBySingleIndex(0)} ${this.getBySingleIndex(4)} ${this.getBySingleIndex(8)} ${this.getBySingleIndex(12)}|\n
                 |${this.getBySingleIndex(1)} ${this.getBySingleIndex(5)} ${this.getBySingleIndex(9)} ${this.getBySingleIndex(13)}|\n
                 |${this.getBySingleIndex(2)} ${this.getBySingleIndex(6)} ${this.getBySingleIndex(10)} ${this.getBySingleIndex(14)}|\n
                 |${this.getBySingleIndex(3)} ${this.getBySingleIndex(7)} ${this.getBySingleIndex(11)} ${this.getBySingleIndex(15)}|`)  }

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
