module jThree.Mathematics.Vector {
    import jThreeMath=jThree.Mathematics.jThreeMath;
    import jThreeException = jThree.Exceptions.jThreeException;
    import Enumerable = jThree.Collections.IEnumerable;
    import Collection = jThree.Collections.Collection;
    import Enumrator = jThree.Collections.IEnumrator;

    export interface ILinearObjectFactory<T extends LinearBase> {
        fromArray(array:Float32Array):T;
    }

    export interface ILinearObjectGenerator<T extends LinearBase> {
        getFactory():ILinearObjectFactory<T>;
    }

    export class LinearBase implements Enumerable<number> {
        protected static elementDot(a: LinearBase, b: LinearBase): number {
            var dot: number = 0;
            Collection.foreachPair(a, b,(a, b) => {
                dot += a * b;
            });
            return dot;
        }

        protected static elementAdd<T extends LinearBase>(a: T, b: T, factory: ILinearObjectFactory<T>): T {
            var result: Float32Array = new Float32Array(a.ElementCount);
            Collection.foreachPair<number>(a, b,(a, b, i) => {
                result[i] = a + b;
            });
            return factory.fromArray(result);
        }

        protected static elementSubtract<T extends LinearBase>(a: T, b: T, factory: ILinearObjectFactory<T>): T {
            var result: Float32Array = new Float32Array(a.ElementCount);
            Collection.foreachPair<number>(a, b,(a, b, i) => {
                result[i] = a - b;
            });
            return factory.fromArray(result);
        }

        protected static elementScalarMultiply<T extends LinearBase>(a: T, s: number, factory: ILinearObjectFactory<T>): T {
            var result: Float32Array = new Float32Array(a.ElementCount);
            Collection.foreach<number>(a,(a, i) => {
                result[i] = a * s;
            });
            return factory.fromArray(result);
        }

        protected static elementEqual<T extends LinearBase>(a: T, b: T) {
            var result: boolean = true;
            Collection.foreachPair<number>(a, b,(a, b, i) => {
                if (a != b) result = false;
            });
            return result;
        }

        protected static elementNegate<T extends LinearBase>(a: T, factory: ILinearObjectFactory<T>) {
            var result: Float32Array = new Float32Array(a.ElementCount);
            Collection.foreach<Number>(a,(a, i) => {
                result[i] = -a;
            });
            return factory.fromArray(result);
        }

        protected static elementNaN<T extends LinearBase>(a: T): boolean {
            var result: boolean = false;
            Collection.foreach<number>(a,(a, i) => {
                if (isNaN(a)) result = true;
            });
            return result;
        }

        get ElementCount(): number {
            return 0;
        }

        getEnumrator(): Enumrator<number> { throw new Error("Not implemented"); }
    }

    export class VectorBase extends LinearBase{



        private magnitudeSquaredCache: number = -1;

       get magnitudeSquared() :number{
            if (this.magnitudeSquaredCache < 0) {
                var sum: number = 0;
                Collection.foreach(this,(t) => {
                    sum += t * t;
                });
                this.magnitudeSquaredCache = sum;
            }
            return this.magnitudeSquaredCache;
        }

        private magnitudeCache: number = -1;

        get magnitude() {
            if (this.magnitudeCache < 0) {
                this.magnitudeCache = Math.sqrt(this.magnitudeSquared);
            }
            return this.magnitudeCache;
        }


    }

    class VectorEnumeratorBase<T extends VectorBase> implements Enumrator<number>
    {
        private elementCount: number = 0;

        constructor(vec: T) {
            this.vector = vec;
            this.elementCount = vec.ElementCount;
        }

        protected currentIndex: number = -1;

        protected vector: T;

        getCurrent(): number { throw new Error("Not implemented"); }

