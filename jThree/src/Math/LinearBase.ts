import Collection = require("../Base/Collections/Collection");
import ILinearObjectFactory = require("./ILinearObjectFactory");
import IEnumerable = require("Base/Collections/IEnumerable");
import IEnumrator = require("Base/Collections/IEnumrator");

class LinearBase implements IEnumerable<number> {
    static elementDot(a: LinearBase, b: LinearBase): number {
        var dot: number = 0;
        Collection.foreachPair(a, b, (a, b) => {
            dot += a * b;
        });
        return dot;
    }

    static elementAdd<T extends LinearBase>(a: T, b: T, factory: ILinearObjectFactory<T>): T {
        var result: Float32Array = new Float32Array(a.ElementCount);
        Collection.foreachPair<number>(a, b, (a, b, i) => {
            result[i] = a + b;
        });
        return factory.fromArray(result);
    }

    static elementSubtract<T extends LinearBase>(a: T, b: T, factory: ILinearObjectFactory<T>): T {
        var result: Float32Array = new Float32Array(a.ElementCount);
        Collection.foreachPair<number>(a, b, (a, b, i) => {
            result[i] = a - b;
        });
        return factory.fromArray(result);
    }

    static elementScalarMultiply<T extends LinearBase>(a: T, s: number, factory: ILinearObjectFactory<T>): T {
        var result: Float32Array = new Float32Array(a.ElementCount);
        Collection.foreach<number>(a, (a, i) => {
            result[i] = a * s;
        });
        return factory.fromArray(result);
    }

    public static elementEqual<T extends LinearBase>(a: T, b: T) {
        var result: boolean = true;
        Collection.foreachPair<number>(a, b, (a, b, i) => {
            if (a != b) result = false;
        });
        return result;
    }

    static elementNegate<T extends LinearBase>(a: T, factory: ILinearObjectFactory<T>) {
        var result: Float32Array = new Float32Array(a.ElementCount);
        Collection.foreach<Number>(a, (a, i) => {
            result[i] = -a;
        });
        return factory.fromArray(result);
    }

    static elementNaN<T extends LinearBase>(a: T): boolean {
        var result: boolean = false;
        Collection.foreach<number>(a, (a, i) => {
            if (isNaN(a)) result = true;
        });
        return result;
    }

    get ElementCount(): number {
        return 0;
    }

    getEnumrator(): IEnumrator<number> { throw new Error("Not implemented"); }
}


export=LinearBase;
