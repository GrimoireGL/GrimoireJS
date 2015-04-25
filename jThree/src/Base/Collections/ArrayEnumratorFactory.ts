import IEnumrator = require("./IEnumrator");
import IEnumerable = require("./IEnumerable");


/**
 * The class for wrap basic javascript arrays as collection type implementing IEnumerator.
 */
class ArrayEnumratorFactory<T> implements IEnumerable<T> {
    constructor(targetArray: T[]) { this.targetArray = targetArray; }

    protected targetArray: T[];
    getEnumrator(): IEnumrator<T> { return new ArrayEnumerable(this.targetArray); }
}

//internal class
class ArrayEnumerable<T> implements IEnumrator<T> {
    constructor(targetArrary: T[]) { this.targetArrary = targetArrary; }

    targetArrary: T[];
    currentIndex: number = -1;

    getCurrent(): T {
        if (this.targetArrary.length > this.currentIndex && this.currentIndex >= 0) {
            return this.targetArrary[this.currentIndex];
        }
    }

    next(): boolean {
        this.currentIndex++;
        if (this.currentIndex >= this.targetArrary.length) return false;
        return true;
    }
}


export =ArrayEnumratorFactory;