        next(): boolean {
            this.currentIndex++;
            return jThreeMath.range(this.currentIndex, 0, this.elementCount);
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

    class Vector3Enumerator extends VectorEnumeratorBase<Vector3>{

        constructor(vec: Vector3) {
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
                default:
                    throw new Exceptions.IrregularElementAccessException(this.currentIndex);            }
        }
    }

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
                    throw new Exceptions.IrregularElementAccessException(this.currentIndex);            }
        }
    }

    class Vector2Factory implements ILinearObjectFactory<Vector2> {
        static instance:Vector2Factory;

        static getInstance(): Vector2Factory {
            this.instance = this.instance || new Vector2Factory();
            return this.instance;
        }

        fromArray(array: Float32Array): Vector2 {
            return new Vector2(array[0], array[1]);
        }
    }

    class Vector3Factory implements ILinearObjectFactory<Vector3> {
        static instance: Vector3Factory;

        static getInstance(): Vector3Factory {
            this.instance = this.instance || new Vector3Factory();
            return this.instance;
        }

        fromArray(array:Float32Array): Vector3 {
            return new Vector3(array[0], array[1],array[2]);
        }
    }

    class Vector4Factory implements ILinearObjectFactory<Vector4> {
        static instance: Vector4Factory;

        static getInstance(): Vector4Factory {
            this.instance = this.instance || new Vector4Factory();
            return this.instance;
        }

        fromArray(array: Float32Array): Vector4 {
            return new Vector4(array[0], array[1],array[2],array[3]);
        }
    }

    export class Vector2 extends VectorBase implements ILinearObjectGenerator<Vector2>{

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

        static negate(v1: Vector2):Vector2 {
            return VectorBase.elementNegate(v1, v1.getFactory());
        }

        static equal(v1: Vector2, v2: Vector2): boolean {
            return VectorBase.elementEqual(v1, v2);
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

        toString(): string {
            return "Vector2(x={0},y={1})".format(this.x, this.y);
        }

        getEnumrator(): Enumrator<number> {
            return new Vector2Enumerator(this);
        }

        get ElementCount(): number { return 2; }

        getFactory(): ILinearObjectFactory<Vector2> { return Vector2Factory.getInstance(); }
    }

    export class Vector3 extends VectorBase implements ILinearObjectGenerator<Vector3> {
        public static get XUnit(): Vector3 {
            return new Vector3(1, 0, 0);
        }

        public static get YUnit(): Vector3 {
            return new Vector3(0, 1, 0);
        }

        public static get ZUnit(): Vector3 {
            return new Vector3(0, 0, 1);
        }

        constructor(x: number, y: number,z:number) {
            super();
            this.x = x;
            this.y = y;
            this.z = z;
        }

        private x: number;
        private y: number;
        private z: number;

        get X(): number {
            return this.x;
        }

        get Y(): number {
            return this.y;
        }

        get Z(): number {
            return this.z;
        }

        static dot(v1: Vector3, v2: Vector3): number {
            return VectorBase.elementDot(v1, v2);
        }

        static add(v1: Vector3, v2: Vector3): Vector3 {
            return VectorBase.elementAdd(v1, v2, v1.getFactory());
        }

        static subtract(v1: Vector3, v2: Vector3): Vector3 {
            return VectorBase.elementSubtract(v1, v2, v1.getFactory());
        }

        static multiply(s: number, v: Vector3): Vector3 {
            return VectorBase.elementScalarMultiply(v, s, v.getFactory());
        }

        static negate(v1: Vector3):Vector3 {
            return VectorBase.elementNegate(v1, v1.getFactory());
        }

        static equal(v1: Vector3, v2: Vector3): boolean {
            return VectorBase.elementEqual(v1, v2);
        }

        dotWith(v: Vector3): number {
            return Vector3.dot(this, v);
        }

        addWith(v: Vector3): Vector3 {
            return Vector3.add(this, v);
        }

        subtractWith(v: Vector3): Vector3 {
            return Vector3.subtract(v, this);
        }

        multiplyWith(s: number): Vector3 {
            return Vector3.multiply(s, this);
        }

        negateThis(): Vector3 {
            return Vector3.negate(this);
        }

        equalWith(v: Vector3): boolean {
            return Vector3.equal(this, v);
        }

        toString(): string {
            return "Vector3(x={0},y={1},z={2})".format(this.x, this.y, this.z);
        }

        getEnumrator(): Enumrator<number> {
            return new Vector3Enumerator(this);
        }

        get ElementCount(): number { return 3; }

        getFactory(): ILinearObjectFactory<Vector3> { return Vector3Factory.getInstance(); }
    }

    export class Vector4 extends VectorBase implements ILinearObjectGenerator<Vector4>{

        public static get XUnit():Vector4 {
            return new Vector4(1,0,0,0);
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


        getEnumrator(): Enumrator<number> { return new Vector4Enumerator(this); }

        get ElementCount(): number { return 4; }

        toString(): string {
            return "Vector4(x={0},y={1},z={2},w={3}".format(this.x, this.y, this.z, this.w);
        }

        getFactory(): ILinearObjectFactory<Vector4> { return Vector4Factory.getInstance(); }
    }
}