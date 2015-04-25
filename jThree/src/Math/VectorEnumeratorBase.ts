import JThreeObject=require('Base/JThreeObject');
import VectorBase = require("./VectorBase");
import IEnumrator = require("../Base/Collections/IEnumrator");
import Math = require("./Math");
class VectorEnumeratorBase<T extends VectorBase> implements IEnumrator<number>
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
        return Math.range(this.currentIndex, 0, this.elementCount);
    }
}

export=VectorEnumeratorBase;
