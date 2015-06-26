import ILinearObjectFactory = require("./ILinearObjectFactory");
import VectorBase = require("./VectorBase");
import ILinearObjectGenerator = require("./ILinearObjectGenerator");
import VectorEnumeratorBase = require("./VectorEnumeratorBase");
import Exceptions = require("../Exceptions");
import IEnumrator = require("../Base/Collections/IEnumrator");
import glm = require('glm');
class Vector2Factory implements ILinearObjectFactory<Vector2> {
    static instance: Vector2Factory;

    static getInstance(): Vector2Factory {
        this.instance = this.instance || new Vector2Factory();
        return this.instance;
    }

    fromArray(array: Float32Array): Vector2 {
        return new Vector2(array[0], array[1]);
    }
}

class Vector2Enumerator extends VectorEnumeratorBase<Vector2>{

    constructor(vec: Vector2) {
        super(vec);
    }

    getCurrent(): number {
        switch (this.currentIndex) {
            case 0:
                return this.vector.X;
            case 1:
                return this.vector.Y;
            default:
                throw new Exceptions.IrregularElementAccessException(this.currentIndex);
        }
    }
}

class Vector2 extends VectorBase implements ILinearObjectGenerator<Vector2>{

    public static get XUnit(): Vector2 {
        return new Vector2(1, 0);
    }

    public static get YUnit(): Vector2 {
        return new Vector2(0, 1);
    }
   
    constructor(x: number|glm.GLM.IArray, y?: number) {
        super();
        if(typeof y ==='undefined')
        {
            this.targetVector=<glm.GLM.IArray>x;
            return;
        }
        this.targetVector=[<number>x,y];
    }
    
    public targetVector:glm.GLM.IArray;
    
    get X(): number {
        return this.targetVector[0];
    }

    get Y(): number {
        return this.targetVector[1];
    }

    static dot(v1: Vector2, v2: Vector2): number {
        return glm.vec2.dot(v1.targetVector,v2.targetVector);
    }

    static add(v1: Vector2, v2: Vector2): Vector2 {
        var newVec=glm.vec2.create();
        return new Vector2(glm.vec2.add(newVec,v1.targetVector,v2.targetVector));
    }

    static subtract(v1: Vector2, v2: Vector2): Vector2 {
        var newVec=glm.vec2.create();
        return new Vector2(glm.vec2.sub(newVec,v1.targetVector,v2.targetVector));
    }

    static multiply(s: number, v: Vector2): Vector2 {
        var newVec=glm.vec2.create();
        return new Vector2(glm.vec2.scale(newVec,v.targetVector,s));
    }

    static negate(v1: Vector2): Vector2 {
        return Vector2.multiply(-1,v1);
    }

    static equal(v1: Vector2, v2: Vector2): boolean {
        return VectorBase.elementEqual(v1, v2);
    }

    static normalize(v1: Vector2): Vector2 {
        var newVec=glm.vec2.create();
        return new Vector2(glm.vec2.normalize(newVec,v1.targetVector));
    }

    dotWith(v: Vector2): number {
        return Vector2.dot(this, v);
    }

    addWith(v: Vector2): Vector2 {
        return Vector2.add(this, v);
    }

    subtractWith(v: Vector2): Vector2 {
        return Vector2.subtract(v, this);
    }

    multiplyWith(s: number): Vector2 {
        return Vector2.multiply(s, this);
    }

    negateThis(): Vector2 {
        return Vector2.negate(this);
    }

    equalWith(v: Vector2): boolean {
        return Vector2.equal(this, v);
    }

    normalizeThis(): Vector2 {
        return Vector2.normalize(this);
    }

    toString(): string {
        return `Vector2(x=${this.X}},y=${this.Y})`;
    }

    getEnumrator(): IEnumrator<number> {
        return new Vector2Enumerator(this);
    }

    get ElementCount(): number { return 2; }

    getFactory(): ILinearObjectFactory<Vector2> { return Vector2Factory.getInstance(); }
}

export=Vector2;
