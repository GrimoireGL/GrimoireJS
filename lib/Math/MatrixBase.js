class MatrixBase {
    static __elementEquals(m1, m2) {
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
    get RowCount() {
        return 0;
    }
    get ColmunCount() {
        return 0;
    }
    getAt(row, colmun) {
        throw new Error("Not implemented");
    }
    getBySingleIndex(index) {
        throw new Error("Not implemented");
    }
}
export default MatrixBase;
