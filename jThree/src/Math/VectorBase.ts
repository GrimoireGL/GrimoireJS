import JThreeObject=require('Base/JThreeObject');
import LinearBase = require("./LinearBase");
import Collection = require("../Base/Collections/Collection");
import ILinearObjectFactory = require("./ILinearObjectFactory");
class VectorBase extends LinearBase {



    private magnitudeSquaredCache: number = -1;

    get magnitudeSquared(): number {
        if (this.magnitudeSquaredCache < 0) {
            var sum: number = 0;
            Collection.foreach(this, (t) => {
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

    protected static normalizeElements<T extends VectorBase>(a: T, factory: ILinearObjectFactory<T>): T {
        var magnitude: number = a.magnitude;
        var result: Float32Array = new Float32Array(a.ElementCount);
        Collection.foreach<number>(a, (a, i) => {
            result[i] = a / magnitude;
        });
        return factory.fromArray(result);
    }

}

export=VectorBase;
