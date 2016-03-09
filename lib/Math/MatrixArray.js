import Matrix from "./Matrix";
class MatrixArray {
    constructor(length) {
        this.rawElements = new Float32Array(length * 16);
    }
    static getIdentityMatrixArray(length) {
        const matArray = new MatrixArray(length);
        for (let i = 0; i < length; i++) {
            for (let c = 0; c < 4; c++) {
                for (let r = 0; r < 4; r++) {
                    matArray.rawElements[i * 16 + 4 * c + r] = c === r ? 1 : 0;
                }
            }
        }
        return matArray;
    }
    getAt(index) {
        const firstIndex = index * 16;
        return new Matrix(this.rawElements.slice(firstIndex, firstIndex + 16));
    }
    setAt(index, matrix) {
        for (let i = 0; i < 16; i++) {
            this.rawElements[16 * index + i] = matrix.rawElements[i];
        }
    }
}
export default MatrixArray;
