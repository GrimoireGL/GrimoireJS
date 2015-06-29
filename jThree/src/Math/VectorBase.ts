import JThreeObject=require('Base/JThreeObject');
import Collection = require("../Base/Collections/Collection");
import glm=require('glm');
class VectorBase {

    private magnitudeSquaredCache: number = -1;

    get magnitudeSquared(): number {
        if (this.magnitudeSquaredCache < 0) {
            var sum: number = 0;
            var r=this.RawElements;
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
            if(v1.RawElements[i]!==v2.RawElements[i])return false;
        }
        return true;
    }

    private magnitudeCache: number = -1;

    get magnitude() {
        if (this.magnitudeCache < 0) {
            this.magnitudeCache = Math.sqrt(this.magnitudeSquared);
        }
        return this.magnitudeCache;
    }

    public get ElementCount():number
    {
        return 0;
    }
    
    public get RawElements():glm.GLM.IArray
    {
        return null;
    }

}

export=VectorBase;
