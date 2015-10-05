import glm=require('gl-matrix');
class VectorBase {

    private magnitudeSquaredCache: number = -1;

    public get sqrMagnitude(): number {
        if (this.magnitudeSquaredCache < 0) {
            var sum: number = 0;
            var r=this.rawElements;
            for(var i=0;i<this.ElementCount;i++)
            {
                sum+=r[i]*r[i];
            }
            this.magnitudeSquaredCache = sum;
        }
        return this.magnitudeSquaredCache;
    }

    protected static elementEqual(v1:VectorBase,v2:VectorBase):boolean
    {
        if(v1.ElementCount!==v2.ElementCount)return false;
        for(var i=0;i<v1.ElementCount;i++)
        {
            if(v1.rawElements[i]!==v2.rawElements[i])return false;
        }
        return true;
    }

    private magnitudeCache: number = -1;

    public get magnitude() {
        if (this.magnitudeCache < 0) {
            this.magnitudeCache = Math.sqrt(this.sqrMagnitude);
        }
        return this.magnitudeCache;
    }

    public get ElementCount():number
    {
        return 0;
    }

    public rawElements:glm.GLM.IArray;

}

export=VectorBase;
