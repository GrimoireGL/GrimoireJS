import Vector3 = require("../../../Math/Vector3");
import PointList = require("../../../Math/PointList");
import Matrix = require("../../../Math/Matrix");
class ShadowMathHelper
{
  public static computeViewFrustum(viewProj:Matrix):PointList
  {
    var pl = new PointList();
    pl.addPoint( new Vector3(-1.0, +1.0, -1.0 ));
  	pl.addPoint(new Vector3(-1.0, -1.0, -1.0 ));
  	pl.addPoint(new Vector3(+1.0, -1.0, -1.0 ));
  	pl.addPoint(new Vector3(+1.0, +1.0, -1.0 ));
  	pl.addPoint(new Vector3(-1.0, +1.0, +1.0 ));
  	pl.addPoint(new Vector3(-1.0, -1.0, +1.0 ));
  	pl.addPoint(new Vector3(+1.0, -1.0, +1.0 ));
  	pl.addPoint(new Vector3(+1.0, +1.0, +1.0 ));
    pl.transform(Matrix.inverse(viewProj));
    return pl;
  }
}

export = ShadowMathHelper;
