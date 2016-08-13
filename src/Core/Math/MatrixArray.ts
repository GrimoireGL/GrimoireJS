import Matrix from "./Matrix";
class MatrixArray {
  public rawElements: Float32Array;

  public static getIdentityMatrixArray(length: number): MatrixArray {
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

  constructor(length: number) {
    this.rawElements = new Float32Array(length * 16);
  }

  public getAt(index: number): Matrix {
    const firstIndex = index * 16;
    return new Matrix(this.rawElements.slice(firstIndex, firstIndex + 16));
  }

  public setAt(index: number, matrix: Matrix): void {
    for (let i = 0; i < 16; i++) {
      this.rawElements[16 * index + i] = matrix.rawElements[i];
    }
  }
}

export default MatrixArray;
