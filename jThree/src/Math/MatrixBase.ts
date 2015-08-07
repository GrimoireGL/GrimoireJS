import glm=require('glm');
class MatrixBase {

    protected static elementEqual(m1:MatrixBase,m2:MatrixBase):boolean
    {
        if(m1.RowCount!==m2.RowCount||m1.ColmunCount!==m2.ColmunCount)return false;
        var count=m1.RowCount*m2.ColmunCount;
        for(var i=0;i<count;i++)
        {
            if(m1.getBySingleIndex(i)!==m2.getBySingleIndex(i))return false;
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
    
    public get RawElements():glm.GLM.IArray{
        return null;
    }
}
export=MatrixBase;
