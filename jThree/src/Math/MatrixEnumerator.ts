import JThreeObject = require('../Base/JThreeObject');
import IEnumrator = require("../Base/Collections/IEnumrator");
import Matrix = require("./Matrix");
class MatrixEnumerator extends JThreeObject implements IEnumrator<number> {
    private targetMat: Matrix;

    private currentIndex: number = -1;

    constructor(targetMat: Matrix) {
        super();
        this.targetMat = targetMat;
    }

    getCurrent(): number {
        return this.targetMat.getBySingleIndex(this.currentIndex);
    }

    next(): boolean {
        this.currentIndex++;
        if (this.currentIndex >= 0 && this.currentIndex < 16) return true;
        return false;
    }
}
export=MatrixEnumerator;
