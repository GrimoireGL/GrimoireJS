import MatrixBase = require("./MatrixBase");
import Vector3 = require("./Vector3");
import Vector4 = require("./Vector4");
import Delegates=require("../Base/Delegates");;
import Quaternion = require("./Quaternion");
import glm = require("gl-matrix");;
class Matrix extends MatrixBase{
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

    private isValidArray(arr: Float32Array): boolean {
        if (arr.length !== 16) return false;
        return true;
    }

    constructor(arr?:glm.GLM.IArray) {
        super();
        if(arr)this.rawElements=arr;
        else this.rawElements = glm.mat4.create();
    }

    public getAt(row: number, colmun: number): number {
        return this.rawElements[colmun * 4 + row];
    }

    public setAt(row: number, colmun: number,  val: number) {
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
    public getRow(row: number):Vector4 {
        return new Vector4(this.rawElements[row], this.rawElements[row + 4], this.rawElements[row + 8], this.rawElements[row + 12]);
    }

    public static equal(m1: Matrix, m2: Matrix): boolean {
        return Matrix.elementEqual(m1, m2);
    }

    public static add(m1: Matrix, m2: Matrix): Matrix {
        var mat=glm.mat4.create();
        for(var i=0;i<16;i++)
        {
            mat[i]=m1.rawElements[i]+m2.rawElements[i];
        }
        return new Matrix(mat);
    }

    public static subtract(m1: Matrix, m2: Matrix): Matrix {
        return Matrix.add(m1,Matrix.negate(m2));
    }

    public static scalarMultiply(s: number, m: Matrix): Matrix {
        var newMat=glm.mat4.create();
        glm.mat4.multiply(newMat,[s,0,0,0,  0,s,0,0,  0,0,s,0 , 0,0,0,s],m.rawElements);
        return new Matrix(newMat);
    }

    public static multiply(m1: Matrix, m2: Matrix): Matrix {
        var newMat=glm.mat4.create();
        return new Matrix(glm.mat4.mul(newMat,m1.rawElements,m2.rawElements));
    }

    public static TRS(t:Vector3,rot:Quaternion,s:Vector3):Matrix
    {
       var newMat =glm.mat4.create();var cacheMat=glm.mat4.create();
       glm.mat4.mul(newMat,glm.mat4.translate(newMat,glm.mat4.create(),t.rawElements),glm.mat4.fromQuat(cacheMat,rot.rawElements));
       glm.mat4.scale(newMat,newMat,s.rawElements);
      return new Matrix(newMat);
    }

    public static negate(m: Matrix): Matrix {
        return this.scalarMultiply(-1,m);
    }

    public static transpose(m: Matrix): Matrix {
        var newMat = glm.mat4.create();
        return new Matrix(glm.mat4.transpose(newMat,m.rawElements));
    }

    public static transformPoint(m: Matrix, t: Vector3): Vector3 {
        var newVec=glm.vec3.create();
        glm.vec3.transformMat4(newVec,t.rawElements,m.rawElements);
        return new Vector3(newVec);
    }

    public static transformNormal(m: Matrix, t: Vector3): Vector3 {
        var newVec=glm.vec4.create();
        var trans=glm.vec4.create();
       trans[0]=t.X;trans[1]=t.Y;trans[2]=t.Z;trans[3]=0;
        glm.vec4.transformMat4(newVec,trans,m.rawElements)
        return new Vector3(newVec[0],newVec[1],newVec[2]);
    }

    public static transform(m: Matrix, t: Vector4): Vector4 {
        var newVec=glm.vec4.create();
        var trans=glm.vec4.create();
       trans[0]=t.X;trans[1]=t.Y;trans[2]=t.Z;trans[3]=t.W;
        glm.vec4.transformMat4(newVec,trans,m.rawElements)
        return new Vector4(newVec[0],newVec[1],newVec[2],newVec[3]);
    }

    /**
     * Retrieve determinant of passed matrix
     */
    public static determinant(m: Matrix): number {
        return glm.mat4.determinant(m.rawElements);
    }

    /**
     * Compute inverted passed matrix.
     */
    public static inverse(m: Matrix): Matrix {
      var newMat=glm.mat4.create();
      return new Matrix(glm.mat4.invert(newMat,m.rawElements));
    }

    /**
     * Generate linear translation transform matrix.
     */
    public static translate(v: Vector3): Matrix {
        var newMat=glm.mat4.create();
        glm.mat4.translate(newMat,newMat,v.rawElements);
        return new Matrix(newMat);
    }

    /**
     * Generate linear scaling transform matrix.
     */
    public static scale(v: Vector3): Matrix {
        var newMat =glm.mat4.create();
        glm.mat4.scale(newMat,newMat,v.rawElements);
        return new Matrix(newMat);
    }

    public static rotateX(angle:number):Matrix{
       var newMat = glm.mat4.create();
       glm.mat4.rotateX(newMat,newMat,angle);
       return new Matrix(newMat);
    }

    public static rotateY(angle:number):Matrix{
       var newMat = glm.mat4.create();
       glm.mat4.rotateY(newMat,newMat,angle);
       return new Matrix(newMat);
    }

    public static rotateZ(angle:number):Matrix{
       var newMat = glm.mat4.create();
       glm.mat4.rotateZ(newMat,newMat,angle);
       return new Matrix(newMat);
    }

    public static RotationQuaternion(quat:Quaternion):Matrix
    {
      var quaternion= glm.quat.create();
      var newMat = glm.mat4.create();
      glm.quat.normalize(quaternion,quat.rawElements);
      glm.mat4.fromQuat(newMat,quaternion);
      return new Matrix(newMat);
    }

    public static frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix {
        var newMat=glm.mat4.create();
        glm.mat4.frustum(newMat,left,right,bottom,top,near,far);
		return new Matrix(newMat);
    }

    public static ortho(left:number,right:number,bottom:number,top:number,near:number,far:number):Matrix
    {
        var newMat = glm.mat4.create();
        glm.mat4.ortho(newMat,left,right,bottom,top,near,far);
        return new Matrix(newMat);
    }

    public static perspective(fovy: number, aspect: number, near: number, far: number): Matrix {
        var newMat = glm.mat4.create();
        glm.mat4.perspective(newMat,fovy,aspect,near,far);
        return new Matrix(newMat);
    }

    public static lookAt(eye: Vector3, lookAt: Vector3, up: Vector3): Matrix {
        var newMat = glm.mat4.create();
        glm.mat4.lookAt(newMat,eye.rawElements,lookAt.rawElements,up.rawElements);
        return new Matrix(newMat);
    }

    public multiplyWith(m: Matrix): Matrix {
        return Matrix.multiply(this, m);
    }

    public toString(): string {
        return (`|${this.getBySingleIndex(0)} ${this.getBySingleIndex(4)} ${this.getBySingleIndex(8)} ${this.getBySingleIndex(12)}|\n
                 |${this.getBySingleIndex(1)} ${this.getBySingleIndex(5)} ${this.getBySingleIndex(9)} ${this.getBySingleIndex(13)}|\n
                 |${this.getBySingleIndex(2)} ${this.getBySingleIndex(6)} ${this.getBySingleIndex(10)} ${this.getBySingleIndex(14)}|\n
                 |${this.getBySingleIndex(3)} ${this.getBySingleIndex(7)} ${this.getBySingleIndex(11)} ${this.getBySingleIndex(15)}|`)  }

    public toMathematicaString():string
    {
        return (`{{${this.getBySingleIndex(0)},${this.getBySingleIndex(4)},${this.getBySingleIndex(8)},${this.getBySingleIndex(12)}},
                  {${this.getBySingleIndex(1)},${this.getBySingleIndex(5)},${this.getBySingleIndex(9)},${this.getBySingleIndex(13)}},
                  {${this.getBySingleIndex(2)},${this.getBySingleIndex(6)},${this.getBySingleIndex(10)},${this.getBySingleIndex(14)}},
                  {${this.getBySingleIndex(3)},${this.getBySingleIndex(7)},${this.getBySingleIndex(11)},${this.getBySingleIndex(15)}}}`);
    }

    public get ElementCount(): number { return 16; }

    public get RowCount(): number { return 4; }

    public get ColmunCount(): number { return 4; }
}
export=Matrix;
