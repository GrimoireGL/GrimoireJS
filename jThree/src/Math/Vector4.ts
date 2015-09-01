import VectorBase = require("./VectorBase");
import glm = require('gl-matrix');

class Vector4 extends VectorBase
{
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

    constructor(x: glm.GLM.IArray);
    constructor(x:number,y:number,z:number,w:number);
    constructor(x: number|glm.GLM.IArray, y?: number, z?: number, w?: number)
    {
        super();
        if(typeof y === 'undefined')
        {
            this.targetVector=<glm.GLM.IArray>x;
            return;
        }
        this.targetVector=[<number>x,y,z,w];
    }

    private targetVector:glm.GLM.IArray;

    public get RawElements():glm.GLM.IArray
    {
        return this.targetVector;
    }

    public get normalized() {
        return this.multiplyWith(1 / this.magnitude);
    }

    public get X() {
        return this.targetVector[0];
    }

    public get Y() {
        return this.targetVector[1];
    }

    public get Z() {
        return this.targetVector[2];
    }

    public get W() {
        return this.targetVector[3];
    }

    public set X(x:number) {
        this.targetVector[0] = x;
    }

    public set Y(y: number)
    {
        this.targetVector[1] = y;
    }

    public set Z(z: number)
    {
        this.targetVector[2] = z;
    }

    public set W(w: number)
    {
        this.targetVector[3] = w;
    }

    public static dot(v1: Vector4, v2: Vector4) {
        return glm.vec4.dot(v1.targetVector,v2.targetVector);
    }

    public static add(v1: Vector4, v2: Vector4): Vector4 {
        var newVec=glm.vec4.create();
        return new Vector4(glm.vec4.add(newVec,v1.targetVector,v2.targetVector));
    }

    public static subtract(v1: Vector4, v2: Vector4): Vector4 {
        var newVec=glm.vec4.create();
        return new Vector4(glm.vec4.sub(newVec,v1.targetVector,v2.targetVector));
    }

    public static multiply(s: number, v: Vector4): Vector4 {
        var newVec=glm.vec4.create();
        return new Vector4(glm.vec4.scale(newVec,v.targetVector,s));
    }

    public static negate(v1: Vector4): Vector4 {
        return Vector4.multiply(-1,v1);
    }

    public static equal(v1: Vector4, v2: Vector4): boolean {
        return VectorBase.elementEqual(v1, v2);
    }

    public static normalize(v1: Vector4): Vector4 {
        var newVec=glm.vec4.create();
        return new Vector4(glm.vec4.normalize(newVec,v1.targetVector));
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
        return `Vector4(${this.X}, ${this.Y}, ${this.Z},${this.W})`;
    }

}


export=Vector4;
