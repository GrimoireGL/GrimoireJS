import JThreeObject=require('Base/JThreeObject');
import VectorEnumeratorBase = require("./VectorEnumeratorBase");
import ILinearObjectFactory = require("./ILinearObjectFactory");
import Exceptions = require("../Exceptions");
import VectorBase = require("./VectorBase");
import ILinearObjectGenerator = require("./ILinearObjectGenerator");
import IEnumrator = require("../Base/Collections/IEnumrator");
import glm = require('glm');
class Vector4Enumerator extends VectorEnumeratorBase<Vector4> {
    constructor(vec: Vector4) {
        super(vec);
    }


    getCurrent(): number {
        switch (this.currentIndex) {
            case 0:
                return this.vector.X;
            case 1:
                return this.vector.Y;
            case 2:
                return this.vector.Z;
            case 3:
                return this.vector.W;
            default:
                throw new Exceptions.IrregularElementAccessException(this.currentIndex);
        }
    }
}


class Vector4Factory implements ILinearObjectFactory<Vector4> {
    static instance: Vector4Factory;

    static getInstance(): Vector4Factory {
        this.instance = this.instance || new Vector4Factory();
        return this.instance;
    }

    fromArray(array: Float32Array): Vector4 {
        return new Vector4(array[0], array[1], array[2], array[3]);
    }
}


class Vector4 extends VectorBase implements ILinearObjectGenerator<Vector4>{

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

    constructor(x: number|glm.GLM.IArray, y?: number, z?: number, w?: number) {
        super();
        if(typeof y === 'undefined')
        {
            this.targetVector=<glm.GLM.IArray>x;
            return;
        }
        this.targetVector=[<number>x,y,z,w];
    }
    
    private targetVector:glm.GLM.IArray;

    get X() {
        return this.targetVector[0];
    }

    get Y() {
        return this.targetVector[1];
    }

    get Z() {
        return this.targetVector[2];
    }

    get W() {
        return this.targetVector[3];
    }

    static dot(v1: Vector4, v2: Vector4) {
        return glm.vec4.dot(v1.targetVector,v2.targetVector);
    }

    static add(v1: Vector4, v2: Vector4): Vector4 {
        var newVec=glm.vec4.create();
        return new Vector4(glm.vec4.add(newVec,v1.targetVector,v2.targetVector));
    }

    static subtract(v1: Vector4, v2: Vector4): Vector4 {
        var newVec=glm.vec4.create();
        return new Vector4(glm.vec4.sub(newVec,v1.targetVector,v2.targetVector));
    }

    static multiply(s: number, v: Vector4): Vector4 {
        var newVec=glm.vec4.create();
        return new Vector4(glm.vec4.scale(newVec,v.targetVector,s));
    }

    static negate(v1: Vector4): Vector4 {
        return Vector4.multiply(-1,v1);
    }

    static equal(v1: Vector4, v2: Vector4): boolean {
        return VectorBase.elementEqual(v1, v2);
    }

    static normalize(v1: Vector4): Vector4 {
        var newVec=glm.vec4.create();
        return new Vector4(glm.vec4.normalize(newVec,v1.targetVector));
    }

    normalizeThis(): Vector4 {
        return Vector4.normalize(this);
    }

    dotWith(v: Vector4): number {
        return Vector4.dot(this, v);
    }

    addWith(v: Vector4): Vector4 {
        return Vector4.add(this, v);
    }

    subtractWith(v: Vector4): Vector4 {
        return Vector4.subtract(v, this);
    }

    multiplyWith(s: number): Vector4 {
        return Vector4.multiply(s, this);
    }

    negateThis(): Vector4 {
        return Vector4.negate(this);
    }

    equalWith(v: Vector4): boolean {
        return Vector4.equal(this, v);
    }


    getEnumrator(): IEnumrator<number> { return new Vector4Enumerator(this); }

    get ElementCount(): number { return 4; }

    toString(): string {
        return `Vector4(${this.X}, ${this.Y}, ${this.Z},${this.W})`;
    }

    getFactory(): ILinearObjectFactory<Vector4> { return Vector4Factory.getInstance(); }
}


export=Vector4;
