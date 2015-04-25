import JThreeObject=require('Base/JThreeObject');
import ILinearObjectFactory = require("./ILinearObjectFactory");
import Delegates = require("../Delegates");
import Matrix = require("./Matrix");
import IMatrixFactory = require("./IMatrixFactory");
class MatrixFactory implements ILinearObjectFactory<Matrix>, IMatrixFactory<Matrix> {
    fromArray(array: Float32Array): Matrix {
        return new Matrix(array);
    }

    fromFunc(f: Delegates.Func2<number, number, number>): Matrix {
        return new Matrix(new Float32Array([f(0, 0), f(1, 0), f(2, 0), f(3, 0), f(0, 1), f(1, 1), f(2, 1), f(3, 1), f(0, 2), f(1, 2), f(2, 2), f(3, 2), f(0, 3), f(1, 3), f(2, 3), f(3, 3)]));
    }
}

export=MatrixFactory;
