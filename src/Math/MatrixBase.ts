import {GLM} from "gl-matrix";
class MatrixBase {

  public rawElements: GLM.IArray;

  protected static __elementEquals(m1: MatrixBase, m2: MatrixBase): boolean {
    if (m1.RowCount !== m2.RowCount || m1.ColmunCount !== m2.ColmunCount) {
      return false;
    }
    const count = m1.RowCount * m2.ColmunCount;
    for (let i = 0; i < count; i++) {
      if (m1.getBySingleIndex(i) !== m2.getBySingleIndex(i)) {
        return false;
      }
    }
    return true;
  }

  public get RowCount(): number {
    return 0;
  }

  public get ColmunCount(): number {
    return 0;
  }

  public getAt(row: number, colmun: number): number {
    throw new Error("Not implemented");
  }

  public getBySingleIndex(index: number): number {
    throw new Error("Not implemented");
  }
}
export default MatrixBase;
