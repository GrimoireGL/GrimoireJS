import JThreeObject=require('Base/JThreeObject');
import VectorEnumeratorBase = require("./VectorEnumeratorBase");
import ILinearObjectFactory = require("./ILinearObjectFactory");
import Exceptions = require("../Exceptions");
import VectorBase = require("./VectorBase");
import ILinearObjectGenerator = require("./ILinearObjectGenerator");
import IEnumrator = require("../Base/Collections/IEnumrator");

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

    constructor(x: number, y: number, z: number, w: number) {
        super();
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    private x: number;
    private y: number;
    private z: number;
    private w: number;

    get X() {
        return this.x;
    }

    get Y() {
        return this.y;
    }

    get Z() {
        return this.z;
    }

    get W() {
        return this.w;
    }

    static dot(v1: Vector4, v2: Vector4) {
        return this.elementDot(v1, v2);
    }

    static add(v1: Vector4, v2: Vector4): Vector4 {
        return VectorBase.elementAdd(v1, v2, v1.getFactory());
    }

    static subtract(v1: Vector4, v2: Vector4): Vector4 {
        return VectorBase.elementSubtract(v1, v2, v1.getFactory());
    }

    static multiply(s: number, v: Vector4): Vector4 {
        return VectorBase.elementScalarMultiply(v, s, v.getFactory());
    }

    static negate(v1: Vector4): Vector4 {
        return VectorBase.elementNegate(v1, v1.getFactory());
    }

    static equal(v1: Vector4, v2: Vector4): boolean {
        return VectorBase.elementEqual(v1, v2);
    }

    static normalize(v1: Vector4): Vector4 {
        return VectorBase.normalizeElements(v1, v1.getFactory());
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
        return `Vector4(${this.x}, ${this.y}, ${this.z},${this.w})`;
    }

    getFactory(): ILinearObjectFactory<Vector4> { return Vector4Factory.getInstance(); }
}


export=Vector4;
