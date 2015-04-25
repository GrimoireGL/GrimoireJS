import Delegates = require("../Delegates");
interface IMatrixFactory<T> {
    fromFunc(f: Delegates.Func2<number, number, number>): T;
}

export=IMatrixFactory;
