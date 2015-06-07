import ILinearObjectFactory = require("./ILinearObjectFactory");
import VectorBase = require("./VectorBase");
import ILinearObjectGenerator = require("./ILinearObjectGenerator");
import VectorEnumeratorBase = require("./VectorEnumeratorBase");
import Exceptions = require("../Exceptions");
import IEnumrator = require("../Base/Collections/IEnumrator");
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
    constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
    }

    private x: number;
    private y: number;

    get X(): number {
        return this.x;
    }

    get Y(): number {
        return this.y;
    }

    static dot(v1: Vector2, v2: Vector2): number {
        return VectorBase.elementDot(v1, v2);
    }

    static add(v1: Vector2, v2: Vector2): Vector2 {
        return VectorBase.elementAdd(v1, v2, v1.getFactory());
    }

    static subtract(v1: Vector2, v2: Vector2): Vector2 {
        return VectorBase.elementSubtract(v1, v2, v1.getFactory());
    }

    static multiply(s: number, v: Vector2): Vector2 {
        return VectorBase.elementScalarMultiply(v, s, v.getFactory());
    }

    static negate(v1: Vector2): Vector2 {
        return VectorBase.elementNegate(v1, v1.getFactory());
    }

    static equal(v1: Vector2, v2: Vector2): boolean {
        return VectorBase.elementEqual(v1, v2);
    }

    static normalize(v1: Vector2): Vector2 {
        return VectorBase.normalizeElements(v1, v1.getFactory());
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
        return `Vector2(x=${this.x}},y=${this.y})`;
    }

    getEnumrator(): IEnumrator<number> {
        return new Vector2Enumerator(this);
    }

    get ElementCount(): number { return 2; }

    getFactory(): ILinearObjectFactory<Vector2> { return Vector2Factory.getInstance(); }
}

export=Vector2;
