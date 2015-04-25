import LinearBase = require("./LinearBase");
import IEnumerable = require("../Base/Collections/IEnumerable");
import IEnumrator = require("../Base/Collections/IEnumrator");
import IMatrixFactory = require("./IMatrixFactory");
class MatrixBase extends LinearBase implements IEnumerable<number> {
    getEnumrator(): IEnumrator<number> { throw new Error("Not implemented"); }

    protected static elementTranspose<T extends MatrixBase>(a: T, factory: IMatrixFactory<T>): T {
        return factory.fromFunc((i, j) => {
            return a.getAt(j, i);
        });
    }

    get RowCount(): number {
        return 0;
    }

    get ColmunCount(): number {
        return 0;
    }

    getAt(row: number, colmun: number): number {
        throw new Error("Not implemented");
    }

    getBySingleIndex(index: number): number {
        throw new Error("Not implemented");
    }
}
export=MatrixBase;
