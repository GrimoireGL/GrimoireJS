import JThreeObject=require('Base/JThreeObject');
import VectorBase = require("./VectorBase");
import IEnumerable = require("../Base/Collections/IEnumerable");
interface IVectorFactory<T extends VectorBase> {
    fromEnumerable(en: IEnumerable<number>): T;
    fromArray(arr: number[]): T;
}

export=IVectorFactory;
